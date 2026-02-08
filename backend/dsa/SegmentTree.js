/**
 * Segment Tree Implementation
 * Real-world: Range queries, range updates, RMQ, interval queries
 */

class SegmentTree {
  constructor(array, operation = 'sum') {
    this.array = array;
    this.operation = operation;
    this.tree = [];
    this.n = array.length;
    this.build();
    this.stats = {
      queries: 0,
      updates: 0,
      operations: []
    };
  }

  // Build segment tree
  build() {
    this.tree = new Array(4 * this.n);
    this._buildRec(0, 0, this.n - 1);
  }

  _buildRec(node, start, end) {
    if (start === end) {
      this.tree[node] = this.array[start];
      return;
    }

    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    this._buildRec(leftChild, start, mid);
    this._buildRec(rightChild, mid + 1, end);
    this.tree[node] = this._applyOperation(this.tree[leftChild], this.tree[rightChild]);
  }

  // Query range [l, r]
  query(l, r) {
    return this._queryRec(0, 0, this.n - 1, l, r);
  }

  _queryRec(node, start, end, l, r) {
    // No overlap
    if (r < start || end < l) {
      return this._getNeutralElement();
    }

    // Total overlap
    if (l <= start && end <= r) {
      return this.tree[node];
    }

    // Partial overlap
    const mid = Math.floor((start + end) / 2);
    const leftResult = this._queryRec(2 * node + 1, start, mid, l, r);
    const rightResult = this._queryRec(2 * node + 2, mid + 1, end, l, r);
    const result = this._applyOperation(leftResult, rightResult);

    this.stats.queries++;
    this._logOperation('query', { l, r, result, node, range: [start, end] });

    return result;
  }

  // Point update
  update(index, value) {
    this._updateRec(0, 0, this.n - 1, index, value);
    this.stats.updates++;
    this._logOperation('update', { index, value });
  }

  _updateRec(node, start, end, index, value) {
    if (start === end) {
      this.tree[node] = value;
      this.array[index] = value;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    if (index <= mid) {
      this._updateRec(2 * node + 1, start, mid, index, value);
    } else {
      this._updateRec(2 * node + 2, mid + 1, end, index, value);
    }

    this.tree[node] = this._applyOperation(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  // Range update (add value to range)
  rangeAdd(l, r, value) {
    this._rangeAddRec(0, 0, this.n - 1, l, r, value);
    this.stats.updates++;
    this._logOperation('rangeAdd', { l, r, value });
  }

  _rangeAddRec(node, start, end, l, r, value) {
    if (r < start || end < l) return;

    if (l <= start && end <= r) {
      this.tree[node] += value;
      return;
    }

    const mid = Math.floor((start + end) / 2);
    this._rangeAddRec(2 * node + 1, start, mid, l, r, value);
    this._rangeAddRec(2 * node + 2, mid + 1, end, l, r, value);
    this.tree[node] = this._applyOperation(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  // Find first index where prefix sum >= value
  findFirst(prefixSum) {
    return this._findFirstRec(0, 0, this.n - 1, prefixSum);
  }

  _findFirstRec(node, start, end, prefixSum) {
    if (start === end) {
      return start >= prefixSum ? start : -1;
    }

    const leftSum = this.tree[2 * node + 1];
    if (leftSum >= prefixSum) {
      return this._findFirstRec(2 * node + 1, start, Math.floor((start + end) / 2), prefixSum);
    }

    return this._findFirstRec(
      2 * node + 2,
      Math.floor((start + end) / 2) + 1,
      end,
      prefixSum - leftSum
    );
  }

  // Count elements in range [l, r] that are <= value
  countLE(l, r, value) {
    return this._countLERec(0, 0, this.n - 1, l, r, value);
  }

  _countLERec(node, start, end, l, r, value) {
    if (r < start || end < l) return 0;

    if (l <= start && end <= r) {
      return this.tree[node] <= value ? (end - start + 1) : 0;
    }

    const mid = Math.floor((start + end) / 2);
    return (
      this._countLERec(2 * node + 1, start, mid, l, r, value) +
      this._countLERec(2 * node + 2, mid + 1, end, l, r, value)
    );
  }

  // Get minimum in range
  rangeMin(l, r) {
    const originalOp = this.operation;
    this.operation = 'min';
    const result = this.query(l, r);
    this.operation = originalOp;
    return result;
  }

  // Get maximum in range
  rangeMax(l, r) {
    const originalOp = this.operation;
    this.operation = 'max';
    const result = this.query(l, r);
    this.operation = originalOp;
    return result;
  }

  // Get all tree nodes for visualization
  getTreeStructure() {
    const structure = [];
    this._collectNodes(0, 0, this.n - 1, structure);
    return structure;
  }

  _collectNodes(node, start, end, structure) {
    structure.push({
      node,
      value: this.tree[node],
      range: [start, end],
      isLeaf: start === end
    });

    if (start !== end) {
      const mid = Math.floor((start + end) / 2);
      this._collectNodes(2 * node + 1, start, mid, structure);
      this._collectNodes(2 * node + 2, mid + 1, end, structure);
    }
  }

  _applyOperation(a, b) {
    switch (this.operation) {
      case 'sum': return a + b;
      case 'min': return Math.min(a, b);
      case 'max': return Math.max(a, b);
      case 'product': return a * b;
      case 'gcd': return this._gcd(Math.abs(a), Math.abs(b));
      case 'lcm': return (a * b) / this._gcd(Math.abs(a), Math.abs(b));
      default: return a + b;
    }
  }

  _getNeutralElement() {
    switch (this.operation) {
      case 'sum': return 0;
      case 'min': return Infinity;
      case 'max': return -Infinity;
      case 'product': return 1;
      case 'gcd': return 0;
      case 'lcm': return 1;
      default: return 0;
    }
  }

  _gcd(a, b) {
    if (b === 0) return a;
    return this._gcd(b, a % b);
  }

  _logOperation(type, details) {
    this.stats.operations.push({ type, details, timestamp: Date.now() });
  }

  getStats() {
    return {
      size: this.n,
      treeSize: this.tree.length,
      operation: this.operation,
      ...this.stats,
      operations: this.stats.operations.slice(-20)
    };
  }

  clear() {
    this.array = [];
    this.tree = [];
    this.n = 0;
    this.stats = { queries: 0, updates: 0, operations: [] };
  }
}

// Sparse Segment Tree for large ranges
class SparseSegmentTree {
  constructor() {
    this.tree = new Map();
    this.stats = { queries: 0, updates: 0, nodesCreated: 0 };
  }

  _buildNode(node, start, end, values) {
    const mid = Math.floor((start + end) / 2);

    if (start === end) {
      this.tree.set(node, values[start] || 0);
      this.stats.nodesCreated++;
      return;
    }

    this._buildNode(node * 2 + 1, start, mid, values);
    this._buildNode(node * 2 + 2, mid + 1, end, values);
    this.tree.set(node, this.tree.get(node * 2 + 1) + this.tree.get(node * 2 + 2));
    this.stats.nodesCreated++;
  }

  build(values) {
    this.tree.clear();
    this._buildNode(0, 0, values.length - 1, values);
    return this;
  }

  query(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree.get(node) || 0;

    const mid = Math.floor((start + end) / 2);
    return (
      this.query(node * 2 + 1, start, mid, l, r) +
      this.query(node * 2 + 2, mid + 1, end, l, r)
    );
  }

  update(node, start, end, index, value) {
    if (start === end) {
      this.tree.set(node, value);
      return;
    }

    const mid = Math.floor((start + end) / 2);
    if (index <= mid) {
      this.update(node * 2 + 1, start, mid, index, value);
    } else {
      this.update(node * 2 + 2, mid + 1, end, index, value);
    }

    const left = this.tree.get(node * 2 + 1) || 0;
    const right = this.tree.get(node * 2 + 2) || 0;
    this.tree.set(node, left + right);
  }

  getStats() {
    return { ...this.stats, treeSize: this.tree.size };
  }
}

module.exports = { SegmentTree, SparseSegmentTree };
