const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const FileStorage = require('./backend/services/FileStorage');
const SearchEngine = require('./backend/services/SearchEngine');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize systems
const fileStorage = new FileStorage();
const searchEngine = new SearchEngine(150);

// Upload file
app.post('/api/files/upload', (req, res) => {
  try {
    const { filename, content, mimeType } = req.body;

    if (!filename || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing filename or content'
      });
    }

    const result = fileStorage.uploadFile(filename, content, mimeType);
    
    if (result.success) {
      // Auto-index the file
      searchEngine.indexFile(result.fileId, filename, content);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all files metadata
app.get('/api/files', (req, res) => {
  try {
    const files = fileStorage.getAllFiles();
    res.json({
      success: true,
      files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get specific file
app.get('/api/files/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const file = fileStorage.getFile(fileId);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      file
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get file version history
app.get('/api/files/:filename/versions', (req, res) => {
  try {
    const { filename } = req.params;
    const history = fileStorage.getVersionHistory(filename);

    res.json({
      success: true,
      filename,
      versions: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete file
app.delete('/api/files/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const deleted = fileStorage.deleteFile(fileId);

    res.json({
      success: deleted,
      message: deleted ? 'File deleted' : 'File not found'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Full-text search
app.get('/api/search', (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Missing search query'
      });
    }

    const searchResult = searchEngine.search(q, parseInt(limit));

    res.json({
      success: true,
      query: q,
      ...searchResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Autocomplete
// GET /api/autocomplete?prefix=test&limit=10
app.get('/api/autocomplete', (req, res) => {
  try {
    const { prefix, limit = 10 } = req.query;

    if (!prefix) {
      return res.status(400).json({
        success: false,
        message: 'Missing prefix'
      });
    }

    const result = searchEngine.autocomplete(prefix, parseInt(limit));

    res.json({
      success: true,
      prefix,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Boolean search
// GET /api/search/boolean?q=word1+AND+word2
app.get('/api/search/boolean', (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Missing query'
      });
    }

    const result = searchEngine.booleanSearch(q);

    res.json({
      success: true,
      query: q,
      ...result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get complete system state
// GET /api/stats
app.get('/api/stats', (req, res) => {
  try {
    const systemState = searchEngine.getSystemState();
    const fileStats = fileStorage.getStats();

    res.json({
      success: true,
      systemState,
      fileStorage: fileStats,
      timestamp: Date.now()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
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

// Reset all systems (for demo)
app.post('/api/reset', (req, res) => {
  try {
    fileStorage.clear();
    searchEngine.clear();

    res.json({
      success: true,
      message: 'All systems reset'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Scalable Systems Simulator running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST   /api/files/upload');
  console.log('  GET    /api/files');
  console.log('  GET    /api/files/:fileId');
  console.log('  DELETE /api/files/:fileId');
  console.log('  GET    /api/search?q=query');
  console.log('  GET    /api/autocomplete?prefix=test');
  console.log('  GET    /api/search/boolean?q=word1+AND+word2');
  console.log('  GET    /api/stats');
  console.log('  POST   /api/reset');
});

module.exports = app;
