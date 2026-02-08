/**
 * Heap Implementation (Min-Heap & Max-Heap)
 * Real-world: Priority queues, Dijkstra's algorithm, HeapSort, Memory management
 */

class MinHeap {
  constructor() {
    this.heap = [];
    this.stats = {
      insertions: 0,
      deletions: 0,
      operations: []
    };
  }

  // Get parent index
  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  // Get left child index
  left(i) {
    return 2 * i + 1;
  }

  // Get right child index
  right(i) {
    return 2 * i + 2;
  }

  // Insert element
  insert(value) {
    this.heap.push(value);
    this.stats.insertions++;
    this._bubbleUp(this.heap.length - 1);
    this._logOperation('insert', { value, heapSize: this.heap.length });
    return this;
  }

  // Extract minimum
  extractMin() {
    if (this.heap.length === 0) return null;

    const min = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }

    this.stats.deletions++;
    this._logOperation('extractMin', { value: min, heapSize: this.heap.length });
    return min;
  }

  // Get minimum without removing
  peek() {
    return this.heap[0] || null;
  }

  // Bubble up element at index
  _bubbleUp(i) {
    while (i > 0) {
      const parentIdx = this.parent(i);
      if (this.heap[i] >= this.heap[parentIdx]) break;

      [this.heap[i], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[i]];
      i = parentIdx;
    }
  }

  // Bubble down element at index
  _bubbleDown(i) {
    const length = this.heap.length;

    while (true) {
      const leftIdx = this.left(i);
      const rightIdx = this.right(i);
      let smallestIdx = i;

      if (leftIdx < length && this.heap[leftIdx] < this.heap[smallestIdx]) {
        smallestIdx = leftIdx;
      }

      if (rightIdx < length && this.heap[rightIdx] < this.heap[smallestIdx]) {
        smallestIdx = rightIdx;
      }

      if (smallestIdx === i) break;

      [this.heap[i], this.heap[smallestIdx]] = [this.heap[smallestIdx], this.heap[i]];
      i = smallestIdx;
    }
  }

  // Heapify array (O(n) building)
  heapify(array) {
    this.heap = [...array];
    const startIdx = Math.floor((this.heap.length - 2) / 2);

    for (let i = startIdx; i >= 0; i--) {
      this._bubbleDown(i);
    }

    this._logOperation('heapify', { arraySize: array.length });
    return this;
  }

  // Heap Sort (ascending order)
  sort() {
    const sorted = [];
    const tempHeap = [...this.heap];

    while (tempHeap.length > 0) {
      sorted.push(tempHeap[0]);
      const last = tempHeap.pop();
      if (tempHeap.length > 0) {
        tempHeap[0] = last;
        const startIdx = Math.floor((tempHeap.length - 2) / 2);
        for (let i = startIdx; i >= 0; i--) {
          this._bubbleDownCustom(tempHeap, i, tempHeap.length);
        }
      }
    }

    this._logOperation('sort', { sortedLength: sorted.length });
    return sorted;
  }

  _bubbleDownCustom(heap, i, length) {
    while (true) {
      const leftIdx = this.left(i);
      const rightIdx = this.right(i);
      let smallestIdx = i;

      if (leftIdx < length && heap[leftIdx] < heap[smallestIdx]) {
        smallestIdx = leftIdx;
      }

      if (rightIdx < length && heap[rightIdx] < heap[smallestIdx]) {
        smallestIdx = rightIdx;
      }

      if (smallestIdx === i) break;

      [heap[i], heap[smallestIdx]] = [heap[smallestIdx], heap[i]];
      i = smallestIdx;
    }
  }

  // Find element (O(n))
  find(value) {
    const indices = [];
    for (let i = 0; i < this.heap.length; i++) {
      if (this.heap[i] === value) {
        indices.push(i);
      }
    }
    return indices;
  }

  // Update element and re-heapify
  update(oldValue, newValue) {
    const indices = this.find(oldValue);
    if (indices.length === 0) return false;

    for (const i of indices) {
      this.heap[i] = newValue;
      if (newValue < this.heap[this.parent(i)]) {
        this._bubbleUp(i);
      } else {
        this._bubbleDown(i);
      }
    }

    this._logOperation('update', { oldValue, newValue });
    return true;
  }

  // Merge two heaps
  merge(otherHeap) {
    const merged = new MinHeap();
    merged.heap = [...this.heap, ...otherHeap.heap];
    merged.heapify(merged.heap);
    return merged;
  }

  getStats() {
    return {
      size: this.heap.length,
      ...this.stats,
      operations: this.stats.operations.slice(-20)
    };
  }

  _logOperation(type, details) {
    this.stats.operations.push({ type, details, timestamp: Date.now() });
  }

  clear() {
    this.heap = [];
    this.stats = { insertions: 0, deletions: 0, operations: [] };
  }
}

class MaxHeap {
  constructor() {
    this.heap = [];
    this.stats = {
      insertions: 0,
      deletions: 0,
      operations: []
    };
  }

  parent(i) {
    return Math.floor((i - 1) / 2);
  }

  left(i) {
    return 2 * i + 1;
  }

  right(i) {
    return 2 * i + 2;
  }

  insert(value) {
    this.heap.push(value);
    this.stats.insertions++;
    this._bubbleUp(this.heap.length - 1);
    return this;
  }

  extractMax() {
    if (this.heap.length === 0) return null;

    const max = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }

    this.stats.deletions++;
    return max;
  }

  peek() {
    return this.heap[0] || null;
  }

  _bubbleUp(i) {
    while (i > 0) {
      const parentIdx = this.parent(i);
      if (this.heap[i] <= this.heap[parentIdx]) break;

      [this.heap[i], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[i]];
      i = parentIdx;
    }
  }

  _bubbleDown(i) {
    const length = this.heap.length;

    while (true) {
      const leftIdx = this.left(i);
      const rightIdx = this.right(i);
      let largestIdx = i;

      if (leftIdx < length && this.heap[leftIdx] > this.heap[largestIdx]) {
        largestIdx = leftIdx;
      }

      if (rightIdx < length && this.heap[rightIdx] > this.heap[largestIdx]) {
        largestIdx = rightIdx;
      }

      if (largestIdx === i) break;

      [this.heap[i], this.heap[largestIdx]] = [this.heap[largestIdx], this.heap[i]];
      i = largestIdx;
    }
  }

  getStats() {
    return {
      size: this.heap.length,
      ...this.stats,
      operations: this.stats.operations.slice(-20)
    };
  }

  clear() {
    this.heap = [];
    this.stats = { insertions: 0, deletions: 0, operations: [] };
  }
}

// Median Heap (Two heaps - one min, one max)
class MedianHeap {
  constructor() {
    this.maxHeap = new MaxHeap();
    this.minHeap = new MinHeap();
    this.stats = { insertions: 0, operations: [] };
  }

  insert(value) {
    if (this.maxHeap.peek() === null || value <= this.maxHeap.peek()) {
      this.maxHeap.insert(value);
    } else {
      this.minHeap.insert(value);
    }

    // Balance heaps
    if (this.maxHeap.heap.length > this.minHeap.heap.length + 1) {
      const val = this.maxHeap.extractMax();
      this.minHeap.insert(val);
    } else if (this.minHeap.heap.length > this.maxHeap.heap.length) {
      const val = this.minHeap.extractMin();
      this.maxHeap.insert(val);
    }

    this.stats.insertions++;
    this._logOperation('insert', { value });
    return this;
  }

  getMedian() {
    if (this.maxHeap.heap.length === 0) return null;

    if (this.maxHeap.heap.length === this.minHeap.heap.length) {
      return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    }

    return this.maxHeap.peek();
  }

  _logOperation(type, details) {
    this.stats.operations.push({ type, details, timestamp: Date.now() });
  }

  getStats() {
    return {
      size: this.maxHeap.heap.length + this.minHeap.heap.length,
      median: this.getMedian(),
      ...this.stats,
      operations: this.stats.operations.slice(-10)
    };
  }
}

module.exports = { MinHeap, MaxHeap, MedianHeap };
