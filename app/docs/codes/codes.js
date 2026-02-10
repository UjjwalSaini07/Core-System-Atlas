// Code examples for all data structures and algorithms

export const CODE_EXAMPLES = {
  // ==================== DATA STRUCTURES ====================
  array: `// Array Operations
class ArrayOperations {
  constructor() {
    this.array = [];
    this.size = 0;
  }
  
  // Insert at end - O(1) amortized
  push(element) {
    this.array[this.size] = element;
    this.size++;
    return this.size;
  }
  
  // Remove from end - O(1)
  pop() {
    if (this.size === 0) return undefined;
    this.size--;
    const element = this.array[this.size];
    delete this.array[this.size];
    return element;
  }
  
  // Access by index - O(1)
  get(index) {
    if (index < 0 || index >= this.size) return undefined;
    return this.array[index];
  }
  
  // Search - O(n)
  indexOf(element) {
    for (let i = 0; i < this.size; i++) {
      if (this.array[i] === element) return i;
    }
    return -1;
  }
  
  // Insert at index - O(n)
  insertAt(index, element) {
    if (index < 0 || index > this.size) return false;
    
    // Shift elements right
    for (let i = this.size; i > index; i--) {
      this.array[i] = this.array[i - 1];
    }
    
    this.array[index] = element;
    this.size++;
    return true;
  }
  
  // Delete at index - O(n)
  deleteAt(index) {
    if (index < 0 || index >= this.size) return undefined;
    
    const element = this.array[index];
    
    // Shift elements left
    for (let i = index; i < this.size - 1; i++) {
      this.array[i] = this.array[i + 1];
    }
    
    this.size--;
    delete this.array[this.size];
    return element;
  }
  
  // Map - O(n)
  map(callback) {
    const result = new ArrayOperations();
    for (let i = 0; i < this.size; i++) {
      result.push(callback(this.array[i], i));
    }
    return result;
  }
  
  // Filter - O(n)
  filter(callback) {
    const result = new ArrayOperations();
    for (let i = 0; i < this.size; i++) {
      if (callback(this.array[i], i)) {
        result.push(this.array[i]);
      }
    }
    return result;
  }
  
  // Reduce - O(n)
  reduce(callback, initialValue) {
    let accumulator = initialValue;
    for (let i = 0; i < this.size; i++) {
      accumulator = callback(accumulator, this.array[i], i);
    }
    return accumulator;
  }
}

// Usage
const arr = new ArrayOperations();
arr.push(10);
arr.push(20);
arr.push(30);
arr.insertAt(1, 15); // [10, 15, 20, 30]
arr.deleteAt(0);     // [15, 20, 30]`,
  
  linkedlist: `// Linked List Implementation
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // Add to end - O(1)
  append(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return this;
  }
  
  // Add to beginning - O(1)
  prepend(value) {
    const node = new ListNode(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
    this.length++;
    return this;
  }
  
  // Insert at index - O(n)
  insert(index, value) {
    if (index < 0 || index > this.length) return false;
    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);
    
    const node = new ListNode(value);
    const prev = this._getNode(index - 1);
    node.next = prev.next;
    prev.next = node;
    this.length++;
    return true;
  }
  
  // Remove from beginning - O(1)
  shift() {
    if (!this.head) return undefined;
    const value = this.head.value;
    this.head = this.head.next;
    this.length--;
    if (!this.head) this.tail = null;
    return value;
  }
  
  // Remove from end - O(n) without tail pointer
  // O(1) with tail pointer (but need prev)
  pop() {
    if (!this.head) return undefined;
    const value = this.tail.value;
    
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      const prev = this._getNode(this.length - 2);
      prev.next = null;
      this.tail = prev;
    }
    this.length--;
    return value;
  }
  
  // Get node at index - O(n)
  _getNode(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  
  // Get value at index - O(n)
  get(index) {
    const node = this._getNode(index);
    return node ? node.value : undefined;
  }
  
  // Search - O(n)
  indexOf(value) {
    let current = this.head;
    let index = 0;
    while (current) {
      if (current.value === value) return index;
      current = current.next;
      index++;
    }
    return -1;
  }
  
  // Reverse - O(n)
  reverse() {
    let prev = null;
    let current = this.head;
    this.tail = this.head;
    
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    
    this.head = prev;
    return this;
  }
  
  // Traverse
  forEach(callback) {
    let current = this.head;
    let index = 0;
    while (current) {
      callback(current.value, index);
      current = current.next;
      index++;
    }
  }
}

// Usage
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.prepend(0);      // 0 → 1 → 2 → 3
list.insert(2, 1.5);   // 0 → 1 → 1.5 → 2 → 3`,
  
  stack: `// Stack Implementation
class Stack {
  constructor() {
    this.items = [];
  }
  
  // Add to top - O(1)
  push(element) {
    this.items.push(element);
    return this;
  }
  
  // Remove from top - O(1)
  pop() {
    if (this.isEmpty()) return undefined;
    return this.items.pop();
  }
  
  // View top - O(1)
  peek() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }
  
  // Check if empty - O(1)
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Get size - O(1)
  size() {
    return this.items.length;
  }
  
  // Clear - O(1)
  clear() {
    this.items = [];
  }
}

// Stack using Linked List for O(1) space
class StackLL {
  constructor() {
    this.top = null;
    this.size = 0;
  }
  
  push(value) {
    const node = { value, next: this.top };
    this.top = node;
    this.size++;
    return this;
  }
  
  pop() {
    if (!this.top) return undefined;
    const value = this.top.value;
    this.top = this.top.next;
    this.size--;
    return value;
  }
  
  peek() {
    return this.top?.value;
  }
  
  isEmpty() {
    return !this.top;
  }
  
  size() {
    return this.size;
  }
}

// Usage - Expression Evaluation
function evaluatePostfix(expression) {
  const stack = new Stack();
  const tokens = expression.split(' ');
  
  for (const token of tokens) {
    if (/\d+/.test(token)) {
      stack.push(parseInt(token));
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
      }
    }
  }
  return stack.pop();
}

evaluatePostfix('3 4 + 5 *'); // (3 + 4) * 5 = 35`,
  
  queue: `// Queue Implementation
class Queue {
  constructor() {
    this.items = [];
  }
  
  // Add to rear - O(1)
  enqueue(element) {
    this.items.push(element);
    return this;
  }
  
  // Remove from front - O(1)
  dequeue() {
    if (this.isEmpty()) return undefined;
    return this.items.shift();
  }
  
  // View front - O(1)
  front() {
    if (this.isEmpty()) return undefined;
    return this.items[0];
  }
  
  // View rear - O(1)
  rear() {
    if (this.isEmpty()) return undefined;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
}

// Circular Queue (efficient)
class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }
  
  enqueue(element) {
    if (this.isFull()) return false;
    this.rear = (this.rear + 1) % this.capacity;
    this.queue[this.rear] = element;
    this.count++;
    return true;
  }
  
  dequeue() {
    if (this.isEmpty()) return undefined;
    const element = this.queue[this.front];
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return element;
  }
  
  front() {
    return this.queue[this.front];
  }
  
  isEmpty() {
    return this.count === 0;
  }
  
  isFull() {
    return this.count === this.capacity;
  }
}

// Priority Queue (Min Heap based)
class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this._bubbleUp(this.heap.length - 1);
  }
  
  dequeue() {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }
  
  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index].priority >= this.heap[parent].priority) break;
      [this.heap[index], this.heap[parent]] = 
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
  
  _bubbleDown(index) {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      
      if (left < this.heap.length && 
          this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < this.heap.length && 
          this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}`,
  
  hashtable: `// Hash Table Implementation with Chaining
class HashTable {
  constructor(size = 10) {
    this.size = size;
    this.buckets = new Array(size).fill(null).map(() => []);
    this.loadFactor = 0.75;
    this.count = 0;
  }
  
  // Simple hash function
  _hash(key) {
    let hash = 0;
    const strKey = String(key);
    for (let i = 0; i < strKey.length; i++) {
      hash = (hash * 31 + strKey.charCodeAt(i)) % this.size;
    }
    return hash;
  }
  
  // Insert or update - O(1) avg
  set(key, value) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    
    // Update existing key
    const existing = bucket.find(item => item.key === key);
    if (existing) {
      existing.value = value;
      return this;
    }
    
    // Add new key-value pair
    bucket.push({ key, value });
    this.count++;
    
    // Check for resize
    if (this.count / this.size > this.loadFactor) {
      this._resize();
    }
    return this;
  }
  
  // Lookup - O(1) avg
  get(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    const item = bucket.find(item => item.key === key);
    return item ? item.value : undefined;
  }
  
  // Delete - O(1) avg
  delete(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    const idx = bucket.findIndex(item => item.key === key);
    if (idx === -1) return undefined;
    this.count--;
    return bucket.splice(idx, 1)[0].value;
  }
  
  // Check if key exists - O(1) avg
  has(key) {
    const index = this._hash(key);
    return this.buckets[index].some(item => item.key === key);
  }
  
  // Get all keys
  keys() {
    const keys = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        keys.push(item.key);
      }
    }
    return keys;
  }
  
  // Get all values
  values() {
    const values = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        values.push(item.value);
      }
    }
    return values;
  }
  
  // Resize and rehash
  _resize() {
    const oldBuckets = this.buckets;
    this.size *= 2;
    this.buckets = new Array(this.size).fill(null).map(() => []);
    this.count = 0;
    
    for (const bucket of oldBuckets) {
      for (const item of bucket) {
        this.set(item.key, item.value);
      }
    }
  }
}

// Usage
const ht = new HashTable();
ht.set('name', 'UjjwalS');
ht.set('age', 23);
ht.set('city', 'NYC');
ht.get('name');      // 'UjjwalS'
ht.has('age');       // true
ht.delete('age');    // 23
ht.keys();           // ['name', 'city']`,
  
  lrucache: `// LRU Cache Implementation
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  // Get value - O(1)
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
  // Set value - O(1)
  put(key, value) {
    // Delete if exists (will be re-added)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // Add new entry
    this.cache.set(key, value);
    // Evict oldest if over capacity
    if (this.cache.size > this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }
}

// Using Doubly Linked List for explicit control
class LRUCacheLL {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    // Dummy head and tail for easy operations
    this.head = { key: null, value: null, prev: null, next: null };
    this.tail = { key: null, value: null, prev: null, next: null };
    this.head.next = this.tail;
    this.tail.prev = this.head;
    this.size = 0;
  }
  
  _addNode(node) {
    // Add to end (before tail)
    const prevTail = this.tail.prev;
    prevTail.next = node;
    node.prev = prevTail;
    node.next = this.tail;
    this.tail.prev = node;
    this.size++;
  }
  
  _removeNode(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
    this.size--;
  }
  
  _moveToEnd(node) {
    this._removeNode(node);
    this._addNode(node);
  }
  
  get(key) {
    const node = this.cache.get(key);
    if (!node) return -1;
    this._moveToEnd(node);
    return node.value;
  }
  
  put(key, value) {
    const node = this.cache.get(key);
    if (node) {
      node.value = value;
      this._moveToEnd(node);
    } else {
      if (this.size >= this.capacity) {
        // Remove head (least recently used)
        const lru = this.head.next;
        this._removeNode(lru);
        this.cache.delete(lru.key);
      }
      const newNode = { key, value, prev: null, next: null };
      this.cache.set(key, newNode);
      this._addNode(newNode);
    }
  }
}

// Usage
const lru = new LRUCache(3);
lru.put(1, 'a'); // {1: 'a'}
lru.put(2, 'b'); // {1: 'a', 2: 'b'}
lru.put(3, 'c'); // {1: 'a', 2: 'b', 3: 'c'}
lru.get(2);      // 'b' - now most recently used
lru.put(4, 'd'); // Evicts key 1 - {2: 'b', 3: 'c', 4: 'd'}`,
  
  binarysearchtree: `// Binary Search Tree Implementation
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  
  // Insert - O(log n) avg, O(n) worst
  insert(value) {
    const node = new TreeNode(value);
    if (!this.root) {
      this.root = node;
      return this;
    }
    
    let current = this.root;
    while (true) {
      if (value === current.value) return this; // No duplicates
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  // Search - O(log n) avg, O(n) worst
  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }
  
  // Delete - O(log n) avg, O(n) worst
  delete(value) {
    this.root = this._deleteNode(this.root, value);
  }
  
  _deleteNode(node, value) {
    if (!node) return null;
    
    if (value < node.value) {
      node.left = this._deleteNode(node.left, value);
      return node;
    }
    if (value > node.value) {
      node.right = this._deleteNode(node.right, value);
      return node;
    }
    
    // Found node to delete
    if (!node.left) return node.right;
    if (!node.right) return node.left;
    
    // Two children - get successor
    const successor = this._minValue(node.right);
    node.value = successor.value;
    node.right = this._deleteNode(node.right, successor.value);
    return node;
  }
  
  _minValue(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }
  
  // In-order traversal - O(n)
  inOrder(node = this.root, result = []) {
    if (node) {
      this.inOrder(node.left, result);
      result.push(node.value);
      this.inOrder(node.right, result);
    }
    return result;
  }
  
  // Level-order traversal - O(n)
  levelOrder() {
    if (!this.root) return [];
    const result = [];
    const queue = [this.root];
    
    while (queue.length) {
      const node = queue.shift();
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }
  
  // Height - O(n)
  height(node = this.root) {
    if (!node) return 0;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }
}

// Usage
const bst = new BST();
[50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
bst.inOrder();   // [20, 30, 40, 50, 60, 70, 80]
bst.search(40);  // TreeNode { value: 40, ... }
bst.height();    // 3`,
  
  avltree: `// AVL Tree (Self-balancing BST)
class AVLNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }
  
  // Get height - O(1)
  _height(node) {
    return node ? node.height : 0;
  }
  
  // Get balance factor - O(1)
  _balance(node) {
    return node ? this._height(node.left) - this._height(node.right) : 0;
  }
  
  // Right rotation - O(1)
  _rightRotate(y) {
    const x = y.left;
    const T2 = x.right;
    
    x.right = y;
    y.left = T2;
    
    y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
    x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
    
    return x;
  }
  
  // Left rotation - O(1)
  _leftRotate(x) {
    const y = x.right;
    const T2 = y.left;
    
    y.left = x;
    x.right = T2;
    
    x.height = Math.max(this._height(x.left), this._height(x.right)) + 1;
    y.height = Math.max(this._height(y.left), this._height(y.right)) + 1;
    
    return y;
  }
  
  // Insert - O(log n)
  insert(value) {
    this.root = this._insert(this.root, value);
  }
  
  _insert(node, value) {
    if (!node) return new AVLNode(value);
    
    if (value < node.value) {
      node.left = this._insert(node.left, value);
    } else if (value > node.value) {
      node.right = this._insert(node.right, value);
    } else {
      return node; // No duplicates
    }
    
    // Update height
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
    
    // Balance
    const balance = this._balance(node);
    
    // Left Left
    if (balance > 1 && value < node.left.value) {
      return this._rightRotate(node);
    }
    // Right Right
    if (balance < -1 && value > node.right.value) {
      return this._leftRotate(node);
    }
    // Left Right
    if (balance > 1 && value > node.left.value) {
      node.left = this._leftRotate(node.left);
      return this._rightRotate(node);
    }
    // Right Left
    if (balance < -1 && value < node.right.value) {
      node.right = this._rightRotate(node.right);
      return this._leftRotate(node);
    }
    
    return node;
  }
  
  // Delete - O(log n)
  delete(value) {
    this.root = this._delete(this.root, value);
  }
  
  _delete(node, value) {
    if (!node) return node;
    
    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      if (!node.left || !node.right) {
        const temp = node.left || node.right;
        node = temp;
      } else {
        const temp = this._minValue(node.right);
        node.value = temp.value;
        node.right = this._delete(node.right, temp.value);
      }
    }
    
    if (!node) return node;
    
    node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
    
    const balance = this._balance(node);
    
    if (balance > 1 && this._balance(node.left) >= 0) {
      return this._rightRotate(node);
    }
    if (balance > 1 && this._balance(node.left) < 0) {
      node.left = this._leftRotate(node.left);
      return this._rightRotate(node);
    }
    if (balance < -1 && this._balance(node.right) <= 0) {
      return this._leftRotate(node);
    }
    if (balance < -1 && this._balance(node.right) > 0) {
      node.right = this._rightRotate(node.right);
      return this._leftRotate(node);
    }
    
    return node;
  }
  
  _minValue(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }
}

// Usage
const avl = new AVLTree();
[10, 20, 30, 40, 50, 25].forEach(v => avl.insert(v));
// Always balanced!`,
  
  segmenttree: `// Segment Tree for Range Sum Queries
class SegmentTree {
  constructor(arr) {
    this.arr = arr;
    this.n = arr.length;
    this.size = 4 * this.n; // Size for segment tree
    this.tree = new Array(this.size).fill(0);
    this._build(1, 0, this.n - 1);
  }
  
  // Build tree - O(n)
  _build(node, start, end) {
    if (start === end) {
      this.tree[node] = this.arr[start];
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node;
    const rightChild = 2 * node + 1;
    
    this._build(leftChild, start, mid);
    this._build(rightChild, mid + 1, end);
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }
  
  // Query range [l, r] - O(log n)
  query(node, start, end, l, r) {
    // No overlap
    if (r < start || end < l) return 0;
    
    // Total overlap
    if (l <= start && end <= r) return this.tree[node];
    
    // Partial overlap
    const mid = Math.floor((start + end) / 2);
    return this.query(node * 2, start, mid, l, r) +
           this.query(node * 2 + 1, mid + 1, end, l, r);
  }
  
  queryRange(l, r) {
    return this.query(1, 0, this.n - 1, l, r);
  }
  
  // Update single element - O(log n)
  update(node, start, end, idx, value) {
    if (start === end) {
      this.tree[node] = value;
      return;
    }
    
    const mid = Math.floor((start + end) / 2);
    if (idx <= mid) {
      this.update(node * 2, start, mid, idx, value);
    } else {
      this.update(node * 2 + 1, mid + 1, end, idx, value);
    }
    this.tree[node] = this.tree[node * 2] + this.tree[node * 2 + 1];
  }
  
  updateIndex(idx, value) {
    this.update(1, 0, this.n - 1, idx, value);
  }
}

// Lazy Segment Tree for Range Updates
class LazySegmentTree {
  constructor(arr) {
    this.arr = arr;
    this.n = arr.length;
    this.size = 4 * this.n;
    this.tree = new Array(this.size).fill(0);
    this.lazy = new Array(this.size).fill(0);
  }
  
  _build(node, start, end) {
    if (start === end) {
      this.tree[node] = this.arr[start];
      return;
    }
    const mid = Math.floor((start + end) / 2);
    this._build(node * 2, start, mid);
    this._build(node * 2 + 1, mid + 1, end);
    this.tree[node] = this.tree[node * 2] + this.tree[node * 2 + 1];
  }
  
  _push(node) {
    if (this.lazy[node] !== 0) {
      const left = node * 2;
      const right = node * 2 + 1;
      this.tree[left] += this.lazy[node];
      this.tree[right] += this.lazy[node];
      this.lazy[left] += this.lazy[node];
      this.lazy[right] += this.lazy[node];
      this.lazy[node] = 0;
    }
  }
  
  _rangeUpdate(node, start, end, l, r, val) {
    if (r < start || end < l) return;
    if (l <= start && end <= r) {
      this.tree[node] += val * (end - start + 1);
      this.lazy[node] += val;
      return;
    }
    this._push(node);
    const mid = Math.floor((start + end) / 2);
    this._rangeUpdate(node * 2, start, mid, l, r, val);
    this._rangeUpdate(node * 2 + 1, mid + 1, end, l, r, val);
    this.tree[node] = this.tree[node * 2] + this.tree[node * 2 + 1];
  }
  
  rangeUpdate(l, r, val) {
    this._rangeUpdate(1, 0, this.n - 1, l, r, val);
  }
}

// Usage
const arr = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);
segTree.queryRange(1, 4); // 3 + 5 + 7 + 9 = 24
segTree.updateIndex(2, 10); // arr = [1, 3, 10, 7, 9, 11]
segTree.queryRange(0, 5); // 41`,
  
  fenwicktree: `// Binary Indexed Tree (Fenwick Tree)
class FenwickTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(this.n + 1).fill(0);
    for (let i = 0; i < this.n; i++) {
      this.add(i, arr[i]);
    }
  }
  
  // Add value at index - O(log n)
  add(index, delta) {
    // BIT uses 1-based indexing
    for (let i = index + 1; i <= this.n; i += i & (-i)) {
      this.tree[i] += delta;
    }
  }
  
  // Prefix sum [0, index] - O(log n)
  prefixSum(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & (-i)) {
      sum += this.tree[i];
    }
    return sum;
  }
  
  // Range sum [l, r] - O(log n)
  rangeSum(l, r) {
    return this.prefixSum(r) - (l > 0 ? this.prefixSum(l - 1) : 0);
  }
  
  // Get value at index - O(log n)
  get(index) {
    return this.prefixSum(index) - (index > 0 ? this.prefixSum(index - 1) : 0);
  }
  
  // Update value at index - O(log n)
  update(index, value) {
    const current = this.get(index);
    const delta = value - current;
    this.add(index, delta);
  }
}

// Usage
const bit = new FenwickTree([1, 3, 5, 7, 9]);
bit.prefixSum(3);    // 1+3+5+7 = 16
bit.rangeSum(1, 3);  // 3+5+7 = 15
bit.add(2, 10);     // arr[2] += 10
bit.prefixSum(3);    // 1+3+15+7 = 26

// Finding prefix with binary lifting
_findPrefix(target) {
  let sum = 0;
  let pos = 0;
  // Largest power of 2 <= n
  let bitMask = 1 << Math.floor(Math.log2(this.n));
  
  for (; bitMask > 0; bitMask >>= 1) {
    const nextPos = pos + bitMask;
    if (nextPos <= this.n && sum + this.tree[nextPos] <= target) {
      sum += this.tree[nextPos];
      pos = nextPos;
    }
  }
  return pos; // Returns largest index with prefix <= target
}`,
  
  trie: `// Trie (Prefix Tree) Implementation
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.frequency = 0; // For autocomplete ranking
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  // Insert word - O(m) where m = word length
  insert(word) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
    node.frequency++;
  }
  
  // Search for exact word - O(m)
  search(word) {
    const node = this._findNode(word);
    return node !== null && node.isEndOfWord;
  }
  
  // Check if any word starts with prefix - O(m)
  startsWith(prefix) {
    return this._findNode(prefix) !== null;
  }
  
  // Find node for prefix - O(m)
  _findNode(prefix) {
    let node = this.root;
    for (const char of prefix.toLowerCase()) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char);
    }
    return node;
  }
  
  // Get all words with prefix - O(m + k)
  getWordsWithPrefix(prefix) {
    const node = this._findNode(prefix);
    if (!node) return [];
    
    const words = [];
    this._collectWords(node, prefix, words);
    return words;
  }
  
  _collectWords(node, prefix, words) {
    if (node.isEndOfWord) {
      words.push({ word: prefix, frequency: node.frequency });
    }
    for (const [char, child] of node.children) {
      this._collectWords(child, prefix + char, words);
    }
  }
  
  // Auto-complete with frequency ranking
  autocomplete(prefix, maxResults = 5) {
    const words = this.getWordsWithPrefix(prefix);
    // Sort by frequency (most common first)
    words.sort((a, b) => b.frequency - a.frequency);
    return words.slice(0, maxResults).map(w => w.word);
  }
  
  // Delete word
  delete(word) {
    this._delete(this.root, word.toLowerCase(), 0);
  }
  
  _delete(node, word, depth) {
    if (depth === word.length) {
      if (!node.isEndOfWord) return false;
      node.isEndOfWord = false;
      return node.children.size === 0;
    }
    
    const char = word[depth];
    const child = node.children.get(char);
    if (!child) return false;
    
    const shouldDeleteChild = this._delete(child, word, depth + 1);
    
    if (shouldDeleteChild) {
      node.children.delete(char);
      return !node.isEndOfWord && node.children.size === 0;
    }
    return false;
  }
  
  // Count words
  countWords() {
    return this._count(this.root);
  }
  
  _count(node) {
    let count = node.isEndOfWord ? 1 : 0;
    for (const child of node.children.values()) {
      count += this._count(child);
    }
    return count;
  }
}

// Usage
const trie = new Trie();
['apple', 'app', 'application', 'apply', 'apt', 'banana', 'band', 'bandana']
  .forEach(word => trie.insert(word));

trie.search('apple');           // true
trie.startsWith('app');         // true
trie.autocomplete('app');       // ['apple', 'app', 'application', 'apply', 'apt']
trie.autocomplete('ban');       // ['banana', 'band', 'bandana']`,
  
  graph: `// Graph Implementation
class Graph {
  constructor(isDirected = false) {
    this.adjacencyList = new Map();
    this.isDirected = isDirected;
  }
  
  // Add vertex
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  // Add edge
  addEdge(vertex1, vertex2, weight = 1) {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    this.adjacencyList.get(vertex1).push({ vertex: vertex2, weight });
    if (!this.isDirected) {
      this.adjacencyList.get(vertex2).push({ vertex: vertex1, weight });
    }
  }
  
  // BFS - O(V + E)
  bfs(start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    const result = [];
    
    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);
      
      for (const neighbor of this.adjacencyList.get(vertex)) {
        if (!visited.has(neighbor.vertex)) {
          visited.add(neighbor.vertex);
          queue.push(neighbor.vertex);
        }
      }
    }
    return result;
  }
  
  // DFS (recursive) - O(V + E)
  dfs(start, visited = new Set(), result = []) {
    visited.add(start);
    result.push(start);
    
    for (const neighbor of this.adjacencyList.get(start)) {
      if (!visited.has(neighbor.vertex)) {
        this.dfs(neighbor.vertex, visited, result);
      }
    }
    return result;
  }
  
  // DFS (iterative) - O(V + E)
  dfsIterative(start) {
    const visited = new Set();
    const stack = [start];
    const result = [];
    
    while (stack.length) {
      const vertex = stack (!visited.has(vertex)) {
        visited.pop();
      if.add(vertex);
        result.push(vertex);
        
        for (const neighbor of this.adjacencyList.get(vertex)) {
          if (!visited.has(neighbor.vertex)) {
            stack.push(neighbor.vertex);
          }
        }
      }
    }
    return result;
  }
  
  // Dijkstra's shortest path - O(E + V log V)
  dijkstra(start, end) {
    const distances = new Map();
    const previous = new Map();
    const pq = new PriorityQueue();
    
    for (const vertex of this.adjacencyList.keys()) {
      distances.set(vertex, Infinity);
    }
    distances.set(start, 0);
    pq.enqueue(start, 0);
    
    while (!pq.isEmpty()) {
      const { vertex: current } = pq.dequeue();
      
      if (current === end) {
        // Reconstruct path
        const path = [];
        let vertex = end;
        while (vertex) {
          path.unshift(vertex);
          vertex = previous.get(vertex);
        }
        return { distance: distances.get(end), path };
      }
      
      for (const neighbor of this.adjacencyList.get(current)) {
        const alt = distances.get(current) + neighbor.weight;
        if (alt < distances.get(neighbor.vertex)) {
          distances.set(neighbor.vertex, alt);
          previous.set(neighbor.vertex, current);
          pq.enqueue(neighbor.vertex, alt);
        }
      }
    }
    return { distance: Infinity, path: [] };
  }
  
  // Detect cycles (for undirected graph)
  hasCycle() {
    const visited = new Set();
    
    for (const vertex of this.adjacencyList.keys()) {
      if (!visited.has(vertex)) {
        if (this._hasCycleDFS(vertex, visited, null)) {
          return true;
        }
      }
    }
    return false;
  }
  
  _hasCycleDFS(vertex, visited, parent) {
    visited.add(vertex);
    
    for (const neighbor of this.adjacencyList.get(vertex)) {
      if (neighbor.vertex === parent) continue;
      if (visited.has(neighbor.vertex)) {
        return true;
      }
      if (this._hasCycleDFS(neighbor.vertex, visited, vertex)) {
        return true;
      }
    }
    return false;
  }
}

// Usage
const graph = new Graph();
['A', 'B', 'C', 'D', 'E', 'F'].forEach(v => graph.addVertex(v));
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'E');
graph.addEdge('D', 'F');
graph.addEdge('E', 'F');

graph.bfs('A');           // ['A', 'B', 'C', 'D', 'E', 'F']
graph.dfs('A');           // ['A', 'C', 'E', 'F', 'D', 'B']
graph.dijkstra('A', 'F'); // { distance: 3, path: ['A', 'B', 'D', 'F'] }`,
  
  unionfind: `// Union-Find (Disjoint Set Union) with Path Compression
class UnionFind {
  constructor(size) {
    this.parent = new Array(size).fill(0).map((_, i) => i);
    this.rank = new Array(size).fill(0);
    this.count = size;
  }
  
  // Find with path compression - O(α(n))
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }
    return this.parent[x];
  }
  
  // Union by rank - O(α(n))
  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);
    
    if (rootX === rootY) return false;
    
    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    
    this.count--;
    return true;
  }
  
  // Check if connected
  connected(x, y) {
    return this.find(x) === this.find(y);
  }
  
  // Get number of sets
  count() {
    return this.count;
  }
  
  // Get all sets
  getSets() {
    const sets = new Map();
    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!sets.has(root)) {
        sets.set(root, []);
      }
      sets.get(root).push(i);
    }
    return Array.from(sets.values());
  }
}

// Kruskal's MST using Union-Find
function kruskalMST(graph) {
  const edges = [];
  // Collect all edges
  for (const [vertex, neighbors] of graph.adjacencyList) {
    for (const neighbor of neighbors) {
      if (graph.isDirected || vertex < neighbor.vertex) {
        edges.push({ u: vertex, v: neighbor.vertex, weight: neighbor.weight });
      }
    }
  }
  
  // Sort by weight
  edges.sort((a, b) => a.weight - b.weight);
  
  const uf = new UnionFind(graph.adjacencyList.size);
  const mst = [];
  let totalWeight = 0;
  
  for (const edge of edges) {
    if (uf.connected(edge.u, edge.v)) continue;
    
    uf.union(edge.u, edge.v);
    mst.push(edge);
    totalWeight += edge.weight;
  }
  
  return { mst, totalWeight };
}

// Usage
const uf = new UnionFind(5);
uf.union(0, 1); // Set: {0, 1}
uf.union(1, 2); // Set: {0, 1, 2}
uf.union(3, 4); // Set: {3, 4}
uf.connected(0, 2); // true
uf.connected(0, 3); // false`,
  
  minheap: `// Min Heap Implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  // Get parent index - O(1)
  parent(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // Get left child index - O(1)
  leftChild(index) {
    return 2 * index + 1;
  }
  
  // Get right child index - O(1)
  rightChild(index) {
    return 2 * index + 2;
  }
  
  // Insert - O(log n)
  insert(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
    return this.heap.length;
  }
  
  // Bubble up - O(log n)
  _bubbleUp(index) {
    while (index > 0) {
      const parent = this.parent(index);
      if (this.heap[index] >= this.heap[parent]) break;
      [this.heap[index], this.heap[parent]] = 
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
  
  // Extract minimum - O(log n)
  extractMin() {
    if (this.heap.length === 0) return undefined;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    
    return min;
  }
  
  // Bubble down - O(log n)
  _bubbleDown(index) {
    while (true) {
      const left = this.leftChild(index);
      const right = this.rightChild(index);
      let smallest = index;
      
      if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
        smallest = left;
      }
      if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
        smallest = right;
      }
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
  
  // Peek minimum - O(1)
  peek() {
    return this.heap[0];
  }
  
  // Size - O(1)
  size() {
    return this.heap.length;
  }
  
  // Check if empty - O(1)
  isEmpty() {
    return this.heap.length === 0;
  }
}

// Heap Sort
function heapSort(arr) {
  const heap = new MinHeap();
  
  // Build heap - O(n)
  for (const value of arr) {
    heap.insert(value);
  }
  
  // Extract all - O(n log n)
  const sorted = [];
  while (!heap.isEmpty()) {
    sorted.push(heap.extractMin());
  }
  return sorted;
}

// K Largest Elements
function kLargest(arr, k) {
  const minHeap = new MinHeap();
  
  // Keep k largest in min-heap
  for (const value of arr) {
    minHeap.insert(value);
    if (minHeap.size() > k) {
      minHeap.extractMin();
    }
  }
  
  return minHeap.heap.sort((a, b) => a - b);
}

// Usage
const minHeap = new MinHeap();
[5, 3, 8, 1, 2, 9].forEach(v => minHeap.insert(v));
minHeap.extractMin(); // 1
minHeap.peek();       // 2 (next minimum)
heapSort([5, 3, 8, 1, 2, 9]); // [1, 2, 3, 5, 8, 9]
kLargest([5, 3, 8, 1, 2, 9], 3); // [5, 8, 9]`,
  
  maxheap: `// Max Heap Implementation
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  
  parent(index) {
    return Math.floor((index - 1) / 2);
  }
  
  leftChild(index) {
    return 2 * index + 1;
  }
  
  rightChild(index) {
    return 2 * index + 2;
  }
  
  // Insert - O(log n)
  insert(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
    return this.heap.length;
  }
  
  // Bubble up - O(log n)
  _bubbleUp(index) {
    while (index > 0) {
      const parent = this.parent(index);
      if (this.heap[index] <= this.heap[parent]) break;
      [this.heap[index], this.heap[parent]] = 
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
  
  // Extract maximum - O(log n)
  extractMax() {
    if (this.heap.length === 0) return undefined;
    
    const max = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    
    return max;
  }
  
  // Bubble down - O(log n)
  _bubbleDown(index) {
    while (true) {
      const left = this.leftChild(index);
      const right = this.rightChild(index);
      let largest = index;
      
      if (left < this.heap.length && this.heap[left] > this.heap[largest]) {
        largest = left;
      }
      if (right < this.heap.length && this.heap[right] > this.heap[largest]) {
        largest = right;
      }
      if (largest === index) break;
      
      [this.heap[index], this.heap[largest]] = 
        [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
  
  peek() {
    return this.heap[0];
  }
  
  size() {
    return this.heap.length;
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
}

// K Smallest Elements using Max Heap
function kSmallest(arr, k) {
  const maxHeap = new MaxHeap();
  
  for (const value of arr) {
    maxHeap.insert(value);
    if (maxHeap.size() > k) {
      maxHeap.extractMax();
    }
  }
  
  return maxHeap.heap.sort((a, b) => b - a);
}

// Priority Queue (Max Heap based)
class MaxPriorityQueue {
  constructor() {
    this.heap = new MaxHeap();
  }
  
  enqueue(value, priority) {
    // Store as [priority, value] for comparison
    this.heap.insert({ priority, value });
  }
  
  dequeue() {
    const max = this.heap.extractMax();
    return max ? max.value : undefined;
  }
  
  peek() {
    const max = this.heap.peek();
    return max ? max.value : undefined;
  }
  
  isEmpty() {
    return this.heap.isEmpty();
  }
}

// Usage
const maxHeap = new MaxHeap();
[5, 3, 8, 1, 2, 9].forEach(v => maxHeap.insert(v));
maxHeap.extractMax(); // 9
maxHeap.peek();       // 8 (next maximum)
kSmallest([5, 3, 8, 1, 2, 9], 3); // [1, 2, 3]

// Priority Queue Example
const pq = new MaxPriorityQueue();
pq.enqueue('task1', 3);
pq.enqueue('task2', 1);
pq.enqueue('task3', 5);
pq.enqueue('task4', 2);
pq.dequeue(); // 'task3' (highest priority 5)`,
  
  // ==================== ALGORITHMS ====================
  bubblesort: `// Bubble Sort
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    // Largest element bubbles to end
  } while (swapped);
  
  return arr;
}

// Optimized Bubble Sort
function bubbleSortOptimized(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Already sorted
  }
  
  return arr;
}

// Cocktail Shaker Sort (bidirectional)
function cocktailShakerSort(arr) {
  let left = 0;
  let right = arr.length - 1;
  let swapped = true;
  
  while (swapped) {
    swapped = false;
    // Move largest to right
    for (let i = left; i < right; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
      }
    }
    right--;
    
    if (!swapped) break;
    swapped = false;
    
    // Move smallest to left
    for (let i = right; i > left; i--) {
      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;
      }
    }
    left++;
  }
  
  return arr;
}

// Usage
bubbleSort([64, 34, 25, 12, 22, 11, 90]);`,
  
  selectionsort: `// Selection Sort
function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // Find minimum in unsorted portion
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap with first unsorted element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}

// Recursive Selection Sort
function selectionSortRecursive(arr, n = arr.length) {
  if (n <= 1) return arr;
  
  // Find minimum in arr[0...n-1]
  let minIndex = 0;
  for (let i = 1; i < n; i++) {
    if (arr[i] < arr[minIndex]) {
      minIndex = i;
    }
  }
  
  // Put minimum at its correct position
  [arr[0], arr[minIndex]] = [arr[minIndex], arr[0]];
  
  // Recursively sort remaining
  return selectionSortRecursive(arr.slice(1)).prepend(arr[0]);
}

// Two-Element Selection Sort (finds both min and max)
function selectionSortTwoWay(arr) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    let minIndex = left;
    let maxIndex = right;
    
    for (let i = left; i <= right; i++) {
      if (arr[i] < arr[minIndex]) minIndex = i;
      if (arr[i] > arr[maxIndex]) maxIndex = i;
    }
    
    // Place min and max
    [arr[left], arr[minIndex]] = [arr[minIndex], arr[left]];
    if (maxIndex === left) maxIndex = minIndex; // Adjust if max was at left
    [arr[right], arr[maxIndex]] = [arr[maxIndex], arr[right]];
    
    left++;
    right--;
  }
  
  return arr;
}

// Usage
selectionSort([64, 34, 25, 12, 22, 11, 90]);`,
  
  insertionsort: `// Insertion Sort
function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key forward
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}

// Binary Insertion Sort (find position faster)
function binaryInsertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    
    // Binary search for position
    let left = 0;
    let right = i;
    
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] <= key) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }
    
    // Shift and insert
    for (let j = i; j > left; j--) {
      arr[j] = arr[j - 1];
    }
    arr[left] = key;
  }
  
  return arr;
}

// Recursive Insertion Sort
function insertionSortRecursive(arr, n = arr.length) {
  if (n <= 1) return arr;
  
  insertionSortRecursive(arr, n - 1);
  
  const last = arr[n - 1];
  let j = n - 2;
  
  while (j >= 0 && arr[j] > last) {
    arr[j + 1] = arr[j];
    j--;
  }
  arr[j + 1] = last;
  
  return arr;
}

// Usage - Good for nearly sorted data
insertionSort([12, 11, 13, 5, 6]); // [5, 6, 11, 12, 13]`,
  
  mergesort: `// Merge Sort (Top-down)
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}

// Merge Sort (Bottom-up/Iterative)
function mergeSortIterative(arr) {
  const n = arr.length;
  const temp = new Array(n);
  
  for (let size = 1; size < n; size *= 2) {
    for (let left = 0; left < n - size; left += 2 * size) {
      const mid = left + size - 1;
      const right = Math.min(left + 2 * size - 1, n - 1);
      mergeInPlace(arr, temp, left, mid, right);
    }
  }
  
  return arr;
}

function mergeInPlace(arr, temp, left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  
  // Copy to temp arrays
  for (let i = 0; i < n1; i++) temp[i] = arr[left + i];
  for (let j = 0; j < n2; j++) temp[n1 + j] = arr[mid + 1 + j];
  
  let i = 0, j = n1, k = left;
  
  while (i < n1 && j < n1 + n2) {
    if (temp[i] <= temp[j]) {
      arr[k++] = temp[i++];
    } else {
      arr[k++] = temp[j++];
    }
  }
  
  while (i < n1) arr[k++] = temp[i++];
  while (j < n1 + n2) arr[k++] = temp[j++];
}

// Natural Merge Sort (for partially sorted data)
function naturalMergeSort(arr) {
  const n = arr.length;
  if (n <= 1) return arr;
  
  // Find and merge natural runs
  const runs = [];
  let start = 0;
  
  for (let i = 1; i <= n; i++) {
    if (i === n || arr[i] < arr[i - 1]) {
      runs.push({ start, end: i - 1 });
      start = i;
    }
  }
  
  while (runs.length > 1) {
    const newRuns = [];
    
    for (let i = 0; i < runs.length; i += 2) {
      if (i + 1 < runs.length) {
        const merged = mergeTwoRuns(arr, runs[i], runs[i + 1]);
        newRuns.push(merged);
      } else {
        newRuns.push(runs[i]);
      }
    }
    runs = newRuns;
  }
  
  return arr;
}

function mergeTwoRuns(arr, run1, run2) {
  const temp = [];
  let i = run1.start, j = run2.start, start = run1.start;
  
  while (i <= run1.end && j <= run2.end) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }
  
  while (i <= run1.end) temp.push(arr[i++]);
  while (j <= run2.end) temp.push(arr[j++]);
  
  // Copy back
  for (let k = 0; k < temp.length; k++) {
    arr[start + k] = temp[k];
  }
  
  return { start, end: start + temp.length - 1 };
}

// Usage
mergeSort([38, 27, 43, 3, 9, 82, 10]);`,
  
  quicksort: `// Quick Sort (Lomuto partition - simpler)
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right]; // Choose last element as pivot
  let i = left - 1;
  
  for (let j = left; j < right; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
  return i + 1;
}

// Quick Sort (Hoare partition - better for duplicates)
function quickSortHoare(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partitionHoare(arr, left, right);
    quickSortHoare(arr, left, pivotIndex);
    quickSortHoare(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partitionHoare(arr, left, right) {
  const pivot = arr[Math.floor((left + right) / 2)];
  let i = left - 1;
  let j = right + 1;
  
  while (true) {
    do i++; while (arr[i] < pivot);
    do j--; while (arr[j] > pivot);
    
    if (i >= j) return j;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// Randomized Quick Sort
function quickSortRandom(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = randomPartition(arr, left, right);
    quickSortRandom(arr, left, pivotIndex - 1);
    quickSortRandom(arr, pivotIndex + 1, right);
  }
  return arr;
}

function randomPartition(arr, left, right) {
  const randomIndex = Math.floor(Math.random() * (right - left + 1)) + left;
  [arr[randomIndex], arr[right]] = [arr[right], arr[randomIndex]];
  return partition(arr, left, right);
}

// Three-way Quick Sort (Dutch National Flag)
function quickSortThreeWay(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  
  let lt = left; // arr[0...lt-1] < pivot
  let gt = right; // arr[gt+1...n-1] > pivot
  let i = left;
  const pivot = arr[right];
  
  while (i <= gt) {
    if (arr[i] < pivot) {
      [arr[i], arr[lt]] = [arr[lt], arr[i]];
      lt++;
      i++;
    } else if (arr[i] > pivot) {
      [arr[i], arr[gt]] = [arr[gt], arr[i]];
      gt--;
    } else {
      i++;
    }
  }
  
  quickSortThreeWay(arr, left, lt - 1);
  quickSortThreeWay(arr, gt + 1, right);
  return arr;
}

// Usage
quickSort([38, 27, 43, 3, 9, 82, 10]);`,
  
  heapsort: `// Heap Sort
function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap - O(n)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap - O(n log n)
  for (let i = n - 1; i > 0; i--) {
    // Move current max to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    // Heapify reduced heap
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// In-place Heap Sort (space efficient)
function heapSortInPlace(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapifyInPlace(arr, n, i);
  }
  
  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapifyInPlace(arr, i, 0);
  }
}

function heapifyInPlace(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) largest = left;
  if (right < n && arr[right] > arr[largest]) largest = right;
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapifyInPlace(arr, n, largest);
  }
}

// Heap Sort with min-heap (ascending)
function heapSortMin(arr) {
  const minHeap = new MinHeap();
  
  for (const value of arr) {
    minHeap.insert(value);
  }
  
  const sorted = [];
  while (!minHeap.isEmpty()) {
    sorted.push(minHeap.extractMin());
  }
  return sorted;
}

// Usage
heapSort([38, 27, 43, 3, 9, 82, 10]); // [3, 9, 10, 27, 38, 43, 82]`,
  
  binarysearch: `// Binary Search (iterative)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];
    
    if (midVal === target) {
      return mid; // Found
    } else if (midVal < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}

// Binary Search (recursive)
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// First occurrence of target
function firstOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      right = mid - 1; // Continue searching left
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// Last occurrence of target
function lastOccurrence(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      result = mid;
      left = mid + 1; // Continue searching right
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return result;
}

// Count occurrences
function countOccurrences(arr, target) {
  const first = firstOccurrence(arr, target);
  const last = lastOccurrence(arr, target);
  return first === -1 ? 0 : last - first + 1;
}

// Lower bound (first >= target)
function lowerBound(arr, target) {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}

// Upper bound (first > target)
function upperBound(arr, target) {
  let left = 0;
  let right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}

// Usage
binarySearch([1, 3, 5, 7, 9, 11], 7);   // 3
countOccurrences([1, 2, 2, 2, 3, 4], 2); // 3
lowerBound([1, 2, 2, 2, 3, 4], 2);      // 1 (first 2)`,
  
  bfs: `// Breadth-First Search
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  visited.add(start);
  
  while (queue.length) {
    const vertex = queue.shift();
    result.push(vertex);
    
    for (const neighbor of graph.adjacencyList.get(vertex)) {
      if (!visited.has(neighbor.vertex)) {
        visited.add(neighbor.vertex);
        queue.push(neighbor.vertex);
      }
    }
  }
  
  return result;
}

// BFS with distances
function bfsDistance(graph, start) {
  const distances = new Map();
  const queue = [start];
  distances.set(start, 0);
  
  while (queue.length) {
    const vertex = queue.shift();
    
    for (const neighbor of graph.adjacencyList.get(vertex)) {
      if (!distances.has(neighbor.vertex)) {
        distances.set(neighbor.vertex, distances.get(vertex) + 1);
        queue.push(neighbor.vertex);
      }
    }
  }
  
  return distances;
}

// BFS Shortest Path (unweighted)
function bfsShortestPath(graph, start, end) {
  if (start === end) return [start];
  
  const visited = new Set([start]);
  const queue = [[start]];
  
  while (queue.length) {
    const path = queue.shift();
    const vertex = path[path.length - 1];
    
    for (const neighbor of graph.adjacencyList.get(vertex)) {
      if (neighbor.vertex === end) {
        return [...path, end];
      }
      if (!visited.has(neighbor.vertex)) {
        visited.add(neighbor.vertex);
        queue.push([...path, neighbor.vertex]);
      }
    }
  }
  
  return null;
}

// Level Order Traversal (tree-specific)
function levelOrderTraversal(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}

// Usage
bfs(graph, 'A'); // ['A', 'B', 'C', 'D', 'E', 'F']`,
  
  dfs: `// Depth-First Search (recursive)
function dfs(graph, start, visited = new Set(), result = []) {
  visited.add(start);
  result.push(start);
  
  for (const neighbor of graph.adjacencyList.get(start)) {
    if (!visited.has(neighbor.vertex)) {
      dfs(graph, neighbor.vertex, visited, result);
    }
  }
  
  return result;
}

// DFS (iterative/stack-based)
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];
  
  while (stack.length) {
    const vertex = stack.pop();
    
    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);
      
      // Push in reverse order for correct order
      const neighbors = graph.adjacencyList.get(vertex);
      for (let i = neighbors.length - 1; i >= 0; i--) {
        if (!visited.has(neighbors[i].vertex)) {
          stack.push(neighbors[i].vertex);
        }
      }
    }
  }
  
  return result;
}

// Pre-order traversal (node, left, right)
function preOrder(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  preOrder(node.left, result);
  preOrder(node.right, result);
  return result;
}

// In-order traversal (left, node, right)
function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.value);
  inOrder(node.right, result);
  return result;
}

// Post-order traversal (left, right, node)
function postOrder(node, result = []) {
  if (!node) return result;
  postOrder(node.left, result);
  postOrder(node.right, result);
  result.push(node.value);
  return result;
}

// Detect cycle in undirected graph
function hasCycleDFS(graph) {
  const visited = new Set();
  
  for (const vertex of graph.adjacencyList.keys()) {
    if (!visited.has(vertex)) {
      if (hasCycleDFSUtil(graph, vertex, visited, -1)) {
        return true;
      }
    }
  }
  return false;
}

function hasCycleDFSUtil(graph, vertex, visited, parent) {
  visited.add(vertex);
  
  for (const neighbor of graph.adjacencyList.get(vertex)) {
    if (neighbor.vertex === parent) continue;
    if (visited.has(neighbor.vertex)) {
      return true;
    }
    if (hasCycleDFSUtil(graph, neighbor.vertex, visited, vertex)) {
      return true;
    }
  }
  return false;
}

// Count connected components
function countComponents(graph) {
  const visited = new Set();
  let count = 0;
  
  for (const vertex of graph.adjacencyList.keys()) {
    if (!visited.has(vertex)) {
      count++;
      dfsMark(graph, vertex, visited);
    }
  }
  
  return count;
}

function dfsMark(graph, vertex, visited) {
  visited.add(vertex);
  for (const neighbor of graph.adjacencyList.get(vertex)) {
    if (!visited.has(neighbor.vertex)) {
      dfsMark(graph, neighbor.vertex, visited);
    }
  }
}

// Usage
dfs(graph, 'A'); // ['A', 'B', 'D', 'F', 'C', 'E']`,
  
  dijkstra: `// Dijkstra's Algorithm (Priority Queue based)
class PriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  enqueue(vertex, priority) {
    this.heap.push({ vertex, priority });
    this._bubbleUp(this.heap.length - 1);
  }
  
  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index].priority >= this.heap[parent].priority) break;
      [this.heap[index], this.heap[parent]] = 
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
  
  dequeue() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }
  
  _bubbleDown(index) {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      
      if (left < this.heap.length && 
          this.heap[left].priority < this.heap[smallest].priority) {
        smallest = left;
      }
      if (right < this.heap.length && 
          this.heap[right].priority < this.heap[smallest].priority) {
        smallest = right;
      }
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
}

function dijkstra(graph, start, end) {
  const distances = new Map();
  const previous = new Map();
  const pq = new PriorityQueue();
  
  // Initialize
  for (const vertex of graph.adjacencyList.keys()) {
    distances.set(vertex, Infinity);
  }
  distances.set(start, 0);
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const { vertex: current } = pq.dequeue();
    
    if (current === end) {
      // Reconstruct path
      const path = [];
      let vertex = end;
      while (vertex) {
        path.unshift(vertex);
        vertex = previous.get(vertex);
      }
      return { distance: distances.get(end), path };
    }
    
    for (const neighbor of graph.adjacencyList.get(current)) {
      const alt = distances.get(current) + neighbor.weight;
      if (alt < distances.get(neighbor.vertex)) {
        distances.set(neighbor.vertex, alt);
        previous.set(neighbor.vertex, current);
        pq.enqueue(neighbor.vertex, alt);
      }
    }
  }
  
  return { distance: Infinity, path: [] };
}

// Dijkstra with Fibonacci Heap (optimal)
function dijkstraFibonacci(graph, start, end) {
  // For production, use a proper Fibonacci heap library
  // This is a simplified version for demonstration
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set();
  
  for (const vertex of graph.adjacencyList.keys()) {
    distances.set(vertex, Infinity);
    unvisited.add(vertex);
  }
  distances.set(start, 0);
  
  while (unvisited.size > 0) {
    // Find minimum (simplified - use actual heap for production)
    let current = null;
    let minDist = Infinity;
    for (const vertex of unvisited) {
      if (distances.get(vertex) < minDist) {
        minDist = distances.get(vertex);
        current = vertex;
      }
    }
    
    if (current === null || current === end) break;
    unvisited.delete(current);
    
    for (const neighbor of graph.adjacencyList.get(current)) {
      if (unvisited.has(neighbor.vertex)) {
        const alt = distances.get(current) + neighbor.weight;
        if (alt < distances.get(neighbor.vertex)) {
          distances.set(neighbor.vertex, alt);
          previous.set(neighbor.vertex, current);
        }
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let vertex = end;
  while (vertex) {
    path.unshift(vertex);
    vertex = previous.get(vertex);
  }
  
  return { distance: distances.get(end), path };
}

// Usage
const result = dijkstra(graph, 'A', 'F');
// { distance: 3, path: ['A', 'B', 'D', 'F'] }`,
  
  astar: `// A* Search Algorithm
class AStarPriorityQueue {
  constructor() {
    this.heap = [];
  }
  
  enqueue(state, fScore) {
    this.heap.push({ state, fScore });
    this._bubbleUp(this.heap.length - 1);
  }
  
  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index].fScore >= this.heap[parent].fScore) break;
      [this.heap[index], this.heap[parent]] = 
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
  
  dequeue() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }
  
  _bubbleDown(index) {
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      
      if (left < this.heap.length && 
          this.heap[left].fScore < this.heap[smallest].fScore) {
        smallest = left;
      }
      if (right < this.heap.length && 
          this.heap[right].fScore < this.heap[smallest].fScore) {
        smallest = right;
      }
      if (smallest === index) break;
      
      [this.heap[index], this.heap[smallest]] = 
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
  
  isEmpty() {
    return this.heap.length === 0;
  }
}

function heuristic(node, goal, graph) {
  // Manhattan distance for grid
  // For actual use, implement appropriate heuristic
  return 0; // For uniform cost search, use h = 0
}

function aStar(graph, start, end, getHeuristic) {
  const gScore = new Map(); // Cost from start
  const fScore = new Map(); // gScore + heuristic
  const openSet = new AStarPriorityQueue();
  const cameFrom = new Map();
  
  // Initialize
  for (const vertex of graph.adjacencyList.keys()) {
    gScore.set(vertex, Infinity);
    fScore.set(vertex, Infinity);
  }
  gScore.set(start, 0);
  fScore.set(start, getHeuristic(start, end));
  openSet.enqueue(start, fScore.get(start));
  
  while (!openSet.isEmpty()) {
    const { state: current } = openSet.dequeue();
    
    if (current === end) {
      // Reconstruct path
      const path = [];
      let vertex = end;
      while (vertex) {
        path.unshift(vertex);
        vertex = cameFrom.get(vertex);
      }
      return { path, cost: gScore.get(end) };
    }
    
    for (const neighbor of graph.adjacencyList.get(current)) {
      const tentativeG = gScore.get(current) + neighbor.weight;
      
      if (tentativeG < gScore.get(neighbor.vertex)) {
        cameFrom.set(neighbor.vertex, current);
        gScore.set(neighbor.vertex, tentativeG);
        const f = tentativeG + getHeuristic(neighbor.vertex, end);
        fScore.set(neighbor.vertex, f);
        openSet.enqueue(neighbor.vertex, f);
      }
    }
  }
  
  return { path: [], cost: Infinity }; // No path found
}

// 8-Puzzle Solver with A*
function solve8Puzzle(start, goal) {
  // Implement Manhattan distance heuristic
  function manhattan(state) {
    let dist = 0;
    for (let i = 0; i < 9; i++) {
      if (state[i] === 0) continue;
      const goalPos = goal.indexOf(state[i]);
      const row1 = Math.floor(i / 3);
      const col1 = i % 3;
      const row2 = Math.floor(goalPos / 3);
      const col2 = goalPos % 3;
      dist += Math.abs(row1 - row2) + Math.abs(col1 - col2);
    }
    return dist;
  }
  
  // Returns neighbors and their costs
  function getNeighbors(state) {
    const neighbors = [];
    const emptyIdx = state.indexOf(0);
    const row = Math.floor(emptyIdx / 3);
    const col = emptyIdx % 3;
    
    const moves = [
      { dr: -1, dc: 0 }, // up
      { dr: 1, dc: 0 },  // down
      { dr: 0, dc: -1 }, // left
      { dr: 0, dc: 1 }   // right
    ];
    
    for (const move of moves) {
      const newRow = row + move.dr;
      const newCol = col + move.dc;
      
      if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
        const newIdx = newRow * 3 + newCol;
        const newState = [...state];
        [newState[emptyIdx], newState[newIdx]] = 
          [newState[newIdx], newState[emptyIdx]];
        neighbors.push({ state: newState, cost: 1 });
      }
    }
    
    return neighbors;
  }
  
  // A* implementation for puzzle...
  return aStarPuzzle(start, goal, manhattan, getNeighbors);
}`,
  
  prim: `// Prim's Algorithm for MST
class PrimMST {
  constructor(graph) {
    this.graph = graph;
  }
  
  mst(start = 0) {
    const n = this.graph.adjacencyList.size;
    const key = new Array(n).fill(Infinity);
    const parent = new Array(n).fill(-1);
    const inMST = new Array(n).fill(false);
    const edges = [];
    let totalWeight = 0;
    
    // Start from vertex 0
    key[start] = 0;
    
    for (let i = 0; i < n; i++) {
      // Find minimum key vertex not in MST
      let u = -1;
      for (let v = 0; v < n; v++) {
        if (!inMST[v] && (u === -1 || key[v] < key[u])) {
          u = v;
        }
      }
      
      if (key[u] === Infinity) break; // Disconnected graph
      
      inMST[u] = true;
      totalWeight += key[u];
      
      if (parent[u] !== -1) {
        edges.push({ u: parent[u], v: u, weight: key[u] });
      }
      
      // Update keys of adjacent vertices
      for (const neighbor of this.graph.adjacencyList.get(u)) {
        const v = neighbor.vertex;
        const weight = neighbor.weight;
        if (!inMST[v] && weight < key[v]) {
          key[v] = weight;
          parent[v] = u;
        }
      }
    }
    
    return { edges, totalWeight };
  }
}

// Prim's with Priority Queue (O(E log V))
class PrimMSTPQ {
  constructor(graph) {
    this.graph = graph;
  }
  
  mst(startVertex = 0) {
    const vertices = Array.from(this.graph.adjacencyList.keys());
    const n = vertices.length;
    const vertexIndex = new Map();
    vertices.forEach((v, i) => vertexIndex.set(v, i));
    
    const inMST = new Array(n).fill(false);
    const key = new Array(n).fill(Infinity);
    const parent = new Array(n).fill(-1);
    const pq = new PriorityQueue();
    
    key[vertexIndex.get(startVertex)] = 0;
    pq.enqueue(startVertex, 0);
    
    while (!pq.isEmpty()) {
      const { vertex: u } = pq.dequeue();
      const uIdx = vertexIndex.get(u);
      
      if (inMST[uIdx]) continue;
      inMST[uIdx] = true;
      
      for (const neighbor of this.graph.adjacencyList.get(u)) {
        const v = neighbor.vertex;
        const vIdx = vertexIndex.get(v);
        const weight = neighbor.weight;
        
        if (!inMST[vIdx] && weight < key[vIdx]) {
          key[vIdx] = weight;
          parent[vIdx] = u;
          pq.enqueue(v, weight);
        }
      }
    }
    
    // Build edge list
    const edges = [];
    let totalWeight = 0;
    
    for (let i = 0; i < n; i++) {
      if (parent[i] !== -1) {
        const u = vertices[parent[i]];
        const v = vertices[i];
        edges.push({ u, v, weight: key[i] });
        totalWeight += key[i];
      }
    }
    
    return { edges, totalWeight };
  }
}

// Usage
const prim = new PrimMST(graph);
const mst = prim.mst('A');`,
  
  kruskal: `// Kruskal's Algorithm for MST
function kruskalMST(graph) {
  // Collect all edges
  const edges = [];
  for (const [vertex, neighbors] of graph.adjacencyList) {
    for (const neighbor of neighbors) {
      // Add edge only once (for undirected graph)
      if (graph.isDirected || vertex < neighbor.vertex) {
        edges.push({
          u: vertex,
          v: neighbor.vertex,
          weight: neighbor.weight
        });
      }
    }
  }
  
  // Sort edges by weight (ascending)
  edges.sort((a, b) => a.weight - b.weight);
  
  // Initialize Union-Find
  const vertices = Array.from(graph.adjacencyList.keys());
  const uf = new UnionFind(vertices.length);
  const vertexToIndex = new Map();
  vertices.forEach((v, i) => vertexToIndex.set(v, i));
  
  const mstEdges = [];
  let totalWeight = 0;
  
  for (const edge of edges) {
    const uIdx = vertexToIndex.get(edge.u);
    const vIdx = vertexToIndex.get(edge.v);
    
    if (uf.find(uIdx) !== uf.find(vIdx)) {
      uf.union(uIdx, vIdx);
      mstEdges.push(edge);
      totalWeight += edge.weight;
      
      if (mstEdges.length === vertices.length - 1) {
        break; // MST complete
      }
    }
  }
  
  return { edges: mstEdges, totalWeight };
}

// Kruskal's with edge filtering
function kruskalMSTOptimized(graph) {
  const edges = [];
  
  // Collect unique edges
  const edgeSet = new Set();
  for (const [vertex, neighbors] of graph.adjacencyList) {
    for (const neighbor of neighbors) {
      const key = graph.isDirected 
        ? \`\${vertex}-\${neighbor.vertex}\`
        : \`\${Math.min(vertex, neighbor.vertex)}-\${Math.max(vertex, neighbor.vertex)}\`;
      
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({
          u: vertex,
          v: neighbor.vertex,
          weight: neighbor.weight
        });
      }
    }
  }
  
  // Sort and process
  edges.sort((a, b) => a.weight - b.weight);
  
  // Union-Find with path compression and union by rank
  const vertices = Array.from(graph.adjacencyList.keys());
  const parent = new Map();
  const rank = new Map();
  
  vertices.forEach(v => {
    parent.set(v, v);
    rank.set(v, 0);
  });
  
  function find(x) {
    if (parent.get(x) !== x) {
      parent.set(x, find(parent.get(x)));
    }
    return parent.get(x);
  }
  
  function union(x, y) {
    const rootX = find(x);
    const rootY = find(y);
    
    if (rootX === rootY) return false;
    
    if (rank.get(rootX) < rank.get(rootY)) {
      parent.set(rootX, rootY);
    } else if (rank.get(rootX) > rank.get(rootY)) {
      parent.set(rootY, rootX);
    } else {
      parent.set(rootY, rootX);
      rank.set(rootX, rank.get(rootX) + 1);
    }
    
    return true;
  }
  
  const mst = [];
  let totalWeight = 0;
  
  for (const edge of edges) {
    if (union(edge.u, edge.v)) {
      mst.push(edge);
      totalWeight += edge.weight;
    }
  }
  
  return { edges: mst, totalWeight };
}

// Borůvka's Algorithm (parallel MST)
function boruvkaMST(graph) {
  const vertices = Array.from(graph.adjacencyList.keys());
  const uf = new UnionFind(vertices.length);
  const vertexToIndex = new Map();
  vertices.forEach((v, i) => vertexToIndex.set(v, i));
  
  let mstEdges = [];
  let totalWeight = 0;
  
  while (mstEdges.length < vertices.length - 1) {
    // Find minimum outgoing edge for each component
    const cheapest = new Map();
    
    for (const [vertex, neighbors] of graph.adjacencyList) {
      const uIdx = vertexToIndex.get(vertex);
      const rootU = uf.find(uIdx);
      
      for (const neighbor of neighbors) {
        const vIdx = vertexToIndex.get(neighbor.vertex);
        const rootV = uf.find(vIdx);
        
        if (rootU !== rootV) {
          const current = cheapest.get(rootU);
          if (!current || neighbor.weight < current.weight) {
            cheapest.set(rootU, { from: vertex, to: neighbor.vertex, weight: neighbor.weight, toRoot: rootV });
          }
        }
      }
    }
    
    // Add cheapest edges
    const added = new Set();
    for (const [root, edge] of cheapest) {
      if (added.has(root) || added.has(edge.toRoot)) continue;
      
      const uIdx = vertexToIndex.get(edge.from);
      const vIdx = vertexToIndex.get(edge.to);
      
      if (uf.find(uIdx) !== uf.find(vIdx)) {
        uf.union(uIdx, vIdx);
        mstEdges.push({ u: edge.from, v: edge.to, weight: edge.weight });
        totalWeight += edge.weight;
        added.add(root);
        added.add(edge.toRoot);
      }
    }
    
    if (cheapest.size === 0) break; // MST complete
  }
  
  return { edges: mstEdges, totalWeight };
}

// Usage
kruskalMST(graph);`,
  
  fibonacci: `// Fibonacci - Recursive (exponential O(2^n))
function fibRecursive(n) {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// Fibonacci - Memoization (top-down DP)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

// Fibonacci - Tabulation (bottom-up DP)
function fibTab(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1).fill(0);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// Fibonacci - Space Optimized
function fibOptimized(n) {
  if (n <= 1) return n;
  
  let prev2 = 0;
  let prev1 = 1;
  let current = 0;
  
  for (let i = 2; i <= n; i++) {
    current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return current;
}

// Fibonacci - Matrix Exponentiation (O(log n))
function fibMatrix(n) {
  if (n <= 1) return n;
  
  function multiply(A, B) {
    return [
      [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
      [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
    ];
  }
  
  function power(matrix, power) {
    const result = [[1, 0], [0, 1]]; // Identity
    const base = matrix;
    
    while (power > 0) {
      if (power % 2 === 1) {
        result = multiply(result, base);
      }
      base = multiply(base, base);
      power = Math.floor(power / 2);
    }
    
    return result;
  }
  
  const matrix = [[1, 1], [1, 0]];
  const powered = power(matrix, n - 1);
  
  return powered[0][0];
}

// Fibonacci - Binet's Formula (closed form)
function fibBinet(n) {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618
  const psi = (1 - Math.sqrt(5)) / 2; // Conjugate ≈ -0.618
  
  return Math.round((Math.pow(phi, n) - Math.pow(psi, n)) / Math.sqrt(5));
}

// Usage
fibOptimized(10); // 55
fibMatrix(50);    // 12586269025`,
  
  knapsack: `// 0/1 Knapsack - Recursive
function knapsackRecursive(weights, values, capacity, n) {
  if (n === 0 || capacity === 0) return 0;
  
  if (weights[n - 1] > capacity) {
    return knapsackRecursive(weights, values, capacity, n - 1);
  }
  
  return Math.max(
    values[n - 1] + knapsackRecursive(weights, values, capacity - weights[n - 1], n - 1),
    knapsackRecursive(weights, values, capacity, n - 1)
  );
}

// 0/1 Knapsack - Memoization
function knapsackMemo(weights, values, capacity) {
  const n = weights.length;
  const memo = new Map();
  
  function dp(i, w) {
    const key = \`\${i}-\${w}\`;
    if (key in memo) return memo[key];
    if (i === 0 || w === 0) return 0;
    
    if (weights[i - 1] > w) {
      memo[key] = dp(i - 1, w);
    } else {
      memo[key] = Math.max(
        values[i - 1] + dp(i - 1, w - weights[i - 1]),
        dp(i - 1, w)
      );
    }
    
    return memo[key];
  }
  
  return dp(n, capacity);
}

// 0/1 Knapsack - Tabulation
function knapsackTab(weights, values, capacity) {
  const n = weights.length;
  const dp = new Array(n + 1).fill(null).map(() => new Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

// 0/1 Knapsack - Space Optimized
function knapsackSpace(weights, values, capacity) {
  const n = weights.length;
  const dp = new Array(capacity + 1).fill(0);
  
  for (let i = 0; i < n; i++) {
    // Iterate backwards to avoid overwriting
    for (let w = capacity; w >= weights[i]; w--) {
      dp[w] = Math.max(dp[w], values[i] + dp[w - weights[i]]);
    }
  }
  
  return dp[capacity];
}

// Get items in optimal solution
function knapsackItems(weights, values, capacity) {
  const n = weights.length;
  const dp = new Array(n + 1).fill(null).map(() => new Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  // Backtrack to find items
  const items = [];
  let w = capacity;
  
  for (let i = n; i > 0 && w > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      items.push({
        index: i - 1,
        weight: weights[i - 1],
        value: values[i - 1]
      });
      w -= weights[i - 1];
    }
  }
  
  return { maxValue: dp[n][capacity], items };
}

// Unbounded Knapsack (unlimited items)
function unboundedKnapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = new Array(capacity + 1).fill(0);
  
  for (let i = 0; i <= capacity; i++) {
    for (let j = 0; j < n; j++) {
      if (weights[j] <= i) {
        dp[i] = Math.max(dp[i], values[j] + dp[i - weights[j]]);
      }
    }
  }
  
  return dp[capacity];
}

// Usage
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;
knapsackSpace(weights, values, capacity); // 9 (items: 1, 4, 5)`,
  
  // ==================== DISTRIBUTED PATTERNS ====================
  ratelimiter: `// Token Bucket Rate Limiter
class TokenBucket {
  constructor(options = {}) {
    this.capacity = options.capacity || 100;     // Max tokens
    this.refillRate = options.refillRate || 10;   // Tokens per second
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }
  
  // Refill tokens based on elapsed time
  _refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // seconds
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
  
  // Try to consume tokens
  tryConsume(tokens = 1) {
    this._refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return { allowed: true, remaining: this.tokens };
    }
    
    return {
      allowed: false,
      remaining: this.tokens,
      retryAfter: Math.ceil((tokens - this.tokens) / this.refillRate * 1000)
    };
  }
  
  // Get current state
  getState() {
    this._refill();
    return {
      tokens: this.tokens,
      capacity: this.capacity,
      refillRate: this.refillRate
    };
  }
}

// Leaky Bucket Rate Limiter
class LeakyBucket {
  constructor(options = {}) {
    this.capacity = options.capacity || 100;
    this.rate = options.rate || 10; // Processed per second
    this.queue = [];
    this.lastProcessed = Date.now();
  }
  
  // Add request to queue
  add(request) {
    if (this.queue.length >= this.capacity) {
      return { allowed: false, reason: 'queue_full' };
    }
    
    this.queue.push(request);
    this._process();
    
    return { allowed: true, position: this.queue.length };
  }
  
  // Process queue at fixed rate
  _process() {
    const now = Date.now();
    const elapsed = (now - this.lastProcessed) / 1000;
    const toProcess = Math.floor(elapsed * this.rate);
    
    if (toProcess > 0) {
      this.queue.splice(0, toProcess);
      this.lastProcessed = now;
    }
  }
  
  // Get queue size
  size() {
    this._process();
    return this.queue.length;
  }
}

// Sliding Window Rate Limiter
class SlidingWindow {
  constructor(options = {}) {
    this.limit = options.limit || 100;      // Max requests
    this.windowSize = options.windowSize || 60000; // 1 minute in ms
    this.requests = [];
  }
  
  // Check if request is allowed
  tryRequest() {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.windowSize
    );
    
    if (this.requests.length >= this.limit) {
      const retryAfter = this.windowSize - (now - this.requests[0]);
      return { allowed: false, retryAfter };
    }
    
    this.requests.push(now);
    return {
      allowed: true,
      remaining: this.limit - this.requests.length
    };
  }
}

// Usage
const limiter = new TokenBucket({ capacity: 10, refillRate: 1 });
limiter.tryConsume(); // Allow request
limiter.getState();   // { tokens: 9, capacity: 10, refillRate: 1 }`,
  
  circuitbreaker: `// Circuit Breaker Pattern
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 30000; // 30 seconds
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailure = null;
    this.successes = 0;
    this.halfOpenSuccesses = 0;
  }
  
  // Execute function with circuit breaker protection
  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailure >= this.timeout) {
        this._transitionTo('HALF_OPEN');
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }
    
    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure();
      throw error;
    }
  }
  
  _onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.successes++;
      if (this.successes >= 3) {
        this._transitionTo('CLOSED');
      }
    } else {
      this.failures = 0;
    }
  }
  
  _onFailure() {
    this.lastFailure = Date.now();
    this.failures++;
    
    if (this.state === 'HALF_OPEN') {
      this._transitionTo('OPEN');
    } else if (this.failures >= this.failureThreshold) {
      this._transitionTo('OPEN');
    }
  }
  
  _transitionTo(newState) {
    const oldState = this.state;
    this.state = newState;
    
    if (newState === 'CLOSED') {
      this.failures = 0;
      this.successes = 0;
    } else if (newState === 'HALF_OPEN') {
      this.successes = 0;
    }
    
    console.log(\`Circuit breaker: \${oldState} -> \${newState}\`);
  }
  
  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailure: this.lastFailure
    };
  }
}

// Circuit Breaker with state machine
class AdvancedCircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.successThreshold = options.successThreshold || 3;
    this.timeout = options.timeout || 60000;
    
    this.state = 'CLOSED';
    this.lastStateChange = Date.now();
    this.failureCount = 0;
    this.successCount = 0;
  }
  
  async execute(fn, fallback = null) {
    if (!this._isRequestAllowed()) {
      if (fallback) return fallback();
      throw new Error(\`Circuit breaker is \${this.state}\`);
    }
    
    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure();
      if (fallback) return fallback();
      throw error;
    }
  }
  
  _isRequestAllowed() {
    if (this.state === 'CLOSED') return true;
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastStateChange >= this.timeout) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return this.state === 'HALF_OPEN';
  }
  
  _onSuccess() {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
    this.lastStateChange = Date.now();
  }
  
  _onFailure() {
    this.failureCount++;
    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
    this.lastStateChange = Date.now();
  }
}

// Usage
const breaker = new CircuitBreaker({ failureThreshold: 3, timeout: 5000 });
breaker.execute(async () => {
  const response = await fetch('/api/data');
  return response.json();
}).catch(err => {
  console.log('Request failed:', err.message);
});`,
  
  distributedlock: `// Distributed Lock using Redis
class RedisLock {
  constructor(redisClient, options = {}) {
    this.redis = redisClient;
    this.lockPrefix = options.lockPrefix || 'lock:';
    this.defaultTTL = options.ttl || 30000; // 30 seconds
  }
  
  // Acquire lock
  async acquire(lockName, ttl = this.defaultTTL) {
    const lockKey = \`\${this.lockPrefix}\${lockName}\`;
    const lockValue = \`\${Date.now()}-\${Math.random()}\`;
    
    // Try to set with NX and EX
    const result = await this.redis.set(lockKey, lockValue, 'NX', 'PX', ttl);
    
    if (result === 'OK') {
      return {
        acquired: true,
        token: lockValue,
        key: lockKey,
        ttl
      };
    }
    
    return { acquired: false };
  }
  
  // Release lock (only if we own it)
  async release(lock) {
    const script = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    \`;
    
    await this.redis.eval(script, 1, lock.key, lock.token);
  }
  
  // Extend lock TTL
  async extend(lock, newTTL) {
    const script = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    \`;
    
    const result = await this.redis.eval(script, 1, lock.key, lock.token, newTTL);
    if (result === 1) {
      lock.ttl = newTTL;
      return true;
    }
    return false;
  }
  
  // Execute with lock
  async withLock(lockName, fn, ttl = this.defaultTTL) {
    const lock = await this.acquire(lockName, ttl);
    
    if (!lock.acquired) {
      throw new Error(\`Could not acquire lock: \${lockName}\`);
    }
    
    try {
      return await fn();
    } finally {
      await this.release(lock);
    }
  }
}

// Redlock Algorithm (for distributed systems)
class Redlock {
  constructor(redisClients, options = {}) {
    this.clients = redisClients;
    this.quorum = Math.floor(redisClients.length / 2) + 1;
    this.lockPrefix = options.lockPrefix || 'redlock:';
    this.defaultTTL = options.ttl || 30000;
  }
  
  async acquire(lockName, ttl = this.defaultTTL) {
    const lockKey = \`\${this.lockPrefix}\${lockName}\`;
    const lockValue = \`\${Date.now()}-\${Math.random()}\`;
    const locks = [];
    
    // Try to acquire on majority of nodes
    for (const redis of this.clients) {
      try {
        const result = await redis.set(lockKey, lockValue, 'NX', 'PX', ttl);
        if (result === 'OK') {
          locks.push({ redis, key: lockKey, value: lockValue });
        }
      } catch (e) {
        // Node failed, continue
      }
    }
    
    // Check if we have quorum
    if (locks.length >= this.quorum) {
      return {
        acquired: true,
        locks,
        ttl,
        quorum: this.quorum
      };
    }
    
    // Release on acquired nodes
    for (const lock of locks) {
      await this._releaseOne(lock);
    }
    
    return { acquired: false };
  }
  
  async _releaseOne(lock) {
    const script = \`
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      end
    \`;
    try {
      await lock.redis.eval(script, 1, lock.key, lock.value);
    } catch (e) {
      // Ignore
    }
  }
  
  async release(lock) {
    for (const l of lock.locks) {
      await this._releaseOne(l);
    }
  }
}

// Usage with Redis
const redisLock = new RedisLock(redisClient);
await redisLock.withLock('my-resource', async () => {
  // Critical section
  await doImportantWork();
});`,
  
  loadbalancer: `// Load Balancer
class LoadBalancer {
  constructor(options = {}) {
    this.servers = options.servers || [];
    this.strategy = options.strategy || 'round-robin';
    this.weights = options.weights || {};
    this.healthChecks = options.healthChecks || true;
    this.connections = new Map();
    this.currentIndex = 0;
    this.healthy = new Set();
  }
  
  // Add server
  addServer(server, weight = 1) {
    this.servers.push(server);
    this.weights[server] = weight;
    this.healthy.add(server);
  }
  
  // Remove server
  removeServer(server) {
    this.servers = this.servers.filter(s => s !== server);
    this.healthy.delete(server);
    this.connections.delete(server);
  }
  
  // Get next server based on strategy
  getServer() {
    const available = this.healthChecks
      ? this.servers.filter(s => this.healthy.has(s))
      : this.servers;
    
    if (available.length === 0) return null;
    
    switch (this.strategy) {
      case 'round-robin':
        return this._roundRobin(available);
      case 'least-connections':
        return this._leastConnections(available);
      case 'weighted':
        return this._weighted(available);
      case 'ip-hash':
        return this._ipHash(available);
      case 'least-response-time':
        return this._leastResponseTime(available);
      default:
        return available[0];
    }
  }
  
  _roundRobin(servers) {
    const server = servers[this.currentIndex % servers.length];
    this.currentIndex++;
    return server;
  }
  
  _leastConnections(servers) {
    let minConnections = Infinity;
    let selected = servers[0];
    
    for (const server of servers) {
      const conn = this.connections.get(server) || 0;
      if (conn < minConnections) {
        minConnections = conn;
        selected = server;
      }
    }
    
    return selected;
  }
  
  _weighted(servers) {
    const totalWeight = servers.reduce((sum, s) => sum + (this.weights[s] || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const server of servers) {
      const weight = this.weights[server] || 1;
      random -= weight;
      if (random <= 0) return server;
    }
    
    return servers[0];
  }
  
  _ipHash(request) {
    const ip = request.ip || '127.0.0.1';
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash) + ip.charCodeAt(i);
      hash = hash & hash;
    }
    return servers[Math.abs(hash) % servers.length];
  }
  
  _leastResponseTime(servers) {
    // Would need response time tracking
    return this._leastConnections(servers);
  }
  
  // Track request
  startRequest(server) {
    const current = this.connections.get(server) || 0;
    this.connections.set(server, current + 1);
  }
  
  endRequest(server, responseTime) {
    const current = this.connections.get(server) || 0;
    this.connections.set(server, current - 1);
    // Could track responseTime for least-response-time strategy
  }
  
  // Health check (simplified)
  async checkHealth(server) {
    try {
      // In real implementation, make actual health check
      const healthy = await fetch(\`\${server}/health\`).then(r => r.ok);
      if (healthy) {
        this.healthy.add(server);
      } else {
        this.healthy.delete(server);
      }
    } catch (e) {
      this.healthy.delete(server);
    }
  }
}

// Usage
const lb = new LoadBalancer({
  servers: ['server1:8080', 'server2:8080', 'server3:8080'],
  strategy: 'least-connections'
});

const server = lb.getServer();
lb.startRequest(server);
await makeRequest(server);
lb.endRequest(server, 150);`,
  
  cachingsharding: `// Cache Sharding
class CacheShard {
  constructor(options = {}) {
    this.shards = options.shards || [];
    this.shardCount = this.shards.length;
    this.strategy = options.strategy || 'hash';
    this.shardConnections = new Map();
  }
  
  // Get shard for key
  getShard(key) {
    switch (this.strategy) {
      case 'hash':
        return this._hashShard(key);
      case 'consistent-hash':
        return this._consistentHashShard(key);
      case 'range':
        return this._rangeShard(key);
      default:
        return this._hashShard(key);
    }
  }
  
  _hashShard(key) {
    const hash = this._hash(key);
    return this.shards[hash % this.shardCount];
  }
  
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  _consistentHashShard(key) {
    // Simplified consistent hash
    const hash = this._hash(key);
    return this.shards[hash % this.shardCount];
  }
  
  _rangeShard(key) {
    // For keys with numeric or alphabetical ordering
    const ranges = [
      { start: 'a', end: 'm', shard: 0 },
      { start: 'n', end: 'z', shard: 1 }
    ];
    for (const range of ranges) {
      if (key.localeCompare(range.start) >= 0 && 
          key.localeCompare(range.end) <= 0) {
        return this.shards[range.shard];
      }
    }
    return this.shards[0];
  }
  
  // Get value
  async get(key) {
    const shard = this.getShard(key);
    const connection = await this._getConnection(shard);
    return connection.get(key);
  }
  
  // Set value
  async set(key, value, ttl) {
    const shard = this.getShard(key);
    const connection = await this._getConnection(shard);
    return connection.set(key, value, ttl);
  }
  
  // Delete
  async delete(key) {
    const shard = this.getShard(key);
    const connection = await this._getConnection(shard);
    return connection.delete(key);
  }
  
  // Get connection (lazy initialization)
  async _getConnection(shard) {
    if (!this.shardConnections.has(shard)) {
      this.shardConnections.set(shard, await this._connect(shard));
    }
    return this.shardConnections.get(shard);
  }
  
  async _connect(shard) {
    // In real implementation, connect to actual cache
    return {
      get: async (k) => { /* ... */ },
      set: async (k, v, t) => { /* ... */ },
      delete: async (k) => { /* ... */ }
    };
  }
}

// Consistent Hash Ring
class ConsistentHashRing {
  constructor(options = {}) {
    this.virtualNodes = options.virtualNodes || 150;
    this.ring = new Map();
    this.sortedHashes = [];
  }
  
  addServer(server) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this._hash(\`\${server}:\${i}\`);
      this.ring.set(hash, server);
    }
    this._sortRing();
  }
  
  removeServer(server) {
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = this._hash(\`\${server}:\${i}\`);
      this.ring.delete(hash);
    }
    this._sortRing();
  }
  
  getServer(key) {
    const hash = this._hash(key);
    
    // Find first server with hash >= key hash
    for (const ringHash of this.sortedHashes) {
      if (ringHash >= hash) {
        return this.ring.get(ringHash);
      }
    }
    
    // Wrap around to first server
    return this.ring.get(this.sortedHashes[0]);
  }
  
  _hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = ((hash << 5) - hash) + key.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  _sortRing() {
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b);
  }
}

// Usage
const hashRing = new ConsistentHashRing({ virtualNodes: 150 });
hashRing.addServer('cache-1:6379');
hashRing.addServer('cache-2:6379');
hashRing.addServer('cache-3:6379');

const shard = hashRing.getServer('user:12345'); // Returns appropriate shard`,
  
  messagedqueue: `// Message Queue Publisher
class MessageQueue {
  constructor(options = {}) {
    this.topics = new Map();
    this.subscribers = new Map();
    this.persistent = options.persistent || false;
    this.maxRetries = options.maxRetries || 3;
  }
  
  // Create topic
  createTopic(topic) {
    if (!this.topics.has(topic)) {
      this.topics.set(topic, []);
      this.subscribers.set(topic, []);
    }
  }
  
  // Publish message
  async publish(topic, message, options = {}) {
    const envelope = {
      id: this._generateId(),
      topic,
      message,
      timestamp: Date.now(),
      retryCount: 0,
      persistent: options.persistent || this.persistent,
      DLQ: false
    };
    
    if (envelope.persistent) {
      await this._persist(envelope);
    }
    
    this.topics.get(topic).push(envelope);
    
    // Deliver to subscribers
    const subs = this.subscribers.get(topic) || [];
    for (const subscriber of subs) {
      this._deliver(envelope, subscriber);
    }
    
    return envelope.id;
  }
  
  // Subscribe to topic
  subscribe(topic, handler, options = {}) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    
    const subscription = {
      id: this._generateId(),
      handler,
      ackRequired: options.ackRequired || false
    };
    
    this.subscribers.get(topic).push(subscription);
    
    return subscription.id;
  }
  
  // Deliver message to subscriber
  async _deliver(envelope, subscriber) {
    try {
      await subscriber.handler(envelope.message);
      
      if (subscriber.ackRequired) {
        await this._ack(envelope, subscriber);
      }
    } catch (error) {
      await this._handleFailure(envelope, subscriber, error);
    }
  }
  
  // Acknowledge message
  async _ack(envelope, subscriber) {
    // In real implementation, track acknowledgments
    envelope.acked = true;
  }
  
  // Handle delivery failure
  async _handleFailure(envelope, subscriber, error) {
    if (envelope.retryCount < this.maxRetries) {
      envelope.retryCount++;
      // Retry after delay
      setTimeout(() => {
        this._deliver(envelope, subscriber);
      }, Math.pow(2, envelope.retryCount) * 1000);
    } else {
      // Send to Dead Letter Queue
      await this._sendToDLQ(envelope, subscriber, error);
    }
  }
  
  // Dead Letter Queue
  async _sendToDLQ(envelope, subscriber, error) {
    envelope.DLQ = true;
    envelope.error = error.message;
    // Store in DLQ for later analysis
    console.error('Message sent to DLQ:', envelope);
  }
  
  // Persist message
  async _persist(envelope) {
    // In real implementation, persist to durable storage
  }
  
  _generateId() {
    return \`\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  }
}

// Consumer Group
class ConsumerGroup {
  constructor(queue, groupId, options = {}) {
    this.queue = queue;
    this.groupId = groupId;
    this.workers = options.workers || 4;
    this.partition = options.partition || null;
    this.offset = options.offset || 0;
    this.running = false;
  }
  
  async start(handler) {
    this.running = true;
    
    for (let i = 0; i < this.workers; i++) {
      this._worker(i, handler);
    }
  }
  
  async _worker(id, handler) {
    while (this.running) {
      const message = await this._consume();
      if (message) {
        await handler(message);
        await this._commitOffset();
      } else {
        await this._sleep(100);
      }
    }
  }
  
  async _consume() {
    // In real implementation, consume from partition
    return null;
  }
  
  async _commitOffset() {
    // Commit offset for consumer group
  }
  
  stop() {
    this.running = false;
  }
}

// Usage
const mq = new MessageQueue({ persistent: true });
mq.createTopic('user-events');

mq.subscribe('user-events', async (message) => {
  console.log('Processing:', message);
});

mq.publish('user-events', { type: 'user.created', userId: 123 });`,
};
