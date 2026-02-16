// LRU Cache Implementation using HashMap + Doubly Linked List
// Author: UjjwalS, AuthorUrl: https://ujjwalsaini.vercel.app/
class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.cache = new Map(); // HashMap for O(1) access
    this.head = new Node(null, null); // Dummy head
    this.tail = new Node(null, null); // Dummy tail
    
    // Link head and tail
    this.head.next = this.tail;
    this.tail.prev = this.head;
    
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      operations: []
    };
  }

  get(key) {
    if (!this.cache.has(key)) {
      this.stats.misses++;
      this.stats.operations.push({
        type: 'miss',
        key,
        timestamp: Date.now(),
        cacheSize: this.cache.size
      });
      return null;
    }

    const node = this.cache.get(key);
    this.stats.hits++;
    this.stats.operations.push({
      type: 'hit',
      key,
      timestamp: Date.now(),
      cacheSize: this.cache.size
    });

    this._moveToFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // Update existing node
      const node = this.cache.get(key);
      node.value = value;
      this._moveToFront(node);
      return;
    }

    // Create new node
    const newNode = new Node(key, value);
    this.cache.set(key, newNode);
    this._addToFront(newNode);

    // Evict LRU item if over capacity
    if (this.cache.size > this.capacity) {
      const lruNode = this.tail.prev;
      this._removeNode(lruNode);
      this.cache.delete(lruNode.key);
      
      this.stats.evictions++;
      this.stats.operations.push({
        type: 'eviction',
        key: lruNode.key,
        timestamp: Date.now(),
        cacheSize: this.cache.size
      });
    }
  }

  _moveToFront(node) {
    this._removeNode(node);
    this._addToFront(node);
  }

  _addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  getStats() {
    const recentOps = this.stats.operations.slice(-50);
    return {
      ...this.stats,
      operations: recentOps,
      hitRate: this.stats.hits + this.stats.misses > 0 
        ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2)
        : 0,
      size: this.cache.size,
      capacity: this.capacity
    };
  }

  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      operations: []
    };
  }
}

module.exports = LRUCache;
