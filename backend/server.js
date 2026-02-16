const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const FileStorage = require('./services/FileStorage');
const MongoDBStorage = require('./services/MongoDBStorage');
const SearchEngine = require('./services/SearchEngine');

// DSA Imports
const { Graph } = require('./dsa/Graph');
const { MinHeap, MaxHeap, MedianHeap } = require('./dsa/Heap');
const { SegmentTree, SparseSegmentTree } = require('./dsa/SegmentTree');
const { UnionFind, WeightedUnionFind, RollbackUnionFind } = require('./dsa/UnionFind');
const { BinaryIndexedTree, BIT2D } = require('./dsa/BinaryIndexedTree');

// System Service Imports
const { 
  TokenBucket, LeakyBucket, SlidingWindow, FixedWindow, DistributedRateLimiter 
} = require('./services/RateLimiter');
const { 
  CircuitBreaker, BulkheadCircuitBreaker, CircuitBreakerRegistry, STATE 
} = require('./services/CircuitBreaker');
const { DistributedLock, Redlock, LeaderElection } = require('./services/DistributedLock');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize systems
const fileStorage = new FileStorage();
const mongoDBStorage = new MongoDBStorage();
const searchEngine = new SearchEngine(150);

// Storage mode: 'tmp' or 'mongodb'
let currentStorageMode = 'tmp';

// Auto-connect to MongoDB on startup and load files into search index
(async () => {
  try {
    const result = await mongoDBStorage.connect();
    if (result.success) {
      console.log(chalk.green('✅ MongoDB auto-connected successfully'));
      
      // Load existing files from MongoDB into search index
      const files = await mongoDBStorage.getAllFiles();
      if (files.length > 0) {
        console.log(chalk.blue(`📚 Indexing ${files.length} files from MongoDB...`));
        for (const file of files) {
          if (file.content) {
            searchEngine.indexFile(file._id || file.id, file.filename, file.content);
          }
        }
        console.log(chalk.green('✅ Search index loaded from MongoDB'));
      }
    } else {
      console.log(chalk.yellow('⚠️ MongoDB auto-connection failed:'), result.message);
    }
  } catch (error) {
    console.log(chalk.yellow('⚠️ MongoDB not available:'), error.message);
  }
})();

// DSA Instances
const graph = new Graph(false, true);
const minHeap = new MinHeap();
const segmentTree = new SegmentTree([1, 3, 5, 7, 9, 11], 'sum');
const unionFind = new UnionFind(10);
const bit = new BinaryIndexedTree([1, 3, 5, 7, 9]);

// System Service Instances
const tokenBucket = new TokenBucket({ capacity: 10, refillRate: 2 });
const slidingWindow = new SlidingWindow({ windowSize: 60000, maxRequests: 100 });
const circuitBreaker = new CircuitBreaker({ failureThreshold: 5, timeout: 30000 });
const distributedLock = new DistributedLock({ ttl: 30000 });

// ==================== FILE & SEARCH ENDPOINTS ====================

// Upload file
app.post('/api/files/upload', async (req, res) => {
  try {
    const { filename, content, mimeType, storageType } = req.body;

    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing filename or content'
      });
    }

    // Use specified storage type or current mode
    const mode = storageType || currentStorageMode;
    let result;

    if (mode === 'mongodb' && mongoDBStorage.connected) {
      // Upload to MongoDB
      result = await mongoDBStorage.uploadFile(filename, content, mimeType);
      
      if (result.success) {
        // Also index in search engine
        searchEngine.indexFile(result.fileId, filename, content);
      }
    } else {
      // Upload to tmp storage
      result = fileStorage.uploadFile(filename, content, mimeType);
      
      if (result.success) {
        searchEngine.indexFile(result.fileId, filename, content);
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all files
app.get('/api/files', async (req, res) => {
  try {
    let files;
    const storageType = req.query.storageType || currentStorageMode;
    
    if (storageType === 'mongodb' && mongoDBStorage.connected) {
      files = await mongoDBStorage.getAllFiles();
    } else {
      files = fileStorage.getAllFiles();
    }
    
    res.json({ success: true, files, storageType: storageType });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get specific file
app.get('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { storageType } = req.query;
    const mode = storageType || currentStorageMode;
    
    let file;
    if (mode === 'mongodb' && mongoDBStorage.connected) {
      file = await mongoDBStorage.getFile(fileId);
    } else {
      file = fileStorage.getFile(fileId);
    }

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    res.json({ success: true, file, storageType: mode });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete file
app.delete('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { storageType } = req.query;
    const mode = storageType || currentStorageMode;
    
    let deleted;
    if (mode === 'mongodb' && mongoDBStorage.connected) {
      deleted = await mongoDBStorage.deleteFile(fileId);
    } else {
      deleted = fileStorage.deleteFile(fileId);
    }

    res.json({ success: deleted, message: deleted ? 'File deleted' : 'File not found' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Full-text search
app.get('/api/search', (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, message: 'Missing search query' });
    }

    const searchResult = searchEngine.search(q, parseInt(limit));
    res.json({ success: true, query: q, ...searchResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Autocomplete
app.get('/api/autocomplete', (req, res) => {
  try {
    const { prefix, limit = 10 } = req.query;

    if (!prefix) {
      return res.status(400).json({ success: false, message: 'Missing prefix' });
    }

    const result = searchEngine.autocomplete(prefix, parseInt(limit));
    res.json({ success: true, prefix, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stats
app.get('/api/stats', async (req, res) => {
  try {
    const systemState = searchEngine.getSystemState();
    const fileStats = fileStorage.getStats();
    const mongoStats = await mongoDBStorage.getStats();

    // Combine stats based on current storage mode
    const currentStorage = currentStorageMode === 'mongodb' ? mongoStats : fileStats;
    
    res.json({
      success: true,
      systemState: {
        ...systemState,
        fileStorage: currentStorage
      },
      tmpStorage: fileStats,
      mongodbStorage: mongoStats,
      currentStorageMode,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

// Get file by unique code
app.get('/api/files/code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    if (!code || code.length !== 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid code. Code must be 5 digits.'
      });
    }

    const file = await mongoDBStorage.getFileByCode(code);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found with this code'
      });
    }

    res.json({
      success: true,
      file,
      message: 'File retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== GRAPH ENDPOINTS ====================

app.post('/api/ds/graph/node', (req, res) => {
  try {
    const { value, metadata } = req.body;
    graph.addNode(value, metadata || {});
    res.json({ success: true, message: 'Node added', nodeCount: graph.nodes.size });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ds/graph/edge', (req, res) => {
  try {
    const { source, target, weight } = req.body;
    graph.addEdge(source, target, weight || 1);
    res.json({ success: true, message: 'Edge added', edgeCount: graph.edgeCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/bfs', (req, res) => {
  try {
    const { start, target } = req.query;
    const result = graph.bfs(start, target || null);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/dijkstra', (req, res) => {
  try {
    const { start, target } = req.query;
    const result = graph.dijkstra(start, target);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/cycles', (req, res) => {
  try {
    const result = graph.detectCycles();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/topological', (req, res) => {
  try {
    const result = graph.topologicalSort();
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/components', (req, res) => {
  try {
    const result = graph.getConnectedComponents();
    res.json({ success: true, components: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/pagerank', (req, res) => {
  try {
    const result = graph.pageRank();
    res.json({ success: true, rankings: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/graph/stats', (req, res) => {
  res.json({ success: true, ...graph.getStats() });
});

// ==================== HEAP ENDPOINTS ====================

app.post('/api/ds/heap/insert', (req, res) => {
  try {
    const { value } = req.body;
    minHeap.insert(value);
    res.json({ success: true, size: minHeap.heap.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ds/heap/extract', (req, res) => {
  try {
    const value = minHeap.extractMin();
    res.json({ success: true, value, size: minHeap.heap.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ds/heap/heapify', (req, res) => {
  try {
    const { array } = req.body;
    minHeap.heapify(array);
    res.json({ success: true, size: minHeap.heap.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/heap/peek', (req, res) => {
  res.json({ success: true, value: minHeap.peek() });
});

app.get('/api/ds/heap/stats', (req, res) => {
  res.json({ success: true, ...minHeap.getStats() });
});

// ==================== SEGMENT TREE ENDPOINTS ====================

app.post('/api/ds/segmenttree', (req, res) => {
  try {
    const { array, operation } = req.body;
    const st = new SegmentTree(array, operation || 'sum');
    res.json({ success: true, size: st.n, treeSize: st.tree.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/segmenttree/query', (req, res) => {
  try {
    const { l, r } = req.query;
    const result = segmentTree.query(parseInt(l), parseInt(r));
    res.json({ success: true, range: [l, r], result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/ds/segmenttree/update', (req, res) => {
  try {
    const { index, value } = req.body;
    segmentTree.update(index, value);
    res.json({ success: true, message: 'Updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/segmenttree/stats', (req, res) => {
  res.json({ success: true, ...segmentTree.getStats() });
});

// ==================== UNION-FIND ENDPOINTS ====================

app.post('/api/ds/unionfind/union', (req, res) => {
  try {
    const { x, y } = req.body;
    const result = unionFind.union(x, y);
    res.json({ success: true, merged: result, sets: unionFind.countSets() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/unionfind/find', (req, res) => {
  try {
    const { x } = req.query;
    const result = unionFind.find(x);
    res.json({ success: true, element: x, root: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/unionfind/connected', (req, res) => {
  try {
    const { x, y } = req.query;
    const result = unionFind.connected(x, y);
    res.json({ success: true, x, y, connected: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/unionfind/sets', (req, res) => {
  res.json({ success: true, sets: unionFind.getSets() });
});

app.get('/api/ds/unionfind/stats', (req, res) => {
  res.json({ success: true, ...unionFind.getStats() });
});

// ==================== BIT ENDPOINTS ====================

app.post('/api/ds/bit', (req, res) => {
  try {
    const { array } = req.body;
    const bit = new BinaryIndexedTree(array);
    res.json({ success: true, size: bit.n });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/bit/prefix', (req, res) => {
  try {
    const { index } = req.query;
    const result = bit.prefixSum(parseInt(index));
    res.json({ success: true, index, prefixSum: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/bit/range', (req, res) => {
  try {
    const { l, r } = req.query;
    const result = bit.rangeSum(parseInt(l), parseInt(r));
    res.json({ success: true, range: [l, r], sum: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/ds/bit/stats', (req, res) => {
  res.json({ success: true, ...bit.getStats() });
});

// ==================== RATE LIMITER ENDPOINTS ====================

app.post('/api/system/ratelimiter/consume', (req, res) => {
  try {
    const { tokens } = req.body;
    const allowed = tokenBucket.tryConsume(tokens || 1);
    res.json({ success: true, allowed, state: tokenBucket.getState() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/system/ratelimiter/state', (req, res) => {
  res.json({ success: true, ...tokenBucket.getState() });
});

app.post('/api/system/ratelimiter/reset', (req, res) => {
  tokenBucket.reset();
  res.json({ success: true, message: 'Rate limiter reset' });
});

// Sliding Window
app.post('/api/system/slidingwindow/request', (req, res) => {
  try {
    const allowed = slidingWindow.tryRequest();
    res.json({ success: true, allowed, remaining: slidingWindow.getRemaining() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/system/slidingwindow/state', (req, res) => {
  res.json({ success: true, ...slidingWindow.getState() });
});

// ==================== CIRCUIT BREAKER ENDPOINTS ====================

app.post('/api/system/circuitbreaker/execute', async (req, res) => {
  try {
    const { fn } = req.body;
    const result = await circuitBreaker.execute(async () => {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      if (Math.random() < 0.3) throw new Error('Simulated failure');
      return { success: true, data: 'Operation result' };
    });
    res.json({ success: true, result, state: circuitBreaker.getState() });
  } catch (error) {
    res.json({ success: false, error: error.message, state: circuitBreaker.getState() });
  }
});

app.get('/api/system/circuitbreaker/state', (req, res) => {
  res.json({ success: true, ...circuitBreaker.getState() });
});

app.post('/api/system/circuitbreaker/open', (req, res) => {
  circuitBreaker.open();
  res.json({ success: true, message: 'Circuit breaker opened' });
});

app.post('/api/system/circuitbreaker/close', (req, res) => {
  circuitBreaker.close();
  res.json({ success: true, message: 'Circuit breaker closed' });
});

// ==================== DISTRIBUTED LOCK ENDPOINTS ====================

app.post('/api/system/distributedlock/acquire', async (req, res) => {
  try {
    const { lockName, ttl } = req.body;
    const result = await distributedLock.acquire(lockName || 'default', ttl);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/system/distributedlock/release', async (req, res) => {
  try {
    const { lockName, token } = req.body;
    const result = await distributedLock.release(lockName, token);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/system/distributedlock/extend', async (req, res) => {
  try {
    const { lockName, token, ttl } = req.body;
    const result = await distributedLock.extend(lockName, token, ttl);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/system/distributedlock/locks', (req, res) => {
  res.json({ success: true, locks: distributedLock.getAllLocks() });
});

app.get('/api/system/distributedlock/stats', (req, res) => {
  res.json({ success: true, ...distributedLock.getStats() });
});

// ==================== STORAGE MODE ENDPOINTS ====================

// Connect to MongoDB
app.post('/api/storage/mongodb/connect', async (req, res) => {
  try {
    const { connectionString } = req.body;
    const result = await mongoDBStorage.connect(connectionString);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get MongoDB status
app.get('/api/storage/mongodb/status', async (req, res) => {
  try {
    const stats = await mongoDBStorage.getStats();
    res.json({
      success: true,
      connected: mongoDBStorage.connected,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Set storage mode
app.post('/api/storage/mode', (req, res) => {
  try {
    const { mode } = req.body;
    
    if (!['tmp', 'mongodb'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid storage mode. Use "tmp" or "mongodb"'
      });
    }

    if (mode === 'mongodb' && !mongoDBStorage.connected) {
      return res.status(400).json({
        success: false,
        message: 'MongoDB not connected. Connect first using POST /api/storage/mongodb/connect'
      });
    }

    currentStorageMode = mode;
    res.json({
      success: true,
      mode: currentStorageMode,
      message: `Storage mode set to ${mode}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get current storage mode
app.get('/api/storage/mode', (req, res) => {
  res.json({
    success: true,
    mode: currentStorageMode,
    mongodbConnected: mongoDBStorage.connected
  });
});

// Disconnect from MongoDB
app.post('/api/storage/mongodb/disconnect', async (req, res) => {
  try {
    await mongoDBStorage.disconnect();
    // Switch back to tmp if MongoDB was disconnected
    if (currentStorageMode === 'mongodb') {
      currentStorageMode = 'tmp';
    }
    res.json({ success: true, message: 'Disconnected from MongoDB' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==================== ALL DSA STATS ====================

app.get('/api/ds/stats', (req, res) => {
  res.json({
    success: true,
    dataStructures: {
      graph: graph.getStats(),
      heap: minHeap.getStats(),
      segmentTree: segmentTree.getStats(),
      unionFind: unionFind.getStats(),
      bit: bit.getStats()
    },
    timestamp: Date.now()
  });
});

app.get('/api/system/stats', (req, res) => {
  res.json({
    success: true,
    services: {
      rateLimiter: tokenBucket.getState(),
      slidingWindow: slidingWindow.getState(),
      circuitBreaker: circuitBreaker.getState(),
      distributedLock: distributedLock.getStats()
    },
    timestamp: Date.now()
  });
});

// Reset all
app.post('/api/reset', async (req, res) => {
  try {
    fileStorage.clear();
    await mongoDBStorage.clear();
    searchEngine.clear();
    graph.clear();
    minHeap.clear();
    segmentTree.clear();
    unionFind.clear();
    bit.clear();
    tokenBucket.reset();
    slidingWindow.reset();
    circuitBreaker.reset();
    distributedLock.reset();

    res.json({ success: true, message: 'All systems reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(chalk.cyanBright('\n🚀 DSA Atlas API Server running on http://localhost:' + PORT));
  console.log(chalk.gray('='.repeat(60)));
  console.log(chalk.blue('\n📁 File & Search Endpoints:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/files/upload'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/files'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/search?q=query'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/stats'));
  
  console.log(chalk.blue('\n📊 Graph Algorithms:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/graph/node'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/graph/edge'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/graph/bfs?start=A&target=B'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/graph/dijkstra?start=A&target=B'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/graph/cycles'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/graph/pagerank'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/graph/stats'));

  console.log(chalk.blue('\n🌳 Heap:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/heap/insert'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/heap/extract'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/heap/peek'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/heap/stats'));

  console.log(chalk.blue('\n📈 Segment Tree:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/segmenttree'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/segmenttree/query?l=0&r=5'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/segmenttree/update'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/segmenttree/stats'));

  console.log(chalk.blue('\n🔗 Union-Find:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/unionfind/union'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/unionfind/find?x=5'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/unionfind/connected?x=3&y=7'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/unionfind/sets'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/unionfind/stats'));

  console.log(chalk.blue('\n📊 Binary Indexed Tree:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/ds/bit'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/bit/prefix?index=5'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/bit/range?l=2&r=7'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/bit/stats'));

  console.log(chalk.blue('\n⚡ System Services:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/system/ratelimiter/consume'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/system/ratelimiter/state'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/system/circuitbreaker/execute'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/system/circuitbreaker/state'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/system/distributedlock/acquire'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/system/distributedlock/release'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/system/distributedlock/locks'));

  console.log(chalk.blue('\n🗄️ Storage Services:'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/storage/mongodb/connect'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/storage/mongodb/status'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/storage/mode'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/storage/mode'));

  console.log(chalk.blue('\n📈 Combined Stats:'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/ds/stats'));
  console.log(chalk.gray('   GET    ') + chalk.white('/api/system/stats'));
  console.log(chalk.gray('   POST   ') + chalk.white('/api/reset'));
  
  console.log(chalk.gray('\n' + '='.repeat(60)));
});

module.exports = app;
