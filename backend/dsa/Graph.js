/**
 * Graph Implementation with BFS, DFS, Dijkstra, A*, and more
 * Real-world: Social networks, GPS/navigation, recommendation systems
 */

class GraphNode {
  constructor(value) {
    this.value = value;
    this.adjacencies = new Map(); // neighbor -> weight
    this.metadata = {};
  }
}

class Graph {
  constructor(isDirected = false, isWeighted = false) {
    this.nodes = new Map(); // value -> node
    this.isDirected = isDirected;
    this.isWeighted = isWeighted;
    this.edgeCount = 0;
    this.stats = {
      bfsCalls: 0,
      dfsCalls: 0,
      dijkstraCalls: 0,
      operations: []
    };
  }

  addNode(value, metadata = {}) {
    if (!this.nodes.has(value)) {
      const node = new GraphNode(value);
      node.metadata = metadata;
      this.nodes.set(value, node);
      this._logOperation('addNode', { value, metadata });
    }
    return this.nodes.get(value);
  }

  addEdge(source, target, weight = 1) {
    const sourceNode = this.addNode(source);
    const targetNode = this.addNode(target);

    sourceNode.adjacencies.set(target, weight);
    this.edgeCount++;

    if (!this.isDirected) {
      targetNode.adjacencies.set(source, weight);
      this.edgeCount++;
    }

    this._logOperation('addEdge', { source, target, weight });
    return this;
  }

  // Breadth-First Search - Shortest path in unweighted graphs
  bfs(startValue, targetValue = null) {
    this.stats.bfsCalls++;
    const visited = new Set();
    const queue = [[startValue, [startValue]]]; // [current, path]
    visited.add(startValue);

    const traversalOrder = [];

    while (queue.length > 0) {
      const [current, path] = queue.shift();
      traversalOrder.push(current);

      if (current === targetValue) {
        this._logOperation('bfs', { start: startValue, target: targetValue, found: true, steps: traversalOrder.length });
        return { found: true, path, traversalOrder };
      }

      const node = this.nodes.get(current);
      for (const neighbor of node.adjacencies.keys()) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }

    this._logOperation('bfs', { start: startValue, target: targetValue, found: false, steps: traversalOrder.length });
    return { found: false, path: null, traversalOrder };
  }

  // Depth-First Search - Cycle detection, topological sort
  dfs(startValue, targetValue = null, visited = new Set()) {
    visited.add(startValue);
    const path = [startValue];

    if (startValue === targetValue) {
      return { found: true, path, visited: Array.from(visited) };
    }

    const node = this.nodes.get(startValue);
    for (const neighbor of node.adjacencies.keys()) {
      if (!visited.has(neighbor)) {
        const result = this.dfs(neighbor, targetValue, visited);
        if (result.found) {
          return { found: true, path: path.concat(result.path.slice(1)), visited: Array.from(visited) };
        }
      }
    }

    return { found: false, path: null, visited: Array.from(visited) };
  }

  // Dijkstra's Algorithm - Shortest path in weighted graphs
  dijkstra(startValue, targetValue) {
    this.stats.dijkstraCalls++;
    const distances = new Map();
    const previous = new Map();
    const pq = new PriorityQueue(); // Min-heap

    for (const node of this.nodes.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }

    distances.set(startValue, 0);
    pq.enqueue({ node: startValue, distance: 0 });

    const relaxationOrder = [];

    while (!pq.isEmpty()) {
      const { node: current, distance } = pq.dequeue();

      if (current === targetValue) {
        // Reconstruct path
        const path = [];
        let curr = targetValue;
        while (curr !== null) {
          path.unshift(curr);
          curr = previous.get(curr);
        }

        this._logOperation('dijkstra', {
          start: startValue,
          target: targetValue,
          distance,
          path,
          relaxationOrder
        });

        return {
          distance,
          path,
          relaxationOrder,
          visited: Array.from(distances.keys()).filter(n => distances.get(n) !== Infinity)
        };
      }

      if (distance > distances.get(current)) continue;

      const node = this.nodes.get(current);
      for (const [neighbor, weight] of node.adjacencies) {
        relaxationOrder.push({ from: current, to: neighbor, currentDist: distance, newDist: distance + weight });
        
        const newDist = distance + weight;
        if (newDist < distances.get(neighbor)) {
          distances.set(neighbor, newDist);
          previous.set(neighbor, current);
          pq.enqueue({ node: neighbor, distance: newDist });
        }
      }
    }

    return { distance: Infinity, path: null, relaxationOrder, visited: [] };
  }

  // Detect cycles in directed graph
  detectCycles() {
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map();
    const cycles = [];

    for (const node of this.nodes.keys()) {
      color.set(node, WHITE);
    }

    const dfsCycle = (node, path = []) => {
      color.set(node, GRAY);
      path.push(node);

      const currentNode = this.nodes.get(node);
      for (const neighbor of currentNode.adjacencies.keys()) {
        if (color.get(neighbor) === GRAY) {
          const cycleStart = path.indexOf(neighbor);
          cycles.push(path.slice(cycleStart));
        } else if (color.get(neighbor) === WHITE) {
          const result = dfsCycle(neighbor, [...path]);
          if (result) return result;
        }
      }

      color.set(node, BLACK);
      return null;
    };

    for (const node of this.nodes.keys()) {
      if (color.get(node) === WHITE) {
        dfsCycle(node);
      }
    }

    return { hasCycle: cycles.length > 0, cycles };
  }

  // Topological Sort (Kahn's Algorithm)
  topologicalSort() {
    const inDegree = new Map();
    const queue = [];

    for (const node of this.nodes.keys()) {
      inDegree.set(node, 0);
    }

    // Calculate in-degrees
    for (const [, node] of this.nodes) {
      for (const neighbor of node.adjacencies.keys()) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
      }
    }

    // Initialize queue with zero in-degree nodes
    for (const [node, degree] of inDegree) {
      if (degree === 0) queue.push(node);
    }

    const result = [];
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node);

      const currentNode = this.nodes.get(node);
      for (const neighbor of currentNode.adjacencies.keys()) {
        inDegree.set(neighbor, inDegree.get(neighbor) - 1);
        if (inDegree.get(neighbor) === 0) {
          queue.push(neighbor);
        }
      }
    }

    return result.length === this.nodes.size ? result : null; // null if cycle exists
  }

  // Connected Components
  getConnectedComponents() {
    const visited = new Set();
    const components = [];

    for (const node of this.nodes.keys()) {
      if (!visited.has(node)) {
        const component = [];
        const stack = [node];
        visited.add(node);

        while (stack.length > 0) {
          const current = stack.pop();
          component.push(current);

          const nodeObj = this.nodes.get(current);
          for (const neighbor of nodeObj.adjacencies.keys()) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              stack.push(neighbor);
            }
          }
        }

        components.push(component);
      }
    }

    return components;
  }

  // PageRank Algorithm
  pageRank(iterations = 100, damping = 0.85) {
    const ranks = new Map();
    const N = this.nodes.size;

    // Initialize ranks
    for (const node of this.nodes.keys()) {
      ranks.set(node, 1 / N);
    }

    const nodesArray = Array.from(this.nodes.keys());

    for (let i = 0; i < iterations; i++) {
      const newRanks = new Map();

      for (const node of nodesArray) {
        let sum = 0;
        const nodeObj = this.nodes.get(node);

        // Find nodes that point to this node
        for (const [otherNode, otherNodeObj] of this.nodes) {
          if (otherNodeObj.adjacencies.has(node)) {
            const outDegree = otherNodeObj.adjacencies.size;
            sum += ranks.get(otherNode) / outDegree;
          }
        }

        newRanks.set(node, (1 - damping) / N + damping * sum);
      }

      for (const node of nodesArray) {
        ranks.set(node, newRanks.get(node));
      }
    }

    return Array.from(ranks.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([node, rank]) => ({ node, rank: rank.toFixed(6) }));
  }

  getStats() {
    return {
      nodeCount: this.nodes.size,
      edgeCount: this.edgeCount,
      ...this.stats,
      operations: this.stats.operations.slice(-20)
    };
  }

  _logOperation(type, details) {
    this.stats.operations.push({ type, details, timestamp: Date.now() });
  }

  clear() {
    this.nodes.clear();
    this.edgeCount = 0;
    this.stats = { bfsCalls: 0, dfsCalls: 0, dijkstraCalls: 0, operations: [] };
  }
}

// Priority Queue for Dijkstra
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
    this.items.sort((a, b) => a.distance - b.distance);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = { Graph, GraphNode };
