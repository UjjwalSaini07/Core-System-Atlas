/**
 * Union-Find (Disjoint Set) Implementation
 * Real-world: Kruskal's MST, network connectivity, image processing, social networks
 */

class UnionFind {
  constructor(size = 0) {
    this.parent = [];
    this.rank = [];
    this.size = [];
    this.stats = {
      unions: 0,
      finds: 0,
      operations: []
    };

    if (size > 0) {
      this.initialize(size);
    }
  }

  initialize(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    this.size = new Array(n).fill(1);
    return this;
  }

  // Find with path compression
  find(x) {
    this.stats.finds++;
    
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // Path compression
    }

    this._logOperation('find', { x, root: this.parent[x] });
    return this.parent[x];
  }

  // Union by rank
  union(x, y) {
    this.stats.unions++;
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      this._logOperation('union', { x, y, result: 'already_connected' });
      return false;
    }

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
      this.rank[rootX]++;
    }

    this._logOperation('union', { x, y, result: 'merged', newRoot: this.find(x) });
    return true;
  }

  // Union by size (alternative)
  unionBySize(x, y) {
    this.stats.unions++;
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.size[rootX] < this.size[rootY]) {
      this.parent[rootX] = rootY;
      this.size[rootY] += this.size[rootX];
    } else {
      this.parent[rootY] = rootX;
      this.size[rootX] += this.size[rootY];
    }

    return true;
  }

  // Check if two elements are connected
  connected(x, y) {
    const result = this.find(x) === this.find(y);
    this._logOperation('connected', { x, y, result });
    return result;
  }

  // Get size of set containing x
  getSize(x) {
    return this.size[this.find(x)];
  }

  // Get all sets (for visualization)
  getSets() {
    const sets = new Map();

    for (let i = 0; i < this.parent.length; i++) {
      const root = this.find(i);
      if (!sets.has(root)) {
        sets.set(root, []);
      }
      sets.get(root).push(i);
    }

    return Array.from(sets.entries()).map(([root, members]) => ({
      root,
      members,
      size: members.length
    }));
  }

  // Count number of sets
  countSets() {
    const roots = new Set();
    for (let i = 0; i < this.parent.length; i++) {
      roots.add(this.find(i));
    }
    return roots.size;
  }

  // Get component tree structure for visualization
  getComponentTree() {
    const tree = [];

    for (let i = 0; i < this.parent.length; i++) {
      if (this.parent[i] === i) {
        tree.push({
          id: i,
          children: this._getChildren(i),
          size: this.size[i],
          rank: this.rank[i]
        });
      }
    }

    return tree;
  }

  _getChildren(nodeId) {
    const children = [];
    for (let i = 0; i < this.parent.length; i++) {
      if (this.parent[i] === nodeId && i !== nodeId) {
        children.push({ id: i, children: this._getChildren(i) });
      }
    }
    return children;
  }

  // Kruskal's Algorithm for Minimum Spanning Tree
  kruskalMST(edges) {
    // edges: [{u, v, weight}, ...]
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const mst = [];
    let totalWeight = 0;

    this.initialize(Math.max(...edges.flatMap(e => [e.u, e.v])) + 1);

    for (const edge of sortedEdges) {
      if (this.find(edge.u) !== this.find(edge.v)) {
        this.union(edge.u, edge.v);
        mst.push(edge);
        totalWeight += edge.weight;
      }
    }

    return { mst, totalWeight };
  }

  // Get operation history
  getStats() {
    return {
      elements: this.parent.length,
      sets: this.countSets(),
      ...this.stats,
      operations: this.stats.operations.slice(-30)
    };
  }

  _logOperation(type, details) {
    this.stats.operations.push({ type, details, timestamp: Date.now() });
  }

  clear() {
    this.parent = [];
    this.rank = [];
    this.size = [];
    this.stats = { unions: 0, finds: 0, operations: [] };
  }
}

// Weighted Union-Find with additional metadata
class WeightedUnionFind {
  constructor(size = 0) {
    this.parent = [];
    this.weight = []; // Weight to parent
    this.value = []; // Actual value at node
    this.stats = { operations: 0 };

    if (size > 0) {
      this.initialize(size);
    }
  }

  initialize(n, defaultValue = 0) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.weight = new Array(n).fill(0);
    this.value = new Array(n).fill(defaultValue);
    return this;
  }

  // Weighted find with path compression
  find(x) {
    if (this.parent[x] !== x) {
      const originalParent = this.parent[x];
      this.parent[x] = this.find(this.parent[x]);
      this.weight[x] += weight[originalParent]; // Accumulate weight
    }
    return this.parent[x];
  }

  // Union with weight difference
  union(x, y, diff) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    // Weight diff is the difference between x and y
    // value[x] - value[y] = diff
    // We need to set weight so this holds

    this.parent[rootY] = rootX;
    this.weight[rootY] = diff;

    this.stats.operations++;
    return true;
  }

  // Get difference between x and root
  weightToRoot(x) {
    this.find(x);
    return this.weight[x];
  }

  // Get difference between x and y
  difference(x, y) {
    return this.weightToRoot(x) - this.weightToRoot(y);
  }

  getStats() {
    return { ...this.stats, elements: this.parent.length };
  }
}

// Union-Find with rollback (for offline queries)
class RollbackUnionFind {
  constructor(size) {
    this.parent = [];
    this.rank = [];
    this.history = [];
    this.stats = { rollbacks: 0, operations: 0 };

    this.initialize(size);
  }

  initialize(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.rank = new Array(n).fill(0);
    return this;
  }

  find(x) {
    if (this.parent[x] !== x) {
      return this.find(this.parent[x]);
    }
    return x;
  }

  union(x, y) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      this.history.push({ type: 'skip' });
      return false;
    }

    // Save state for rollback
    this.history.push({
      type: 'union',
      data: {
        rootX: this.parent[rootX],
        rootY: this.parent[rootY],
        rankX: this.rank[rootX],
        rankY: this.rank[rootY]
      }
    });

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    this.stats.operations++;
    return true;
  }

  // Rollback last operation
  rollback() {
    if (this.history.length === 0) return false;

    const action = this.history.pop();
    this.stats.rollbacks++;

    if (action.type === 'skip') return true;

    // Restore state
    this.parent[action.data.rootX] = action.data.rootX;
    this.parent[action.data.rootY] = action.data.rootY;
    this.rank[action.data.rootX] = action.data.rankX;
    this.rank[action.data.rootY] = action.data.rankY;

    return true;
  }

  // Author: UjjwalS, AuthorUrl: https://ujjwalsaini.vercel.app/
  // Get to specific history point
  snapshot() {
    return this.history.length;
  }

  restore(snapshot) {
    while (this.history.length > snapshot) {
      this.rollback();
    }
  }

  getStats() {
    return { ...this.stats, historySize: this.history.length };
  }
}

module.exports = { UnionFind, WeightedUnionFind, RollbackUnionFind };
