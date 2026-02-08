# API Reference

## Table of Contents
1. [Data Structures](#data-structures)
2. [Services](#services)
3. [Components](#components)
4. [Pages](#pages)
5. [Hooks](#hooks)


## Data Structures

### Graph

```javascript
import { Graph } from '@/backend/dsa/Graph';
```

#### Constructor
```javascript
const graph = new Graph(isDirected = false);
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| isDirected | boolean | false | Whether edges are directed |

#### Methods

##### addNode(value)
```javascript
graph.addNode(value);
```
Adds a new node to the graph.

| Parameter | Type | Description |
|-----------|------|-------------|
| value | any | Node value |

##### addEdge(source, target, weight = 1)
```javascript
graph.addEdge('A', 'B', 5);
```
Adds an edge between two nodes.

| Parameter | Type | Description |
|-----------|------|-------------|
| source | any | Source node value |
| target | any | Target node value |
| weight | number | Edge weight (default: 1) |

##### bfs(start)
```javascript
const visited = graph.bfs('A');
// Returns: Set of visited nodes
```
Breadth-First Search traversal.

| Parameter | Type | Description |
|-----------|------|-------------|
| start | any | Starting node value |

**Returns:** Set of visited nodes

##### dfs(start)
```javascript
const visited = graph.dfs('A');
// Returns: Set of visited nodes
```
Depth-First Search traversal.

| Parameter | Type | Description |
|-----------|------|-------------|
| start | any | Starting node value |

**Returns:** Set of visited nodes

##### dijkstra(start, end)
```javascript
const shortestPath = graph.dijkstra('A', 'Z');
// Returns: { path: ['A', 'B', 'Z'], distance: 15 }
```
Finds shortest path using Dijkstra's algorithm.

| Parameter | Type | Description |
|-----------|------|-------------|
| start | any | Starting node |
| end | any | Target node |

**Returns:** `{ path: any[], distance: number }`

##### bellmanFord(source)
```javascript
const distances = graph.bellmanFord('A');
// Returns: Map of distances
```
Finds shortest paths from source (handles negative weights).

| Parameter | Type | Description |
|-----------|------|-------------|
| source | any | Source node |

**Returns:** Map of shortest distances

##### topologicalSort()
```javascript
const order = graph.topologicalSort();
// Returns: Array of nodes in topological order
```
Topological sort for DAGs.

**Returns:** Array of nodes in topological order


### Heap

```javascript
import { MinHeap, MaxHeap } from '@/backend/dsa/Heap';
```

#### MinHeap

##### Constructor
```javascript
const minHeap = new MinHeap();
```

##### insert(value)
```javascript
minHeap.insert(10);
minHeap.insert(5);
minHeap.insert(20);
```
Inserts a value into the heap.

##### extractMin()
```javascript
const min = minHeap.extractMin();
// Returns: 5
```
Removes and returns the minimum value.

**Returns:** Minimum value

##### peek()
```javascript
const min = minHeap.peek();
// Returns: 5 (without removal)
```
Returns minimum without removal.

**Returns:** Minimum value

##### size()
```javascript
const count = minHeap.size();
```
**Returns:** Number of elements


### SegmentTree

```javascript
import { SegmentTree } from '@/backend/dsa/SegmentTree';
```

#### Constructor
```javascript
const arr = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| arr | number[] | Input array |

#### Methods

##### build()
```javascript
segTree.build();
```
Builds the segment tree from the array.

##### update(index, value)
```javascript
segTree.update(2, 10);
```
Updates value at index.

| Parameter | Type | Description |
|-----------|------|-------------|
| index | number | Array index |
| value | number | New value |

##### query(l, r)
```javascript
const sum = segTree.query(1, 4);
```
Range query (inclusive).

| Parameter | Type | Description |
|-----------|------|-------------|
| l | number | Left index |
| r | number | Right index |

**Returns:** Query result

##### rangeSum(l, r)
```javascript
const sum = segTree.rangeSum(1, 4);
```
Sum of range.

**Returns:** Sum value


### UnionFind

```javascript
import { UnionFind } from '@/backend/dsa/UnionFind';
```

#### Constructor
```javascript
const uf = new UnionFind(n);  // n = number of elements
```

| Parameter | Type | Description |
|-----------|------|-------------|
| n | number | Number of elements |

#### Methods

##### find(x)
```javascript
const root = uf.find(3);
```
Finds root with path compression.

| Parameter | Type | Description |
|-----------|------|-------------|
| x | number | Element index |

**Returns:** Root index

##### union(x, y)
```javascript
uf.union(3, 5);
```
Unites two sets.

| Parameter | Type | Description |
|-----------|------|-------------|
| x | number | First element |
| y | number | Second element |

##### connected(x, y)
```javascript
const isConnected = uf.connected(3, 5);
```
Checks if two elements are in the same set.

**Returns:** boolean

##### count()
```javascript
const count = uf.count();
```
**Returns:** Number of disjoint sets

### BinaryIndexedTree

```javascript
import { BinaryIndexedTree } from '@/backend/dsa/BinaryIndexedTree';
```

#### Constructor
```javascript
const bit = new BinaryIndexedTree(arr);
```

##### update(index, delta)
```javascript
bit.update(2, 5);
```
Adds delta to element at index.

##### prefixSum(index)
```javascript
const sum = bit.prefixSum(4);
```
Sum from 0 to index.

**Returns:** Sum value

##### rangeQuery(l, r)
```javascript
const sum = bit.rangeQuery(1, 4);
```
Sum of range.

**Returns:** Sum value


## Services

### RateLimiter

```javascript
import { TokenBucket } from '@/backend/services/RateLimiter';
```

#### Constructor
```javascript
const limiter = new TokenBucket({
  capacity: 100,       // Max tokens
  refillRate: 10        // Tokens per second
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| capacity | number | 100 | Maximum tokens |
| refillRate | number | 10 | Tokens added per second |

#### Methods

##### tryConsume(tokens = 1)
```javascript
const allowed = limiter.tryConsume(5);
```
Attempts to consume tokens.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| tokens | number | 1 | Tokens to consume |

**Returns:** boolean (true if allowed)

##### getState()
```javascript
const state = limiter.getState();
// { tokens: 95, capacity: 100, refillRate: 10 }
```
**Returns:** Current state object

##### reset()
```javascript
limiter.reset();
```
Resets the rate limiter.


### CircuitBreaker

```javascript
import { CircuitBreaker } from '@/backend/services/CircuitBreaker';
```

#### Constructor
```javascript
const breaker = new CircuitBreaker({
  failureThreshold: 5,  // Failures before opening
  timeout: 30000        // Time in ms before trying again
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| failureThreshold | number | 5 | Failures to open circuit |
| timeout | number | 30000 | Recovery timeout (ms) |

#### Methods

##### execute(fn)
```javascript
try {
  const result = await breaker.execute(async () => {
    return await fetch('/api/data');
  });
} catch (error) {
  // Circuit is open
}
```
Executes function with circuit breaker protection.

| Parameter | Type | Description |
|-----------|------|-------------|
| fn | Function | Async function to execute |

**Returns:** Function result

##### open()
```javascript
breaker.open();
```
Manually opens the circuit.

##### close()
```javascript
breaker.close();
```
Manually closes the circuit.

##### getState()
```javascript
const state = breaker.getState();
// 'CLOSED' | 'OPEN' | 'HALF_OPEN'
```
**Returns:** Current state


### DistributedLock

```javascript
import { DistributedLock } from '@/backend/services/DistributedLock';
```

#### Constructor
```javascript
const lock = new DistributedLock({
  ttl: 30000  // Lock timeout (ms)
});
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| ttl | number | 30000 | Lock time-to-live (ms) |

#### Methods

##### acquire(key)
```javascript
const acquired = await lock.acquire('my-resource');
```
Acquires a lock.

| Parameter | Type | Description |
|-----------|------|-------------|
| key | string | Resource key |

**Returns:** boolean

##### release(key)
```javascript
await lock.release('my-resource');
```
Releases a lock.

##### isLocked(key)
```javascript
const locked = lock.isLocked('my-resource');
```
**Returns:** boolean


### FileStorage

```javascript
import { FileStorage } from '@/backend/services/FileStorage';
```

#### Constructor
```javascript
const storage = new FileStorage({
  basePath: '/uploads'  // Base storage path
});
```

#### Methods

##### upload(file)
```javascript
const result = await storage.upload(file);
```
Uploads a file.

**Returns:** Upload result object

##### download(filename)
```javascript
const data = await storage.download('file.txt');
```
Downloads a file.

**Returns:** File data

##### list()
```javascript
const files = await storage.list();
```
Lists all files.

**Returns:** Array of file info

##### delete(filename)
```javascript
await storage.delete('file.txt');
```
Deletes a file.


### SearchEngine

```javascript
import { SearchEngine } from '@/backend/services/SearchEngine';
```

#### Constructor
```javascript
const engine = new SearchEngine();
```

#### Methods

##### index(document)
```javascript
engine.index({
  id: '1',
  title: 'Document Title',
  content: 'Document content here'
});
```
Indexes a document.

##### search(query)
```javascript
const results = engine.search('search term');
// [{ id: '1', score: 0.95, document: {...} }]
```
Searches the index.

**Returns:** Array of results with scores

##### delete(id)
```javascript
engine.delete('1');
```
Deletes document from index.

##### clear()
```javascript
engine.clear();
```
Clears the entire index.

## Components

### SystemStats

```javascript
import { SystemStats } from '@/components/SystemStats';
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| data | object | System metrics data |
| loading | boolean | Loading state |

### Analytics

```javascript
import { Analytics } from '@/components/Analytics';
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| data | array | Chart data |
| type | string | Chart type (line, area) |

### SearchBar

```javascript
import { SearchBar } from '@/components/SearchBar';
```

#### Props

| Prop | Type | Description |
|------|------|-------------|
| onSearch | function | Search callback |
| placeholder | string | Placeholder text |


## Pages

### Dashboard (/page.jsx)

**Route:** `/`

**Features:**
- Overview statistics
- Quick navigation
- System status

### Visualizer (/visualize/page.jsx)

**Route:** `/visualize`

**Features:**
- Algorithm selection
- Step-by-step visualization
- Speed controls
- Statistics display

### Analytics (/analytics/page.jsx)

**Route:** `/analytics`

**Features:**
- Performance charts
- Time range selection
- Export capabilities

### Systems (/systems/page.jsx)

**Route:** `/systems`

**Features:**
- Component list
- Service status
- Configuration viewing

### Monitoring (/monitoring/page.jsx)

**Route:** `/monitoring`

**Features:**
- Real-time metrics
- Service health
- Alert monitoring

### Documentation (/docs/page.jsx)

**Route:** `/docs`

**Features:**
- API documentation
- Code examples
- Complexity guides


## Hooks

### useMobile

```javascript
import { useMobile } from '@/hooks/use-mobile';
```

**Returns:** boolean (true if mobile viewport)

### useToast

```javascript
import { useToast } from '@/hooks/use-toast';
```

**Returns:** Object with:
- `toast()` - Show notification
- `dismiss()` - Hide notification

## 👨‍💻 Author

Designed and developed with a focus on clean architecture, performance, and developer experience.

<div align="center">

**Ujjwal Saini**  
_Full-Stack Developer_

🌐 [ujjwalsaini.dev](https://www.ujjwalsaini.dev/) · 🐙 [GitHub](https://github.com/UjjwalSaini07)

</div>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>