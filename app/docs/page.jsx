'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Code, Copy, Check, Play, Pause, ChevronRight, Layers, Zap, Shield, Network, Database, Lock, Search, RefreshCw, Globe, Cpu, HardDrive, TrendingUp, Activity, Eye, Target, Lightbulb, AlertCircle, CheckCircle, Clock, Brain, TreeDeciduous, GitBranch, Hash, List, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// ==================== DATA STRUCTURES ====================
const DATA_STRUCTURES = {
  // Linear Data Structures
  array: {
    name: 'Array',
    icon: List,
    category: 'linear',
    description: 'Contiguous memory locations storing elements of the same type.',
    timeComplexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Fast random access', 'Cache-friendly', 'Simple implementation'],
    weaknesses: ['Fixed size', 'Slow insert/delete', 'Shifting required'],
    useCases: ['Lookup tables', 'Buffer operations', 'Matrix operations'],
    visualization: { type: 'linear', values: [23, 45, 12, 67, 89, 34, 56] }
  },
  linkedlist: {
    name: 'Linked List',
    icon: List,
    category: 'linear',
    description: 'Sequential nodes where each node contains data and a reference to the next node.',
    timeComplexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    spaceComplexity: 'O(n)',
    strengths: ['Dynamic size', 'Fast insert/delete', 'No shifting'],
    weaknesses: ['No random access', 'Memory overhead', 'Poor cache locality'],
    useCases: ['Undo functionality', 'Music playlists', 'Symbol tables'],
    visualization: { type: 'linked', values: [23, 45, 12, 67, 89] }
  },
  stack: {
    name: 'Stack',
    icon: Layers,
    category: 'linear',
    description: 'LIFO (Last In First Out) data structure where elements are added and removed from the top.',
    timeComplexity: { push: 'O(1)', pop: 'O(1)', peek: 'O(1)', search: 'O(n)' },
    spaceComplexity: 'O(n)',
    strengths: ['LIFO order', 'Fast operations', 'Simple to implement'],
    weaknesses: ['Limited access', 'No random access'],
    useCases: ['Function call stack', 'Undo/Redo', 'Expression evaluation', 'Backtracking'],
    visualization: { type: 'stack', values: [10, 20, 30, 40, 50] }
  },
  queue: {
    name: 'Queue',
    icon: Layers,
    category: 'linear',
    description: 'FIFO (First In First Out) data structure where elements are added at the rear and removed from the front.',
    timeComplexity: { enqueue: 'O(1)', dequeue: 'O(1)', peek: 'O(1)', search: 'O(n)' },
    spaceComplexity: 'O(n)',
    strengths: ['FIFO order', 'Fair processing', 'Bounded waiting'],
    weaknesses: ['No random access', 'Limited to FIFO'],
    useCases: ['Task scheduling', 'Breadth-first search', 'Print job handling', 'Message queues'],
    visualization: { type: 'queue', values: [10, 20, 30, 40, 50] }
  },
  
  // Hash-based Data Structures
  hashtable: {
    name: 'Hash Table',
    icon: Hash,
    category: 'hash',
    description: 'Maps keys to values using a hash function for fast O(1) average access.',
    timeComplexity: { access: 'O(1) avg', search: 'O(1) avg', insert: 'O(1) avg', delete: 'O(1) avg' },
    spaceComplexity: 'O(n)',
    strengths: ['Fast average access', 'Flexible keys', 'Efficient lookups'],
    weaknesses: ['No ordering', 'Hash collisions', 'Worst case O(n)'],
    useCases: ['Database indexing', 'Caching', 'Memory tables', 'Deduplication'],
    visualization: { type: 'hash', buckets: 8, values: [{k: 'name', v: 'Ujjwal'}, {k: 'age', v: 25}, {k: 'city', v: 'NYC'}] }
  },
  lrucache: {
    name: 'LRU Cache',
    icon: RefreshCw,
    category: 'cache',
    description: 'Least Recently Used cache that evicts the least recently accessed items when full.',
    timeComplexity: { get: 'O(1)', set: 'O(1)' },
    spaceComplexity: 'O(capacity)',
    strengths: ['O(1) operations', 'Memory efficient', 'Automatic eviction'],
    weaknesses: ['Fixed capacity', 'Memory overhead'],
    useCases: ['Web caching', 'Database cache', 'API response cache', 'Browser history'],
    visualization: { type: 'lru', capacity: 5, order: ['A', 'B', 'C', 'D', 'E'] }
  },
  
  // Tree Data Structures
  binarysearchtree: {
    name: 'Binary Search Tree',
    icon: TreeDeciduous,
    category: 'tree',
    description: 'Binary tree where left child < parent < right child, enabling O(log n) searches.',
    timeComplexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Sorted data', 'Efficient search', 'Range queries'],
    weaknesses: ['Can degenerate', 'No cache locality'],
    useCases: ['Database indexing', 'Sorted collections', 'Range queries', 'Sets/Maps'],
    visualization: { type: 'bst', root: 50, structure: { left: 25, right: 75, leftLeft: 15, leftRight: 35, rightLeft: 60, rightRight: 90 } }
  },
  avltree: {
    name: 'AVL Tree',
    icon: TreeDeciduous,
    category: 'tree',
    description: 'Self-balancing BST with height difference ≤1 between subtrees. Rotations maintain balance.',
    timeComplexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Guaranteed balance', 'O(log n) worst', 'Fast search'],
    weaknesses: ['Complex rotations', 'Extra memory for height'],
    useCases: ['Database indexing', 'In-memory databases', 'Real-time systems', 'Financial applications'],
    visualization: { type: 'avl', balance: true, height: 3, nodes: 7 }
  },
  btree: {
    name: 'B-Tree',
    icon: TreeDeciduous,
    category: 'tree',
    description: 'Self-balancing tree optimized for disk storage with multiple keys per node.',
    timeComplexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Disk-optimized', 'High fanout', 'Minimal disk reads'],
    weaknesses: ['Complex implementation', 'Overhead for small data'],
    useCases: ['Database systems', 'File systems', 'Key-value stores', 'Indexing'],
    visualization: { type: 'btree', order: 4, levels: 2, keysPerNode: 3 }
  },
  segmenttree: {
    name: 'Segment Tree',
    icon: TreeDeciduous,
    category: 'tree',
    description: 'Binary tree for storing intervals, enabling range queries and updates in O(log n).',
    timeComplexity: { query: 'O(log n)', update: 'O(log n)', build: 'O(n)' },
    spaceComplexity: 'O(4n)',
    strengths: ['Range queries', 'Range updates', 'Flexible operations'],
    weaknesses: ['4n space', 'Complex implementation'],
    useCases: ['Range sum queries', 'Range minimum/maximum', 'Range updates', 'Sweep line'],
    visualization: { type: 'segment', size: 8, range: [0, 100], query: [2, 6] }
  },
  fenwicktree: {
    name: 'Binary Indexed Tree',
    icon: Layers,
    category: 'tree',
    description: 'Fenwick Tree stores prefix sums enabling O(log n) updates and prefix queries.',
    timeComplexity: { query: 'O(log n)', update: 'O(log n)', build: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Simple implementation', 'Less space', 'Fast prefix sums'],
    weaknesses: ['Only prefix sums', 'Less flexible than segment tree'],
    useCases: ['Prefix sums', 'Frequency arrays', 'Inverse prefix', 'Binary indexed'],
    visualization: { type: 'fenwick', size: 8, values: [1, 3, 5, 7, 9, 11, 13, 15] }
  },
  trie: {
    name: 'Trie',
    icon: Globe,
    category: 'tree',
    description: 'Prefix tree where each node represents a character, enabling fast string operations.',
    timeComplexity: { search: 'O(m)', insert: 'O(m)', delete: 'O(m)' },
    spaceComplexity: 'O(m × n)',
    strengths: ['Fast prefix search', 'Auto-complete', 'String operations'],
    weaknesses: ['Memory intensive', 'Limited alphabet'],
    useCases: ['Auto-complete', 'Spell checking', 'IP routing', 'Word games'],
    visualization: { type: 'trie', words: ['cat', 'car', 'dog', 'dot', 'apple'] }
  },
  
  // Graph Data Structures
  graph: {
    name: 'Graph',
    icon: Network,
    category: 'graph',
    description: 'Non-linear structure with nodes (vertices) connected by edges. Can be directed/undirected.',
    timeComplexity: { addNode: 'O(1)', addEdge: 'O(1)', bfs: 'O(V+E)', dfs: 'O(V+E)' },
    spaceComplexity: 'O(V + E)',
    strengths: ['Relationships', 'Networks', 'Paths'],
    weaknesses: ['No hierarchy', 'Complex traversal'],
    useCases: ['Social networks', 'Route planning', 'Network topology', 'Dependency graphs'],
    visualization: { type: 'graph', nodes: 6, edges: 7, directed: false }
  },
  unionfind: {
    name: 'Union-Find',
    icon: GitBranch,
    category: 'graph',
    description: 'Disjoint Set Union tracks partitions and supports union and find operations.',
    timeComplexity: { find: 'O(α(n))', union: 'O(α(n))' },
    spaceComplexity: 'O(n)',
    strengths: ['Near O(1)', 'Dynamic connectivity', 'Cycle detection'],
    weaknesses: ['No split operation', 'Union only'],
    useCases: ['Kruskal\'s MST', 'Network connectivity', 'Image processing', 'Games'],
    visualization: { type: 'unionfind', sets: 5, operations: 4, connected: true }
  },
  
  // Heap Data Structures
  minheap: {
    name: 'Min Heap',
    icon: Layers,
    category: 'heap',
    description: 'Complete binary tree where parent ≤ children. Root is minimum element.',
    timeComplexity: { insert: 'O(log n)', extractMin: 'O(log n)', peek: 'O(1)' },
    spaceComplexity: 'O(n)',
    strengths: ['Priority access', 'Guaranteed log n', 'Heapify'],
    weaknesses: ['No search', 'Partial order only'],
    useCases: ['Priority queues', 'Dijkstra\'s algorithm', 'Heap sort', 'K largest/smallest'],
    visualization: { type: 'heap', min: true, values: [5, 15, 25, 35, 45, 55, 65] }
  },
  maxheap: {
    name: 'Max Heap',
    icon: Layers,
    category: 'heap',
    description: 'Complete binary tree where parent ≥ children. Root is maximum element.',
    timeComplexity: { insert: 'O(log n)', extractMax: 'O(log n)', peek: 'O(1)' },
    spaceComplexity: 'O(n)',
    strengths: ['Priority access', 'Fast max', 'Heapify'],
    weaknesses: ['No search', 'Partial order only'],
    useCases: ['Priority queues', 'K largest elements', 'Memory management', 'Job scheduling'],
    visualization: { type: 'heap', min: false, values: [65, 45, 55, 25, 35, 15, 5] }
  }
};

// ==================== ALGORITHMS ====================
const ALGORITHMS = {
  // Sorting Algorithms
  bubbleSort: {
    name: 'Bubble Sort',
    icon: RefreshCw,
    category: 'sorting',
    description: 'Repeatedly swaps adjacent elements if they are in wrong order.',
    timeComplexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inplace: true,
    steps: [
      'Compare adjacent elements',
      'Swap if in wrong order',
      'Repeat until sorted',
      'Largest element bubbles to end'
    ],
    whenToUse: ['Small arrays', 'Nearly sorted data', 'Educational purposes'],
    whenNotToUse: ['Large arrays', 'Time-critical applications']
  },
  selectionSort: {
    name: 'Selection Sort',
    icon: RefreshCw,
    category: 'sorting',
    description: 'Finds minimum element and places it at beginning. Repeats for remaining.',
    timeComplexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inplace: true,
    steps: [
      'Find minimum in unsorted portion',
      'Swap with first unsorted element',
      'Repeat for next position',
      'Build sorted array from front'
    ],
    whenToUse: ['Memory constrained', 'Swaps are expensive', 'Small datasets'],
    whenNotToUse: ['Large arrays', 'Stable sort needed']
  },
  insertionSort: {
    name: 'Insertion Sort',
    icon: RefreshCw,
    category: 'sorting',
    description: 'Builds sorted array one element at a time by inserting each in correct position.',
    timeComplexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inplace: true,
    steps: [
      'Take next unsorted element',
      'Compare with sorted elements',
      'Shift larger elements right',
      'Insert in correct position'
    ],
    whenToUse: ['Small arrays', 'Nearly sorted', 'Online sorting', 'Real-time systems'],
    whenNotToUse: ['Large unsorted arrays', 'Multiple insertions']
  },
  mergeSort: {
    name: 'Merge Sort',
    icon: RefreshCw,
    category: 'sorting',
    description: 'Divide and conquer: split array, sort halves, merge sorted halves.',
    timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    inplace: false,
    steps: [
      'Divide array in half',
      'Recursively sort each half',
      'Merge sorted halves',
      'Create merged sorted array'
    ],
    whenToUse: ['Large arrays', 'Stable sort needed', 'Linked lists', 'External sorting'],
    whenNotToUse: ['Memory constrained', 'In-place required']
  },
  quickSort: {
    name: 'Quick Sort',
    icon: RefreshCw,
    category: 'sorting',
    description: 'Pick pivot, partition array around pivot, recursively sort partitions.',
    timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    inplace: true,
    steps: [
      'Choose pivot element',
      'Partition: elements < pivot left, > pivot right',
      'Recursively sort partitions',
      'Combine (no need - in-place)'
    ],
    whenToUse: ['General purpose', 'In-memory sorting', 'Large datasets'],
    whenNotToUse: ['Worst-case critical', 'Stable sort needed', 'Small arrays']
  },
  heapSort: {
    name: 'Heap Sort',
    icon: RefreshCw,
    category: 'sorting',
    description: 'Build max heap, repeatedly extract maximum to sorted position.',
    timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inplace: true,
    steps: [
      'Build max heap from array',
      'Swap root (max) with last element',
      'Reduce heap size by 1',
      'Heapify root, repeat'
    ],
    whenToUse: ['Memory constrained', 'Guaranteed worst-case', 'In-place sorting'],
    whenNotToUse: ['Stable sort needed', 'Partial sorting']
  },
  
  // Searching Algorithms
  binarySearch: {
    name: 'Binary Search',
    icon: Search,
    category: 'searching',
    description: 'Divides sorted array in half each step. O(log n) search.',
    timeComplexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    prerequisites: ['Sorted array', 'Random access'],
    steps: [
      'Find middle element',
      'Compare with target',
      'If less, search left half',
      'If greater, search right half',
      'Repeat until found or exhausted'
    ],
    whenToUse: ['Sorted arrays', 'Large datasets', 'Static data'],
    whenNotToUse: ['Unsorted data', 'Linked lists', 'Frequent insertions']
  },
  bfs: {
    name: 'Breadth-First Search',
    icon: Network,
    category: 'graph',
    description: 'Explores all neighbors at current depth before moving deeper. Uses queue.',
    timeComplexity: { time: 'O(V + E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    useCase: 'Shortest path (unweighted)',
    steps: [
      'Start from source node',
      'Visit all neighbors first',
      'Add neighbors to queue',
      'Mark visited to avoid cycles',
      'Process queue level by level'
    ],
    whenToUse: ['Shortest path (unweighted)', 'Level-order traversal', 'Finding connected components'],
    whenNotToUse: ['Deep graphs', 'Weighted shortest path']
  },
  dfs: {
    name: 'Depth-First Search',
    icon: Network,
    category: 'graph',
    description: 'Explores as far as possible before backtracking. Uses stack/recursion.',
    timeComplexity: { time: 'O(V + E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    useCase: 'Traversal, cycles',
    steps: [
      'Start from source node',
      'Visit deepest path first',
      'Backtrack when dead end',
      'Mark visited to avoid cycles',
      'Continue until all visited'
    ],
    whenToUse: ['Path finding', 'Cycle detection', 'Topological sort', 'Maze solving'],
    whenNotToUse: ['Shortest path', 'Level-order needed']
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    icon: Network,
    category: 'graph',
    description: 'Finds shortest path from source to all nodes in weighted graph with non-negative edges.',
    timeComplexity: { time: 'O(E + V log V)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    useCase: 'Shortest path (weighted)',
    steps: [
      'Initialize distances as infinity',
      'Set source distance to 0',
      'Use priority queue for min distance',
      'Relax all edges from current node',
      'Repeat until all nodes processed'
    ],
    whenToUse: ['GPS navigation', 'Network routing', 'Game pathfinding'],
    whenNotToUse: ['Negative edge weights', 'All-pairs shortest']
  },
  aStar: {
    name: 'A* Search',
    icon: Network,
    category: 'graph',
    description: 'Informed search using heuristic. Finds shortest path efficiently.',
    timeComplexity: { time: 'O(E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    useCase: 'Heuristic pathfinding',
    formula: 'f(n) = g(n) + h(n)',
    steps: [
      'Calculate f = g + h for each node',
      'g = cost from start',
      'h = heuristic estimate to goal',
      'Choose lowest f(n) to explore',
      'Repeat until goal reached'
    ],
    whenToUse: ['Games', 'Robotics', 'Maps', 'Puzzle solving'],
    whenNotToUse: ['No admissible heuristic', 'Infinite state space']
  },
  prim: {
    name: "Prim's Algorithm",
    icon: Network,
    category: 'graph',
    description: 'Greedy algorithm for Minimum Spanning Tree. Grows tree one edge at a time.',
    timeComplexity: { time: 'O(E + V log V)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    useCase: 'Minimum spanning tree',
    steps: [
      'Start with arbitrary node',
      'Add cheapest edge connecting tree to outside',
      'Repeat until all nodes included',
      'Result: connected, minimum weight tree'
    ],
    whenToUse: ['Network design', 'Clustering', 'Image segmentation'],
    whenNotToUse: ['Disconnected graphs', 'All pairs MST']
  },
  kruskal: {
    name: "Kruskal's Algorithm",
    icon: Network,
    category: 'graph',
    description: 'Greedy MST algorithm. Sorts edges and adds cheapest without forming cycles.',
    timeComplexity: { time: 'O(E log E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    useCase: 'Minimum spanning tree',
    steps: [
      'Sort all edges by weight',
      'Add cheapest edge if no cycle',
      'Use Union-Find for cycle detection',
      'Repeat until V-1 edges'
    ],
    whenToUse: ['Sparse graphs', 'Network design', 'Clustering'],
    whenNotToUse: ['Dense graphs', 'Need rooted tree']
  },
  
  // Dynamic Programming
  fibonacci: {
    name: 'Fibonacci (DP)',
    icon: Brain,
    category: 'dp',
    description: 'Compute Fibonacci using memoization to avoid exponential recalculation.',
    timeComplexity: { recursive: 'O(2ⁿ)', dp: 'O(n)', spaceOpt: 'O(n) → O(1)' },
    spaceComplexity: 'O(n)',
    formula: 'F(n) = F(n-1) + F(n-2)',
    steps: [
      'Identify overlapping subproblems',
      'Store results in table/array',
      'Build up from base cases',
      'Return final result'
    ],
    whenToUse: ['Overlapping subproblems', 'Optimal substructure', 'Sequential decisions'],
    whenNotToUse: ['No overlap', 'No optimal substructure']
  },
  knapsack: {
    name: '0/1 Knapsack',
    icon: Box,
    category: 'dp',
    description: 'Maximize value with weight constraint. Each item can be taken or not.',
    timeComplexity: { time: 'O(nW)', space: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    formula: 'dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])',
    steps: [
      'Create DP table (n+1) × (W+1)',
      'Fill table bottom-up',
      'Consider including/excluding each item',
      'Return dp[n][W]'
    ],
    whenToUse: ['Resource allocation', 'Budget optimization', 'Selection problems'],
    whenNotToUse: ['Unbounded knapsack', 'Multiple constraints']
  }
};

// ==================== DISTRIBUTED PATTERNS ====================
const DISTRIBUTED_PATTERNS = {
  ratelimiter: {
    name: 'Rate Limiter',
    icon: Zap,
    category: 'resilience',
    description: 'Controls request rate to prevent abuse and ensure fair usage.',
    algorithms: [
      { name: 'Token Bucket', desc: 'Tokens added at fixed rate, requests consume tokens' },
      { name: 'Leaky Bucket', desc: 'Requests processed at fixed rate, excess queued or dropped' },
      { name: 'Fixed Window', desc: 'Count requests per time window, reset at boundary' },
      { name: 'Sliding Window', desc: 'Rolling time window for more accurate counting' }
    ],
    metrics: ['Requests per second', 'Tokens remaining', 'Wait time'],
    useCases: ['API protection', 'DDOS prevention', 'Fair sharing'],
    configuration: { capacity: 100, refillRate: 10, windowSize: 60 }
  },
  circuitbreaker: {
    name: 'Circuit Breaker',
    icon: Shield,
    category: 'resilience',
    description: 'Prevents cascade failures by failing fast when service is unhealthy.',
    states: [
      { name: 'CLOSED', desc: 'Normal operation, requests pass through' },
      { name: 'OPEN', desc: 'Fail fast, no requests to failing service' },
      { name: 'HALF_OPEN', desc: 'Test recovery, limited requests allowed' }
    ],
    thresholds: { failureCount: 5, timeout: 30000, successThreshold: 3 },
    useCases: ['Microservices', 'External API calls', 'Database connections'],
    configuration: { failureThreshold: 5, timeout: 30000, halfOpenRequests: 3 }
  },
  distributedlock: {
    name: 'Distributed Lock',
    icon: Lock,
    category: 'coordination',
    description: 'Mutual exclusion across distributed systems for resource access.',
    implementation: [
      { method: 'Database', desc: 'Row lock or advisory lock in database' },
      { method: 'Redis', desc: 'SET NX with expiration' },
      { method: 'ZooKeeper', desc: 'Ephemeral sequential nodes' },
      { method: 'Chubby', desc: 'Paxos-based lock service' }
    ],
    properties: ['Mutual exclusion', 'No deadlock', 'Fault tolerance'],
    challenges: ['Clock skew', 'Network partitions', 'Lock lifetime'],
    useCases: ['Leader election', 'Resource serialization', 'Exclusive access']
  },
  loadbalancer: {
    name: 'Load Balancer',
    icon: Globe,
    category: 'distribution',
    description: 'Distributes incoming requests across multiple servers.',
    algorithms: [
      { name: 'Round Robin', desc: 'Sequentially distribute to each server' },
      { name: 'Least Connections', desc: 'Send to server with fewest active connections' },
      { name: 'Weighted', desc: 'Based on server capacity' },
      { name: 'IP Hash', desc: 'Same client to same server' },
      { name: 'Least Response Time', desc: 'Fastest responding server' }
    ],
    types: ['Layer 4 (TCP)', 'Layer 7 (HTTP)', 'Global', 'Regional'],
    healthChecks: ['TCP handshake', 'HTTP endpoint', 'Custom check'],
    useCases: ['High availability', 'Scalability', 'Fault tolerance']
  },
  cachingsharding: {
    name: 'Cache Sharding',
    icon: Database,
    category: 'performance',
    description: 'Partition cache data across multiple nodes for horizontal scaling.',
    strategies: [
      { name: 'Key Hashing', desc: 'Hash key to determine shard' },
      { name: 'Consistent Hashing', desc: 'Minimal redistribution on shard changes' },
      { name: 'Range Sharding', desc: 'Key ranges assigned to shards' },
      { name: 'Geo-Sharding', desc: 'Location-based distribution' }
    ],
    considerations: ['Hot keys', 'Uneven distribution', 'Shard failure'],
    useCases: ['Distributed cache', 'Session storage', 'API response cache']
  },
  messagedqueue: {
    name: 'Message Queue',
    icon: Network,
    category: 'async',
    description: 'Asynchronous communication between services via queued messages.',
    patterns: [
      { name: 'Point-to-Point', desc: 'One producer, one consumer' },
      { name: 'Publish/Subscribe', desc: 'One producer, multiple consumers' },
      { name: 'Request/Reply', desc: 'Synchronous over async' },
      { name: 'Fan-out/Fan-in', desc: 'Split and combine workflows' }
    ],
    guarantees: ['At-least-once', 'At-most-once', 'Exactly-once'],
    useCases: ['Async processing', 'Event sourcing', 'Decoupling', 'Buffering']
  }
};

// ==================== COMPLEXITY CHEAT SHEET ====================
const COMPLEXITY_CHEAT_SHEET = {
  title: 'Time Complexity Cheat Sheet',
  subtitle: 'Quick reference for common operations',
  data: {
    'O(1)': { name: 'Constant', description: 'Always same time', examples: ['Array access', 'Hash table lookup', 'Push/Pop stack'] },
    'O(log n)': { name: 'Logarithmic', description: 'Divides problem each step', examples: ['Binary search', 'BST operations', 'Binary heap'] },
    'O(n)': { name: 'Linear', description: 'Grows with input size', examples: ['Linear search', 'Array traversal', 'Simple loop'] },
    'O(n log n)': { name: 'Linearithmic', description: 'Efficient sorting', examples: ['Merge sort', 'Quick sort (avg)', 'Heap sort'] },
    'O(n²)': { name: 'Quadratic', description: 'Nested loops', examples: ['Bubble sort', 'Selection sort', 'Matrix operations'] },
    'O(2ⁿ)': { name: 'Exponential', description: 'Doubles each step', examples: ['Fibonacci (rec)', 'Subset generation', 'Traveling salesman (brute)'] },
    'O(n!)': { name: 'Factorial', description: 'Grows extremely fast', examples: ['Permutations', 'Traveling salesman (all)', 'Brute force TSP'] }
  }
};

export default function DocsPage() {
  const [activeCategory, setActiveCategory] = useState('datastructures');
  const [selectedItem, setSelectedItem] = useState('array');
  const [copied, setCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const categories = [
    { id: 'datastructures', name: 'Data Structures', icon: Database, count: Object.keys(DATA_STRUCTURES).length },
    { id: 'algorithms', name: 'Algorithms', icon: Code, count: Object.keys(ALGORITHMS).length },
    { id: 'distributed', name: 'Distributed Patterns', icon: Network, count: Object.keys(DISTRIBUTED_PATTERNS).length },
    { id: 'complexity', name: 'Complexity', icon: BarChart2, count: 7 }
  ];

  const currentItems = {
    datastructures: DATA_STRUCTURES,
    algorithms: ALGORITHMS,
    distributed: DISTRIBUTED_PATTERNS,
    complexity: null
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const item = activeCategory === 'complexity' ? null : currentItems[activeCategory]?.[selectedItem];
  const categoryItems = activeCategory === 'complexity' ? null : currentItems[activeCategory];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Core System Atlas Docs
              </h1>
              <p className="text-sm text-slate-500">
                Comprehensive guide to data structures, algorithms, and distributed systems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-teal-300 text-teal-600 bg-teal-50">
              {categories.reduce((acc, cat) => acc + cat.count, 0)} Topics
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Categories */}
          <div className="col-span-3 space-y-4">
            <Card className="sticky top-24 border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSelectedItem(cat.id === 'complexity' ? null : Object.keys(currentItems[cat.id] || {})[0]);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all ${
                        activeCategory === cat.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </div>
                      <Badge variant="secondary" className={`text-xs ${activeCategory === cat.id ? 'bg-teal-500 text-white' : 'bg-slate-100'}`}>
                        {cat.count}
                      </Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Items List */}
            {activeCategory !== 'complexity' && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 max-h-96 overflow-y-auto">
                  {Object.entries(categoryItems || {}).map(([key, value]) => {
                    const Icon = value.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedItem(key)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                          selectedItem === key
                            ? 'bg-teal-100 text-teal-700 border border-teal-200'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="truncate">{value.name}</span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {activeCategory === 'complexity' ? (
              <ComplexityCheatSheet data={COMPLEXITY_CHEAT_SHEET} />
            ) : item ? (
              <ItemDetail item={item} activeCategory={activeCategory} copyCode={copyCode} copied={copied} />
            ) : (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-slate-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                    <p className="text-lg font-medium">Select a topic to learn</p>
                    <p className="text-sm">Choose from the sidebar to explore</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENT: ITEM DETAIL ====================
function ItemDetail({ item, activeCategory, copyCode, copied }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'complexity', name: 'Complexity', icon: BarChart2 },
    { id: 'visualization', name: 'Visualization', icon: Play },
    { id: 'code', name: 'Code', icon: Code }
  ];

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
            <item.icon className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">{item.name}</CardTitle>
            <Badge variant="outline" className="mt-1">{item.category}</Badge>
          </div>
        </div>
        <CardDescription className="text-slate-500 mt-2">{item.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 border border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Strengths & Weaknesses */}
            {item.strengths && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-medium text-emerald-800">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {item.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-medium text-amber-800">Weaknesses</h4>
                  </div>
                  <ul className="space-y-2">
                    {item.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Use Cases */}
            {item.useCases && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  Real-World Use Cases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.useCases.map((use, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm Steps */}
            {item.steps && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  How It Works
                </h4>
                <div className="space-y-3">
                  {item.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-teal-700">{i + 1}</span>
                      </div>
                      <p className="text-sm text-slate-700">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithm-specific: When to use */}
            {item.whenToUse && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-teal-50 border border-teal-200">
                  <h4 className="font-medium text-teal-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    When to Use
                  </h4>
                  <ul className="space-y-1">
                    {item.whenToUse.map((w, i) => (
                      <li key={i} className="text-sm text-teal-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    When NOT to Use
                  </h4>
                  <ul className="space-y-1">
                    {item.whenNotToUse?.map((w, i) => (
                      <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Distributed Pattern Details */}
            {item.algorithms && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Algorithms & Strategies</h4>
                <div className="space-y-3">
                  {item.algorithms.map((algo, i) => (
                    <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <h5 className="font-medium text-slate-800">{algo.name}</h5>
                      <p className="text-sm text-slate-500 mt-1">{algo.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Circuit Breaker States */}
            {item.states && (
              <div>
                <h4 className="font-medium text-slate-800 mb-3">Circuit States</h4>
                <div className="grid grid-cols-3 gap-3">
                  {item.states.map((state, i) => (
                    <div key={i} className={`p-4 rounded-lg border ${
                      state.name === 'CLOSED' ? 'bg-emerald-50 border-emerald-200' :
                      state.name === 'OPEN' ? 'bg-red-50 border-red-200' :
                      'bg-amber-50 border-amber-200'
                    }`}>
                      <Badge className={`mb-2 ${
                        state.name === 'CLOSED' ? 'bg-emerald-500' :
                        state.name === 'OPEN' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`}>{state.name}</Badge>
                      <p className="text-sm text-slate-600">{state.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formula */}
            {item.formula && (
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                <h4 className="font-medium text-indigo-800 mb-2">Formula</h4>
                <code className="text-lg font-mono text-indigo-700">{item.formula}</code>
              </div>
            )}
          </TabsContent>

          {/* Complexity Tab */}
          <TabsContent value="complexity" className="mt-6">
            {item.timeComplexity && (
              <div>
                <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Time Complexity
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(item.timeComplexity).map(([op, time]) => (
                    <div key={op} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-sm font-medium text-slate-700 capitalize">{op}</span>
                      <Badge className={time.includes('O(1)') ? 'bg-emerald-100 text-emerald-700' :
                        time.includes('O(log n)') ? 'bg-teal-100 text-teal-700' :
                        time.includes('O(n²)') ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'}>{time}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.spaceComplexity && (
              <div className="mt-6">
                <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-teal-600" />
                  Space Complexity
                </h4>
                <Badge className="text-lg px-4 py-2 bg-slate-100 text-slate-700">{item.spaceComplexity}</Badge>
              </div>
            )}

            {item.stable !== undefined && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Stable Sort</span>
                  {item.stable ? (
                    <Badge className="bg-emerald-100 text-emerald-700">Yes</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700">No</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">In-Place</span>
                  {item.inplace ? (
                    <Badge className="bg-emerald-100 text-emerald-700">Yes</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700">No</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {item.prerequisites && (
              <div className="mt-6">
                <h4 className="font-medium text-slate-800 mb-3">Prerequisites</h4>
                <div className="flex flex-wrap gap-2">
                  {item.prerequisites.map((p, i) => (
                    <Badge key={i} variant="outline" className="border-indigo-300 text-indigo-600 bg-indigo-50">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics for distributed patterns */}
            {item.metrics && (
              <div className="mt-6">
                <h4 className="font-medium text-slate-800 mb-3">Key Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  {item.metrics.map((m, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <p className="text-sm font-medium text-slate-700">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Visualization Tab */}
          <TabsContent value="visualization" className="mt-6">
            <div className="p-8 rounded-lg bg-slate-900 flex items-center justify-center h-80">
              {item.visualization && (
                <Visualizer type={item.visualization.type} data={item.visualization} />
              )}
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              Interactive visualization available in the Visualizer section
            </p>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="mt-6">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-3 right-3 z-10"
                onClick={() => copyCode(generateCode(item))}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-500" />
                )}
              </Button>
              <ScrollArea className="h-96">
                <pre className="text-sm p-4 rounded-lg bg-slate-900 overflow-x-auto">
                  <code className="text-sm text-slate-100 font-mono">
                    {generateCode(item)}
                  </code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ==================== COMPONENT: COMPLEXITY CHEAT SHEET ====================
function ComplexityCheatSheet({ data }) {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900">{data.title}</CardTitle>
        <CardDescription className="text-slate-500">{data.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(data.data).map(([complexity, info]) => (
            <div key={complexity} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className={`w-24 py-1 px-3 rounded text-center font-mono text-sm font-medium ${
                complexity === 'O(1)' ? 'bg-emerald-100 text-emerald-700' :
                complexity === 'O(log n)' ? 'bg-teal-100 text-teal-700' :
                complexity === 'O(n)' ? 'bg-blue-100 text-blue-700' :
                complexity === 'O(n log n)' ? 'bg-indigo-100 text-indigo-700' :
                complexity === 'O(n²)' ? 'bg-amber-100 text-amber-700' :
                complexity === 'O(2ⁿ)' ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {complexity}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{info.name}</h4>
                <p className="text-sm text-slate-500">{info.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {info.examples.map((ex, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-white">{ex}</Badge>
                  ))}
                </div>
              </div>
              <div className="w-32 h-16 bg-slate-100 rounded flex items-end justify-center p-1">
                <div className={`w-full rounded ${
                  complexity === 'O(1)' ? 'h-2 bg-emerald-500' :
                  complexity === 'O(log n)' ? 'h-8 bg-teal-500' :
                  complexity === 'O(n)' ? 'h-16 bg-blue-500' :
                  complexity === 'O(n log n)' ? 'h-24 bg-indigo-500' :
                  complexity === 'O(n²)' ? 'h-32 bg-amber-500' :
                  complexity === 'O(2ⁿ)' ? 'h-40 bg-orange-500' :
                  'h-48 bg-red-500'
                }`} style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== COMPONENT: VISUALIZER ====================
function Visualizer({ type, data }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setStep(s => (s + 1) % 4);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  switch (type) {
    case 'linear':
      return (
        <div className="flex items-center gap-1">
          {data.values.map((v, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-16 bg-teal-600 rounded flex items-end justify-center pb-2 text-white font-mono">
                {v}
              </div>
              <span className="text-xs text-slate-400 mt-1">[{i}]</span>
            </div>
          ))}
        </div>
      );
    case 'stack':
      return (
        <div className="flex items-center gap-8">
          <div className="flex flex-col-reverse gap-1">
            {data.values.map((v, i) => (
              <div key={i} className={`w-24 h-10 rounded flex items-center justify-center text-white font-mono transition-all ${
                i === data.values.length - 1 ? 'bg-emerald-500 shadow-lg scale-105' : 'bg-slate-600'
              }`}>
                {v}
              </div>
            ))}
          </div>
          <div className="text-slate-400">
            <div className="text-sm mb-2">← TOP</div>
            <div className="text-xs">PUSH / POP</div>
          </div>
        </div>
      );
    case 'queue':
      return (
        <div className="flex items-center gap-2">
          {data.values.map((v, i) => (
            <div key={i} className={`w-16 h-12 rounded flex items-center justify-center text-white font-mono ${
              i === 0 ? 'bg-amber-500 shadow-lg' : 'bg-slate-600'
            }`}>
              {v}
            </div>
          ))}
          <div className="flex flex-col gap-1 ml-4">
            <div className="text-xs text-emerald-500">FRONT →</div>
            <div className="text-xs text-slate-400">← REAR</div>
          </div>
        </div>
      );
    case 'hash':
      return (
        <div className="flex gap-8">
          <div className="flex flex-col gap-2">
            {data.values.map((kv, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-16 text-right text-teal-400 font-mono text-sm">{kv.k}:</span>
                <div className="w-20 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-mono text-sm">
                  {typeof kv.v === 'string' ? kv.v : kv.v}
                </div>
              </div>
            ))}
          </div>
          <div className="w-px h-32 bg-slate-600" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-12 h-10 bg-slate-700 rounded border border-slate-600" />
            ))}
          </div>
        </div>
      );
    case 'heap':
      return (
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white font-mono">
              {data.values[0]}
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-mono">
              {data.values[1]}
            </div>
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center text-white font-mono">
              {data.values[2]}
            </div>
          </div>
          <div className="flex items-center gap-16 mt-4">
            {[3, 4, 5, 6].map(i => (
              <div key={i} className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center text-white font-mono text-sm">
                {data.values[i]}
              </div>
            ))}
          </div>
        </div>
      );
    case 'bst':
      return (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-mono">
            {data.root}
          </div>
          <div className="flex gap-24 mt-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-mono">
                {data.structure.left}
              </div>
              <div className="flex gap-4 mt-2">
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white font-mono text-xs">
                  {data.structure.leftLeft}
                </div>
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white font-mono text-xs">
                  {data.structure.leftRight}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-mono">
                {data.structure.right}
              </div>
              <div className="flex gap-4 mt-2">
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white font-mono text-xs">
                  {data.structure.rightLeft}
                </div>
                <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-white font-mono text-xs">
                  {data.structure.rightRight}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 'graph':
      return (
        <svg width="400" height="200" viewBox="0 0 400 200">
          <circle cx="100" cy="50" r="20" fill="#0891B2" />
          <circle cx="200" cy="100" r="20" fill="#0891B2" />
          <circle cx="300" cy="50" r="20" fill="#0891B2" />
          <circle cx="150" cy="150" r="20" fill="#0891B2" />
          <circle cx="250" cy="150" r="20" fill="#0891B2" />
          <circle cx="100" cy="100" r="20" fill="#0891B2" />
          <line x1="100" y1="50" x2="200" y2="100" stroke="#64748B" strokeWidth="2" />
          <line x1="200" y1="100" x2="300" y2="50" stroke="#64748B" strokeWidth="2" />
          <line x1="100" y1="100" x2="150" y2="150" stroke="#64748B" strokeWidth="2" />
          <line x1="200" y1="100" x2="250" y2="150" stroke="#64748B" strokeWidth="2" />
          <line x1="150" y1="150" x2="250" y2="150" stroke="#64748B" strokeWidth="2" />
          <line x1="100" y1="50" x2="100" y2="100" stroke="#64748B" strokeWidth="2" />
          <text x="100" y="55" textAnchor="middle" fill="white" fontSize="10">A</text>
          <text x="200" y="105" textAnchor="middle" fill="white" fontSize="10">B</text>
          <text x="300" y="55" textAnchor="middle" fill="white" fontSize="10">C</text>
          <text x="150" y="155" textAnchor="middle" fill="white" fontSize="10">D</text>
          <text x="250" y="155" textAnchor="middle" fill="white" fontSize="10">E</text>
          <text x="100" y="105" textAnchor="middle" fill="white" fontSize="10">F</text>
        </svg>
      );
    default:
      return (
        <div className="text-center text-slate-400">
          <Activity className="w-16 h-16 mx-auto mb-4" />
          <p>Visualization for {type}</p>
          <Button onClick={togglePlay} className="mt-4 bg-teal-600 hover:bg-teal-700">
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
      );
  }
}

// ==================== COMPONENT: BOX ====================
function Box({ children }) {
  return <div className="w-10 h-10 bg-teal-500 rounded flex items-center justify-center text-white">{children}</div>;
}

// ==================== HELPER: GENERATE CODE ====================
function generateCode(item) {
  if (item.name === 'Array') {
    return `// Array Operations
const arr = [1, 2, 3, 4, 5];

// Access - O(1)
const first = arr[0]; // 1

// Search - O(n)
const index = arr.findIndex(x => x === 3); // 2

// Insert - O(n)
arr.splice(2, 0, 99); // [1, 2, 99, 3, 4, 5]

// Delete - O(n)
arr.splice(3, 1); // [1, 2, 99, 4, 5]

// Map - O(n)
const doubled = arr.map(x => x * 2);

// Filter - O(n)
const evens = arr.filter(x => x % 2 === 0);`;
  }

  if (item.name === 'Binary Search') {
    return `// Binary Search - O(log n)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found!
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}

// Usage
const sorted = [1, 3, 5, 7, 9, 11, 13];
binarySearch(sorted, 7); // Returns 3`;
  }

  if (item.name === 'Quick Sort') {
    return `// Quick Sort - O(n log n) avg
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
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

// Usage
const unsorted = [64, 34, 25, 12, 22, 11, 90];
quickSort(unsorted); // [11, 12, 22, 25, 34, 64, 90]`;
  }

  if (item.name === 'Hash Table') {
    return `// Hash Table Implementation
class HashTable {
  constructor(size = 10) {
    this.size = size;
    this.buckets = new Array(size).fill(null).map(() => []);
  }
  
  // Simple hash function
  hash(key) {
    let hash = 0;
    for (const char of key) {
      hash = (hash * 31 + char.charCodeAt(0)) % this.size;
    }
    return hash;
  }
  
  // Insert - O(1) avg
  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    
    // Update existing or add new
    const existing = bucket.find(item => item.key === key);
    if (existing) {
      existing.value = value;
    } else {
      bucket.push({ key, value });
    }
  }
  
  // Lookup - O(1) avg
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    return bucket.find(item => item.key === key)?.value;
  }
  
  // Delete - O(1) avg
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const idx = bucket.findIndex(item => item.key === key);
    if (idx !== -1) bucket.splice(idx, 1);
  }
}`;
  }

  if (item.name === 'LRU Cache') {
    return `// LRU Cache - O(1) operations
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }
  
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

// Usage
const lru = new LRUCache(3);
lru.put(1, 'a'); // {1: 'a'}
lru.put(2, 'b'); // {1: 'a', 2: 'b'}
lru.put(3, 'c'); // {1: 'a', 2: 'b', 3: 'c'}
lru.get(2);      // Returns 'b', reorders to most recent
lru.put(4, 'd'); // Evicts key 1, {2: 'b', 3: 'c', 4: 'd'}`;
  }

  if (item.name === 'Trie') {
    return `// Trie (Prefix Tree) - O(m) operations
class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  // Insert - O(m) where m = word length
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEndOfWord = true;
  }
  
  // Search - O(m)
  search(word) {
    const node = this._findNode(word);
    return node !== null && node.isEndOfWord;
  }
  
  // Prefix Search - O(m)
  startsWith(prefix) {
    return this._findNode(prefix) !== null;
  }
  
  _findNode(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children.has(char)) return null;
      node = node.children.get(char);
    }
    return node;
  }
}

// Usage
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.search('apple');      // true
trie.search('app');         // true
trie.startsWith('ap');       // true
trie.startsWith('banana');  // false`;
  }

  return `// ${item.name}
${item.description}

// Implementation details available in the visualization section.
`;
}
