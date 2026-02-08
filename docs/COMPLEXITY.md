# Complexity Analysis

## Table of Contents
1. [Time Complexity Overview](#time-complexity-overview)
2. [Space Complexity](#space-complexity)
3. [Data Structure Comparison](#data-structure-comparison)
4. [Algorithm Complexity](#algorithm-complexity)
5. [Big O Notation Guide](#big-o-notation-guide)


## Time Complexity Overview

### Common Operations

| Notation | Name | Description | Example |
|----------|------|-------------|---------|
| O(1) | Constant | Always takes same time | Array access |
| O(log n) | Logarithmic | Doubling data = +1 step | Binary search |
| O(n) | Linear | Doubling data = 2x time | Linear search |
| O(n log n) | Linearithmic | Doubling data = 2x + small | Merge sort |
| O(n²) | Quadratic | Doubling data = 4x time | Bubble sort |
| O(2ⁿ) | Exponential | Doubling data = 2^(2x) | Fibonacci recursive |
| O(n!) | Factorial | Doubling data = (2n)! | Traveling salesman |

### Visual Complexity Chart

```
O(1)      │████████████████████████████████
O(log n)  │███████████████████████████████
O(n)      │█████████████████████
O(n log n)│██████████████████
O(n²)     │████████
O(2ⁿ)     │████
O(n!)     │█
          └─────────────────────────────────
          1    10    100   1000  10000  N
```


## Space Complexity

### Memory Usage by Data Structure

| Data Structure | Space Complexity | Notes |
|----------------|------------------|-------|
| Array | O(n) | Linear space |
| Linked List | O(n) | + overhead per node |
| Stack | O(n) | Linear |
| Queue | O(n) | Linear |
| Hash Table | O(n) | Linear |
| Tree | O(n) | Linear |
| Graph (Adjacency Matrix) | O(V²) | V = vertices |
| Graph (Adjacency List) | O(V + E) | V = vertices, E = edges |


## Data Structure Comparison

### Arrays vs Linked Lists

| Operation | Array | Linked List |
|-----------|-------|-------------|
| Access | O(1) | O(n) |
| Search | O(n) | O(n) |
| Insert at end | O(1)* | O(1)** |
| Insert at beginning | O(n) | O(1) |
| Delete at beginning | O(n) | O(1) |
| Delete at end | O(1)* | O(n) |
| Memory | Contiguous | Scattered |

*Amortized for dynamic arrays
**O(1) with tail pointer

### Trees Comparison

| Tree Type | Search | Insert | Delete | Space |
|-----------|--------|--------|--------|-------|
| Binary Search Tree | O(log n)* | O(log n)* | O(log n)* | O(n) |
| AVL Tree | O(log n) | O(log n) | O(log n) | O(n) |
| Red-Black Tree | O(log n) | O(log n) | O(log n) | O(n) |
| B-Tree | O(log n) | O(log n) | O(log n) | O(n) |
| Trie | O(m) | O(m) | O(m) | O(m × n) |

*m = key length, n = nodes

### Hash Table vs Tree

| Operation | Hash Table | BST |
|-----------|------------|-----|
| Search | O(1)* | O(log n) |
| Insert | O(1)* | O(log n) |
| Delete | O(1)* | O(log n) |
| Sorted iteration | No | Yes |
| Memory | O(n) | O(n) |
| Collision handling | Yes | N/A |

*Amortized, with good hash function


## Algorithm Complexity

### Sorting Algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | No |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n)* | No |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| Radix Sort | O(nk) | O(nk) | O(nk) | O(n + k) | No |
| Bucket Sort | O(n + k) | O(n + k) | O(n²) | O(n + k) | Yes |

*Recursion stack

### Search Algorithms

| Algorithm | Best | Average | Worst | Space | Pre-sorted |
|-----------|------|---------|-------|-------|------------|
| Linear Search | O(1) | O(n) | O(n) | O(1) | No |
| Binary Search | O(1) | O(log n) | O(log n) | O(1) | Yes |
| Interpolation Search | O(1) | O(log log n)* | O(n) | O(1) | Yes |
| Exponential Search | O(1) | O(log n) | O(log n) | O(1) | Yes |

*Uniform distribution

### Graph Algorithms

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| BFS | O(V + E) | O(V) | Shortest path (unweighted) |
| DFS | O(V + E) | O(V) | Cycle detection, topology |
| Dijkstra | O((V + E) log V) | O(V) | Shortest path (weighted) |
| Bellman-Ford | O(VE) | O(V) | Negative weights |
| Floyd-Warshall | O(V³) | O(V²) | All pairs shortest |
| A* | O(E) | O(V) | Heuristic pathfinding |
| Kruskal's MST | O(E log E) | O(V) | Minimum spanning tree |
| Prim's MST | O((V + E) log V) | O(V) | Minimum spanning tree |

### Dynamic Programming

| Problem | Time | Space | Optimization |
|---------|------|-------|--------------|
| Fibonacci (naive) | O(2ⁿ) | O(n) | Recursion |
| Fibonacci (memo) | O(n) | O(n) | Top-down |
| Fibonacci (iterative) | O(n) | O(1) | Bottom-up |
| Knapsack (naive) | O(2ⁿ) | O(n) | - |
| Knapsack (DP) | O(nW) | O(W) | - |
| Longest Common Subseq | O(mn) | O(mn) | - |
| Edit Distance | O(mn) | O(min(m,n)) | - |


## Big O Notation Guide

### Quick Reference

```
Best ────────────── Worst
 │    │     │     │     │
O(1) O(log n) O(n) O(n²) O(2ⁿ)
 │    │     │     │     │
Constants Logarithmic Linear Quadratic Exponential
```

### Practical Examples

#### O(1) - Constant Time
```javascript
// Always 1 operation
const first = arr[0];
const count = arr.length;
```

#### O(log n) - Logarithmic Time
```javascript
// Binary search
while (low <= high) {
  mid = (low + high) / 2;
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) low = mid + 1;
  else high = mid - 1;
}
```

#### O(n) - Linear Time
```javascript
// Find maximum
let max = arr[0];
for (let i = 1; i < arr.length; i++) {
  if (arr[i] > max) max = arr[i];
}
```

#### O(n log n) - Linearithmic Time
```javascript
// Merge sort
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}
```

#### O(n²) - Quadratic Time
```javascript
// Bubble sort
for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr.length - i - 1; j++) {
    if (arr[j] > arr[j + 1]) {
      [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
}
```


## Amortized Analysis

### Dynamic Array Growth

When a dynamic array doubles in size:

| Operation | Cost | Cumulative (n insertions) |
|-----------|------|---------------------------|
| Insert 1 | 1 | 1 |
| Insert 2 | 2 | 3 |
| Insert 3 | 4 | 7 |
| Insert 4 | 1 | 8 |
| ... | ... | ... |
| Insert n | 2 | 3n - 4 |

**Amortized Cost:** O(1) per operation

### Queue with Two Stacks

| Operation | Time |
|-----------|------|
| enqueue | O(1) amortized |
| dequeue | O(1) amortized |


## Space-Time Tradeoffs

### Precomputation vs On-Demand

| Approach | Time | Space | Example |
|----------|------|-------|---------|
| Precompute | O(1) query | O(n) | Lookup table |
| Compute on demand | O(n) query | O(1) | Calculation |
| Memoization | O(n) total* | O(n) | Cached results |

*For recursive problems

### Compression

| Format | Compression Time | Query Time |
|--------|-----------------|------------|
| Raw | O(1) | O(1) |
| Compressed | O(n) to compress | O(log n) to query |


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