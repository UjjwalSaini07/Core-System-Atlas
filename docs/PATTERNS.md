# Design Patterns

## Table of Contents
1. [Creational Patterns](#creational-patterns)
2. [Structural Patterns](#structural-patterns)
3. [Behavioral Patterns](#behavioral-patterns)
4. [Concurrency Patterns](#concurrency-patterns)

## Creational Patterns

### Singleton Pattern

**Definition:** Ensure a class has only one instance and provide a global point of access to it.

**Use Case:** Rate limiter, configuration manager

```javascript
// Singleton implementation
class RateLimiter {
  constructor() {
    if (RateLimiter.instance) {
      return RateLimiter.instance;
    }
    this.tokens = 100;
    RateLimiter.instance = this;
  }
  
  tryConsume(n = 1) {
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }
}

const limiter = new RateLimiter(); // Always returns same instance
```

**Implementation in Project:**
- `backend/services/RateLimiter.js` - Token bucket singleton

### Factory Pattern

**Definition:** Create objects without specifying the exact class of object that will be created.

**Use Case:** Creating different algorithm implementations

```javascript
// Factory implementation
class DataStructureFactory {
  static create(type, options = {}) {
    switch (type) {
      case 'graph':
        return new Graph(options.isDirected);
      case 'heap':
        return new Heap(options.isMin);
      case 'segment':
        return new SegmentTree(options.array);
      case 'unionfind':
        return new UnionFind(options.size);
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}

// Usage
const ds = DataStructureFactory.create('graph', { isDirected: true });
```


### Builder Pattern

**Definition:** Construct complex objects step by step.

**Use Case:** Building complex queries or configurations

```javascript
// Builder implementation
class QueryBuilder {
  constructor() {
    this.filters = [];
    this.sorts = [];
    this.limit = 100;
  }
  
  where(condition) {
    this.filters.push(condition);
    return this;
  }
  
  orderBy(field, direction = 'asc') {
    this.sorts.push({ field, direction });
    return this;
  }
  
  take(n) {
    this.limit = n;
    return this;
  }
  
  build() {
    return {
      filters: this.filters,
      sorts: this.sorts,
      limit: this.limit
    };
  }
}

// Usage
const query = new QueryBuilder()
  .where({ status: 'active' })
  .orderBy('createdAt', 'desc')
  .take(10)
  .build();
```


## Structural Patterns

### Adapter Pattern

**Definition:** Convert the interface of a class into another interface clients expect.

**Use Case:** Integrating different algorithm implementations

```javascript
// Adapter implementation
class LegacyGraph {
  legacyBFS(start) { /* old implementation */ }
  legacyDFS(start) { /* old implementation */ }
}

class ModernGraph {
  traverse(strategy) { /* new implementation */ }
}

class GraphAdapter {
  constructor(legacyGraph) {
    this.legacy = legacyGraph;
  }
  
  traverse(strategy) {
    if (strategy === 'bfs') {
      return this.legacy.legacyBFS(strategy.start);
    }
    return this.legacy.legacyDFS(strategy.start);
  }
}

// Usage
const legacy = new LegacyGraph();
const adapter = new GraphAdapter(legacy);
adapter.traverse({ strategy: 'bfs', start: 'A' });
```


### Decorator Pattern

**Definition:** Add behavior to objects dynamically.

**Use Case:** Adding metrics, logging, caching

```javascript
// Decorator implementation
class Timer {
  constructor(wrapped) {
    this.wrapped = wrapped;
  }
  
  async execute(fn, ...args) {
    const start = performance.now();
    const result = await this.wrapped.execute(fn, ...args);
    const duration = performance.now() - start;
    console.log(`${fn.name} took ${duration}ms`);
    return result;
  }
}

class CircuitBreaker {
  constructor(wrapped) {
    this.wrapped = wrapped;
    this.failures = 0;
    this.threshold = 5;
  }
  
  async execute(fn, ...args) {
    if (this.failures >= this.threshold) {
      throw new Error('Circuit open');
    }
    try {
      return await this.wrapped.execute(fn, ...args);
    } catch (e) {
      this.failures++;
      throw e;
    }
  }
}
```


### Proxy Pattern

**Definition:** Provide a surrogate or placeholder for another object.

**Use Case:** Access control, caching, lazy loading

```javascript
// Proxy implementation
class LRUCache {
  constructor(size = 100) {
    this.cache = new Map();
    this.size = size;
  }
  
  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.size) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}
```


## Behavioral Patterns

### Observer Pattern

**Definition:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

**Use Case:** Real-time updates, event handling

```javascript
// Observer implementation
class Subject {
  constructor() {
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  unsubscribe(observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }
  
  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Usage
class MetricsCollector extends Subject {
  collect(metric) {
    this.notify({ type: 'metric', data: metric });
  }
}

const metrics = new MetricsCollector();
metrics.subscribe(new DashboardUpdater());
metrics.subscribe(new AlertChecker());
```


### Strategy Pattern

**Definition:** Define a family of algorithms, encapsulate each one, and make them interchangeable.

**Use Case:** Different sorting algorithms, traversal strategies

```javascript
// Strategy implementation
class GraphTraversal {
  constructor() {
    this.strategy = null;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  traverse(graph, start) {
    return this.strategy.execute(graph, start);
  }
}

class BFSStrategy {
  execute(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const node = queue.shift();
      for (const neighbor of graph.getNeighbors(node)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return visited;
  }
}

class DFSStrategy {
  execute(graph, start) {
    const visited = new Set();
    const stack = [start];
    while (stack.length) {
      const node = stack.pop();
      if (!visited.has(node)) {
        visited.add(node);
        for (const neighbor of graph.getNeighbors(node)) {
          stack.push(neighbor);
        }
      }
    }
    return visited;
  }
}

// Usage
const traversal = new GraphTraversal();
traversal.setStrategy(new BFSStrategy());
traversal.execute(graph, 'A');
```


### State Pattern

**Definition:** Allow an object to alter its behavior when its internal state changes.

**Use Case:** Circuit breaker, workflow states

```javascript
// State implementation
class CircuitBreaker {
  constructor() {
    this.state = 'CLOSED';
    this.failures = 0;
  }
  
  get state() {
    return this._state;
  }
  
  set state(value) {
    this._state = value;
    this.onStateChange(value);
  }
  
  onStateChange(newState) {
    console.log(`State changed to: ${newState}`);
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is open');
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure(error);
      throw error;
    }
  }
  
  onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }
  
  onFailure(error) {
    this.failures++;
    if (this.failures >= 5) {
      this.state = 'OPEN';
    } else if (this.state === 'OPEN') {
      this.state = 'HALF_OPEN';
    }
  }
}
```


## Concurrency Patterns

### Rate Limiting

**Token Bucket Algorithm:**

```javascript
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }
  
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
  
  tryConsume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}
```

### Distributed Lock

```javascript
class DistributedLock {
  constructor(redisClient) {
    this.redis = redisClient;
    this.locks = new Map();
  }
  
  async acquire(key, ttl = 30000) {
    const lockKey = `lock:${key}`;
    const value = Date.now().toString();
    const acquired = await this.redis.setnx(lockKey, value);
    
    if (acquired) {
      await this.redis.expire(lockKey, ttl);
      this.locks.set(key, value);
      return true;
    }
    return false;
  }
  
  async release(key) {
    const lockKey = `lock:${key}`;
    const value = this.locks.get(key);
    if (value) {
      await this.redis.del(lockKey);
      this.locks.delete(key);
    }
  }
}
```


### Circuit Breaker

**Implementation:**

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 30000;
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailure = null;
  }
  
  async execute(fn) {
    switch (this.state) {
      case 'OPEN':
        if (Date.now() - this.lastFailure >= this.timeout) {
          this.state = 'HALF_OPEN';
          break;
        }
        throw new Error('Circuit breaker is open');
      
      case 'HALF_OPEN':
        try {
          const result = await fn();
          this.state = 'CLOSED';
          this.failures = 0;
          return result;
        } catch (error) {
          this.state = 'OPEN';
          this.lastFailure = Date.now();
          throw error;
        }
      
      case 'CLOSED':
        try {
          const result = await fn();
          this.failures = 0;
          return result;
        } catch (error) {
          this.failures++;
          if (this.failures >= this.failureThreshold) {
            this.state = 'OPEN';
            this.lastFailure = Date.now();
          }
          throw error;
        }
    }
  }
}
```


## Pattern Usage in Project

| Pattern | File | Usage |
|---------|------|-------|
| Singleton | `RateLimiter.js` | Single rate limiter instance |
| Factory | `DataStructureFactory.js` | Create DS instances |
| Observer | `Analytics.jsx` | Chart data updates |
| Strategy | `Graph.js` | BFS/DFS interchangeable |
| State | `CircuitBreaker.js` | State machine for breaker |
| Decorator | `Monitor.js` | Add metrics to operations |
| Proxy | `LRUCache.js` | Cache access control |
