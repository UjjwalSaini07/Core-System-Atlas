/**
 * Binary Indexed Tree (Fenwick Tree) Implementation
 * Real-world: Prefix sums, frequency arrays, order statistics, range queries
 */

class BinaryIndexedTree {
  constructor(sizeOrArray = 0) {
    if (typeof sizeOrArray === 'number') {
      this.n = sizeOrArray;
      this.tree = new Array(sizeOrArray + 1).fill(0);
    } else {
      this.n = sizeOrArray.length;
      this.tree = new Array(this.n + 1).fill(0);
      for (let i = 0; i < this.n; i++) {
        this.update(i, sizeOrArray[i]);
      }
    }
    this.original = sizeOrArray instanceof Array ? [...sizeOrArray] : [];
    this.stats = {
      updates: 0,
      queries: 0,
      operations: []
    };
  }

  // Update index i by adding delta
  update(index, delta) {
    // Convert 0-indexed to 1-indexed
    const i = index + 1;

    while (i <= this.n) {
      this.tree[i] += delta;
      i += i & -i; // Add lowest set bit
    }

    this.stats.updates++;
    this._logOperation('update', { index, delta, newValue: this.prefixSum(index) });
  }

  // Prefix sum [0, index]
  prefixSum(index) {
    let sum = 0;
    let i = index + 1;

    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i; // Subtract lowest set bit
    }

    this.stats.queries++;
    return sum;
  }

  // Range sum [l, r]
  rangeSum(l, r) {
    if (l === 0) return this.prefixSum(r);
    return this.prefixSum(r) - this.prefixSum(l - 1);
  }

  // Get value at index
  get(index) {
    let sum = 0;
    let i = index + 1;
    const start = i;

    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i;
    }

    // Subtree sum
    i = start + (start & -start);
    while (i <= this.n) {
      sum -= this.tree[i];
      i += i & -i;
    }

    return sum;
  }

  // Find index with given prefix sum (lower bound)
  findByPrefix(prefixSum) {
    let idx = 0;
    let bitMask = 1 << Math.floor(Math.log2(this.n + 1));

    while (bitMask > 0) {
      const nextIdx = idx + bitMask;
      if (nextIdx <= this.n && this.tree[nextIdx] < prefixSum) {
        prefixSum -= this.tree[nextIdx];
        idx = nextIdx;
      }
      bitMask >>= 1;
    }

    return idx; // 0-indexed
  }

  // Find k-th smallest element
  findKth(k) {
    return this.findByPrefix(k + 1) - 1;
  }

  // Range update: add value to range [l, r]
  rangeUpdate(l, r, value) {
    this.update(l, value);
    this.update(r + 1, -value);
    this.stats.updates++;
    this._logOperation('rangeUpdate', { l, r, value });
  }

  // Get point value after range updates
  pointQuery(index) {
    return this.prefixSum(index);
  }

  // Build from array in O(n)
  build(array) {
    this.n = array.length;
    this.tree = new Array(this.n + 1).fill(0);
    this.original = [...array];

    for (let i = 0; i < this.n; i++) {
      this.tree[i + 1] += array[i];
      const parent = i + 1 + (i + 1 & -(i + 1));
      if (parent <= this.n) {
        this.tree[parent] += this.tree[i + 1];
      }
    }

    return this;
  }

  // Inverse BIT (for range update, point query)
  static rangeQueryPointUpdate(array) {
    const bit = new BinaryIndexedTree(array.length);
    
    // Build structure for range updates
    for (let i = 0; i < array.length; i++) {
      const diff = array[i] - (i > 0 ? array[i - 1] : 0);
      const nextDiff = (i < array.length - 1 ? array[i + 1] : 0) - array[i];
      bit.tree[i + 1] = diff - nextDiff;
    }

    return bit;
  }

  // Get all values
  toArray() {
    const result = [];
    for (let i = 0; i < this.n; i++) {
      result.push(this.get(i));
    }
    return result;
  }

  // Visualization data
  getTreeStructure() {
    const structure = [];
    let maxLevel = Math.floor(Math.log2(this.n)) + 1;

    for (let i = 1; i <= this.n; i++) {
      const level = Math.floor(Math.log2(i));
      const rangeStart = i - (i & -i) + 1;
      const rangeEnd = i;

      structure.push({
        index: i - 1, // 0-indexed
        value: this.tree[i],
        level,
        range: [rangeStart - 1, rangeEnd - 1],
        size: i & -i
      });
    }

    return structure.sort((a, b) => a.level - b.level || a.index - b.index);
  }

  // Count inversions using BIT
  countInversions(array) {
    const bit = new BinaryIndexedTree(Math.max(...array) + 1);
    let inversions = 0;

    for (let i = array.length - 1; i >= 0; i--) {
      inversions += bit.prefixSum(array[i] - 1);
      bit.update(array[i], 1);
    }

    return inversions;
  }

  // Longest increasing subsequence using BIT
  LIS(array) {
    const maxVal = Math.max(...array);
    const bit = new BinaryIndexedTree(maxVal + 1);
    let lis = 0;

    for (const val of array) {
      const current = bit.rangeSum(0, val) + 1;
      const existing = bit.rangeSum(val, val);
      if (current > existing) {
        bit.update(val, current - existing);
        lis = Math.max(lis, current);
      }
    }

    return lis;
  }

  _logOperation(type, details) {
    this.stats.operations.push({ type, details, timestamp: Date.now() });
  }

  getStats() {
    return {
      size: this.n,
      totalSum: this.prefixSum(this.n - 1),
      ...this.stats,
      operations: this.stats.operations.slice(-20)
    };
  }

  clear() {
    this.tree.fill(0);
    this.original = [];
    this.n = 0;
    this.stats = { updates: 0, queries: 0, operations: [] };
  }
}

// 2D Binary Indexed Tree
class BIT2D {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.tree = Array.from({ length: rows + 1 }, () => 
      Array.from({ length: cols + 1 }, () => 0)
    );
    this.stats = { updates: 0, queries: 0 };
  }

  update(row, col, delta) {
    for (let i = row + 1; i <= this.rows; i += i & -i) {
      for (let j = col + 1; j <= this.cols; j += j & -j) {
        this.tree[i][j] += delta;
      }
    }
    this.stats.updates++;
  }

  query(row, col) {
    let sum = 0;
    for (let i = row + 1; i > 0; i -= i & -i) {
      for (let j = col + 1; j > 0; j -= j & -j) {
        sum += this.tree[i][j];
      }
    }
    this.stats.queries++;
    return sum;
  }

  rangeQuery(row1, col1, row2, col2) {
    return (
      this.query(row2, col2) -
      this.query(row1 - 1, col2) -
      this.query(row2, col1 - 1) +
      this.query(row1 - 1, col1 - 1)
    );
  }

  getStats() {
    return { ...this.stats, rows: this.rows, cols: this.cols };
  }
}

module.exports = { BinaryIndexedTree, BIT2D };
