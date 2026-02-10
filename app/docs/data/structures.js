// Data Structures Data
export const DATA_STRUCTURES = {
  array: {
    id: 'array',
    name: 'Array',
    icon: 'List',
    category: 'linear',
    description: 'Contiguous memory locations storing elements of the same type. Arrays provide O(1) random access and are cache-friendly due to contiguous memory layout.',
    timeComplexity: { access: 'O(1)', search: 'O(n)', insert: 'O(n)', delete: 'O(n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Fast random access O(1)', 'Cache-friendly (spatial locality)', 'Simple and predictable', 'Low memory overhead', 'Perfect for iteration'],
    weaknesses: ['Fixed size (static arrays)', 'Expensive insert/delete O(n)', 'Requires shifting elements', 'No dynamic resizing'],
    useCases: ['Lookup tables and indexing', 'Buffer and stream processing', 'Matrix and tensor operations', 'Pixel and image data', 'Static collections'],
    visualization: { type: 'array', values: [23, 45, 12, 67, 89, 34, 56], indices: true },
    codeId: 'array',
    animationSteps: [
      { description: 'Array stores elements in contiguous memory blocks', highlight: [0, 1, 2, 3, 4, 5, 6] },
      { description: 'Random access by index - O(1)', highlight: [3], action: 'access' },
      { description: 'Search requires checking each element - O(n)', highlight: [0, 1, 2, 3, 4, 5, 6], action: 'search' },
      { description: 'Insert at index 2 requires shifting - O(n)', highlight: [2, 3, 4, 5, 6], action: 'insert' },
      { description: 'Delete at index 2 requires shifting - O(n)', highlight: [3, 4, 5, 6], action: 'delete' }
    ]
  },
  linkedlist: {
    id: 'linkedlist',
    name: 'Linked List',
    icon: 'List',
    category: 'linear',
    description: 'Sequential nodes where each node contains data and a reference (pointer) to the next node. Dynamic size with O(1) insertion/deletion at known positions.',
    timeComplexity: { access: 'O(n)', search: 'O(n)', insert: 'O(1)', delete: 'O(1)' },
    spaceComplexity: 'O(n)',
    strengths: ['Dynamic size - no pre-allocation', 'O(1) insertion/deletion at head/tail', 'No shifting required', 'Flexible memory allocation'],
    weaknesses: ['No random access O(n)', 'Memory overhead per node (pointer)', 'Poor cache locality (scattered)', 'No efficient indexing'],
    useCases: ['Undo/Redo functionality', 'Music and media playlists', 'Symbol tables in compilers', 'Adjacency lists for graphs', 'Memory management (free lists)'],
    visualization: { type: 'linkedlist', values: [23, 45, 12, 67, 89], nextPointers: true },
    codeId: 'linkedlist',
    animationSteps: [
      { description: 'Each node contains data and next pointer', highlight: [0], showPointer: true },
      { description: 'Access requires traversal from head - O(n)', highlight: [0, 1, 2, 3, 4], action: 'traverse' },
      { description: 'Insert at head is O(1) - just update pointer', highlight: [0], action: 'insertHead' },
      { description: 'Insert at tail is O(1) with tail pointer', highlight: [4], action: 'insertTail' },
      { description: 'Delete at head is O(1) - just move head', highlight: [0], action: 'deleteHead' }
    ]
  },
  stack: {
    id: 'stack',
    name: 'Stack',
    icon: 'Layers',
    category: 'linear',
    description: 'LIFO (Last In First Out) data structure. Elements are added and removed from the same end called the "top". Think of a stack of plates.',
    timeComplexity: { push: 'O(1)', pop: 'O(1)', peek: 'O(1)', search: 'O(n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Simple LIFO semantics', 'O(1) push/pop/peek operations', 'Easy to implement', 'Prevents out-of-order access'],
    weaknesses: ['Only top element accessible', 'No random access', 'Linear search for elements', 'Cannot iterate efficiently'],
    useCases: ['Function call stack in execution', 'Undo/Redo mechanisms', 'Expression evaluation (postfix)', 'Backtracking algorithms', 'Browser history navigation'],
    visualization: { type: 'stack', values: [10, 20, 30, 40, 50], direction: 'vertical' },
    codeId: 'stack',
    animationSteps: [
      { description: 'Push 10 - Stack: [10]', highlight: [0], action: 'push', value: 10 },
      { description: 'Push 20 - Stack: [10, 20]', highlight: [0, 1], action: 'push', value: 20 },
      { description: 'Push 30 - Stack: [10, 20, 30]', highlight: [0, 1, 2], action: 'push', value: 30 },
      { description: 'Pop - Returns 30, Stack: [10, 20]', highlight: [2], action: 'pop' },
      { description: 'Peek - Returns 30 without removing', highlight: [2], action: 'peek' }
    ]
  },
  queue: {
    id: 'queue',
    name: 'Queue',
    icon: 'Layers',
    category: 'linear',
    description: 'FIFO (First In First Out) data structure. Elements are added at the rear (enqueue) and removed from the front (dequeue). Think of a line at a store.',
    timeComplexity: { enqueue: 'O(1)', dequeue: 'O(1)', peek: 'O(1)', search: 'O(n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Fair FIFO processing', 'O(1) enqueue/dequeue operations', 'Bounded waiting time', 'Easy to implement'],
    weaknesses: ['Only front and rear accessible', 'No random access', 'Linear search required', 'Ring buffer complexity'],
    useCases: ['Task scheduling (print jobs)', 'Breadth-first search traversal', 'Message passing between threads', 'Event loop processing', 'Call center waiting systems'],
    visualization: { type: 'queue', values: [10, 20, 30, 40, 50], front: 0 },
    codeId: 'queue',
    animationSteps: [
      { description: 'Enqueue 10 - Queue: [10, 20, 30]', highlight: [0], action: 'enqueue', value: 10 },
      { description: 'Enqueue 20 - Queue: [10, 20, 30]', highlight: [0, 1], action: 'enqueue', value: 20 },
      { description: 'Enqueue 30 - Queue: [10, 20, 30]', highlight: [0, 1, 2], action: 'enqueue', value: 30 },
      { description: 'Dequeue - Returns 10, Queue: [20, 30]', highlight: [0], action: 'dequeue' },
      { description: 'Front/Peek - Returns 20 without removing', highlight: [1], action: 'peek' }
    ]
  },
  hashtable: {
    id: 'hashtable',
    name: 'Hash Table',
    icon: 'Hash',
    category: 'hash',
    description: 'Maps keys to values using a hash function. Provides average O(1) insertion, deletion, and lookup. Essential for dictionaries and sets.',
    timeComplexity: { access: 'O(1) avg', search: 'O(1) avg', insert: 'O(1) avg', delete: 'O(1) avg' },
    spaceComplexity: 'O(n)',
    strengths: ['Fast average O(1) operations', 'Flexible key types', 'Efficient for lookups', 'Foundation for sets/maps'],
    weaknesses: ['No ordering of elements', 'Hash collisions possible', 'Worst case O(n) with poor hash', 'Cannot range query efficiently'],
    useCases: ['Database indexing systems', 'Caching layers', 'Symbol tables in compilers', 'Deduplication', 'Counting frequencies'],
    visualization: { type: 'hashtable', buckets: 8, entries: [{k: 'name', v: 'UjjwalS'}, {k: 'age', v: 23}, {k: 'city', v: 'NYC'}] },
    codeId: 'hashtable',
    animationSteps: [
      { description: 'Hash function maps key to bucket index', highlight: [0, 1, 2, 3, 4, 5, 6, 7], showHash: true },
      { description: 'Insert: Hash(key) → bucket → store key-value', highlight: [2], action: 'insert', key: 'name' },
      { description: 'Lookup: Hash(key) → find bucket → get value', highlight: [2], action: 'lookup', key: 'name' },
      { description: 'Collision handling - chaining', highlight: [2], showCollision: true },
      { description: 'Resize when load factor exceeds threshold', highlight: [0, 1, 2, 3, 4, 5, 6, 7], action: 'resize' }
    ]
  },
  lrucache: {
    id: 'lrucache',
    name: 'LRU Cache',
    icon: 'RefreshCw',
    category: 'cache',
    description: 'Least Recently Used cache that automatically evicts the least recently accessed items when capacity is reached. Combines hash map for O(1) access with doubly-linked list for order.',
    timeComplexity: { get: 'O(1)', set: 'O(1)' },
    spaceComplexity: 'O(capacity)',
    strengths: ['Guaranteed O(1) get/set', 'Automatic least-recently-used eviction', 'Memory efficient for caching', 'Perfect for limited memory'],
    weaknesses: ['Fixed capacity', 'Memory overhead for bookkeeping', 'Complex implementation', 'No access ordering beyond LRU'],
    useCases: ['Web browser cache', 'Database query cache', 'API response caching', 'Operating system page cache', 'CDN edge caching'],
    visualization: { type: 'lru', capacity: 5, order: ['A', 'B', 'C', 'D', 'E'], accessOrder: ['A', 'B', 'C', 'D', 'E'] },
    codeId: 'lrucache',
    animationSteps: [
      { description: 'Cache empty - Capacity: 5', highlight: [], action: 'init' },
      { description: 'Set A=1 - Cache: [A, B, C, D, E]', highlight: [0], action: 'set', key: 'A' },
      { description: 'Get B - Moves B to MRU position', highlight: [1, 0], action: 'get', key: 'B' },
      { description: 'Set F=6 - Evicts LRU (A), Cache: [B, C, D, E, F]', highlight: [4, 0], action: 'set', key: 'F' },
      { description: 'Cache hit on C - Move to front', highlight: [2, 1], action: 'get', key: 'C' }
    ]
  },
  binarysearchtree: {
    id: 'binarysearchtree',
    name: 'Binary Search Tree',
    icon: 'TreeDeciduous',
    category: 'tree',
    description: 'Binary tree where left child < parent < right child. Enables O(log n) search, insertion, and deletion when balanced.',
    timeComplexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Sorted data maintains order', 'Efficient O(log n) operations when balanced', 'Supports range queries', 'In-order traversal gives sorted sequence'],
    weaknesses: ['Can degenerate to linked list O(n)', 'No cache-friendly structure', 'Balancing adds complexity', 'Worst case O(n) without AVL/Red-Black'],
    useCases: ['Database indexing (B-Tree variants)', 'Sorted collections (std::map)', 'Range queries and reports', 'Binary search trees', 'Memory allocation (buddy system)'],
    visualization: { type: 'bst', root: 50, structure: { left: 25, right: 75, leftLeft: 15, leftRight: 35, rightLeft: 60, rightRight: 90 }, balanced: true },
    codeId: 'binarysearchtree',
    animationSteps: [
      { description: 'BST property: left < parent < right', highlight: ['root'], showProperty: true },
      { description: 'Search 35 - Compare 50 → 25 → 35', highlight: ['root', 'left', 'leftRight'], action: 'search', value: 35 },
      { description: 'Insert 20 - Find position, insert as left child of 25', highlight: ['left', 'leftLeft'], action: 'insert', value: 20 },
      { description: 'Delete 25 - Replace with successor (35)', highlight: ['left', 'right', 'leftRight'], action: 'delete', value: 25 },
      { description: 'In-order traversal: 15, 20, 35, 50, 60, 75, 90', highlight: ['all'], action: 'traverse' }
    ]
  },
  avltree: {
    id: 'avltree',
    name: 'AVL Tree',
    icon: 'TreeDeciduous',
    category: 'tree',
    description: 'Self-balancing BST where height difference between left and right subtrees is at most 1. Rotations restore balance after insertions/deletions.',
    timeComplexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Guaranteed O(log n) worst-case', 'Height difference ≤ 1 (balance factor)', 'Fast search performance', 'Well-studied and reliable'],
    weaknesses: ['Complex implementation with rotations', 'Extra memory for height tracking', 'More rotations than Red-Black', 'Overkill for rarely modified trees'],
    useCases: ['Database indexing systems', 'In-memory databases', 'Real-time systems with timing constraints', 'Financial applications (predictable timing)', 'Compiler symbol tables'],
    visualization: { type: 'avl', balance: true, height: 3, nodes: 7, balanceFactors: [0, 0, 0, 0, 0, 0, 0] },
    codeId: 'avltree',
    animationSteps: [
      { description: 'AVL maintains height balance (BF ∈ {-1, 0, 1})', highlight: ['all'], showBalance: true },
      { description: 'Insert 10 - May cause imbalance', highlight: ['root'], action: 'insert', value: 10 },
      { description: 'Right rotation needed - LL case', highlight: ['root', 'left'], action: 'rotateRight' },
      { description: 'Tree rebalanced - height difference ≤ 1', highlight: ['all'], showBalance: true },
      { description: 'Delete - May cascade rotations', highlight: ['all'], action: 'delete', value: 10 }
    ]
  },
  btree: {
    id: 'btree',
    name: 'B-Tree',
    icon: 'TreeDeciduous',
    category: 'tree',
    description: 'Self-balancing tree optimized for disk storage. Each node can contain multiple keys and have multiple children, minimizing disk I/O.',
    timeComplexity: { access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)', delete: 'O(log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Optimized for disk (high fanout)', 'Minimal disk reads O(log_B N)', 'Self-balancing', 'Efficient for range queries'],
    weaknesses: ['Complex implementation', 'Overhead for small datasets', 'Memory inefficient for small N', 'Variable node size'],
    useCases: ['Database storage engines', 'File system indexing', 'Key-value stores (RocksDB)', 'External memory databases', 'Large-scale indexing'],
    visualization: { type: 'btree', order: 4, levels: 2, keysPerNode: [15, 35, 60, 85], children: 5 },
    codeId: 'btree',
    animationSteps: [
      { description: 'B-Tree with order 4 (max 3 keys, 4 children)', highlight: ['all'], showStructure: true },
      { description: 'Insert 25 - Find appropriate leaf', highlight: ['root'], action: 'insert', value: 25 },
      { description: 'Node full - Split and promote middle key', highlight: ['root', 'left'], action: 'split' },
      { description: 'Root split - Tree height increases', highlight: ['root'], action: 'splitRoot' },
      { description: 'Multi-level tree - few disk reads', highlight: ['all'], showDepth: true }
    ]
  },
  segmenttree: {
    id: 'segmenttree',
    name: 'Segment Tree',
    icon: 'TreeDeciduous',
    category: 'tree',
    description: 'Binary tree for storing intervals and performing range queries. Each node represents an interval, enabling O(log n) range operations.',
    timeComplexity: { query: 'O(log n)', update: 'O(log n)', build: 'O(n)' },
    spaceComplexity: 'O(4n)',
    strengths: ['Range queries O(log n)', 'Range updates O(log n)', 'Flexible operations (sum, min, max)', 'Static and dynamic versions'],
    weaknesses: ['4n space overhead', 'Complex recursive structure', 'Overkill for single-point queries', 'Lazy propagation adds complexity'],
    useCases: ['Range sum queries', 'Range minimum/maximum queries', 'Range update (add/set)', 'Sweep line algorithms', 'Image processing (2D segment trees)'],
    visualization: { type: 'segment', size: 8, range: [0, 100], query: [2, 6], tree: [0, 8, 16, 24, 32, 40] },
    codeId: 'segmenttree',
    animationSteps: [
      { description: 'Segment tree on array [1, 3, 5, 7, 9, 11, 13, 15]', highlight: ['all'], showArray: true },
      { description: 'Query sum [2, 6] - Visit O(log n) nodes', highlight: [2, 3, 4, 5, 6], action: 'query', range: [2, 6] },
      { description: 'Update index 4 to 20 - Update path to root', highlight: [4, 2, 0], action: 'update', index: 4 },
      { description: 'Internal nodes maintain aggregated values', highlight: ['all'], showAggregation: true },
      { description: 'Tree structure - 4n array representation', highlight: ['all'], showArray: true }
    ]
  },
  fenwicktree: {
    id: 'fenwicktree',
    name: 'Binary Indexed Tree',
    icon: 'Layers',
    category: 'tree',
    description: 'Fenwick Tree (BIT) stores prefix sums in an array. Enables O(log n) prefix sum queries and point updates. Simpler than segment tree for prefix sums.',
    timeComplexity: { query: 'O(log n)', update: 'O(log n)', build: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    strengths: ['Simpler than segment tree', 'Only O(n) space', 'Fast prefix sums', 'Easy to implement'],
    weaknesses: ['Only prefix sums (not general ranges)', 'Less flexible than segment tree', 'No range updates without modification', 'Single-purpose data structure'],
    useCases: ['Prefix sum queries', 'Frequency array operations', 'Inverse prefix problems', 'Cumulative frequency', 'Binary indexed problems'],
    visualization: { type: 'fenwick', size: 8, values: [1, 3, 5, 7, 9, 11, 13, 15], tree: [1, 4, 5, 11, 9, 16, 13, 32] },
    codeId: 'fenwicktree',
    animationSteps: [
      { description: 'BIT array for [1, 3, 5, 7, 9, 11, 13, 15]', highlight: ['all'], showBIT: true },
      { description: 'Prefix sum [6] = tree[6] + tree[4] = 13 + 11 = 24', highlight: [6, 4], action: 'prefix', index: 6 },
      { description: 'Update index 4 (+2): Update BIT[4], BIT[8]', highlight: [4, 0], action: 'update', index: 4 },
      { description: 'Range sum [2, 5] = prefix(5) - prefix(1)', highlight: [5, 1], action: 'range', range: [2, 5] },
      { description: 'Binary representation guides traversal', highlight: ['all'], showBinary: true }
    ]
  },
  trie: {
    id: 'trie',
    name: 'Trie',
    icon: 'Globe',
    category: 'tree',
    description: 'Prefix tree (retrieval) where each edge represents a character. Enables O(m) string operations where m is key length. Perfect for autocomplete and prefix matching.',
    timeComplexity: { search: 'O(m)', insert: 'O(m)', delete: 'O(m)' },
    spaceComplexity: 'O(m × n)',
    strengths: ['Fast prefix search O(m)', 'Autocomplete ready', 'No collisions', 'Alphabet-independent'],
    weaknesses: ['Memory intensive', 'Sparse children arrays', 'Limited to string/character keys', 'Memory overhead per node'],
    useCases: ['Auto-complete suggestions', 'Spell checking dictionaries', 'IP routing (longest prefix)', 'Word games (Boggle)', 'DNA sequence matching'],
    visualization: { type: 'trie', words: ['cat', 'car', 'dog', 'dot', 'apple'], root: true },
    codeId: 'trie',
    animationSteps: [
      { description: 'Trie stores words character by character', highlight: ['root'], showStructure: true },
      { description: 'Insert "cat" - c → a → t (end)', highlight: ['root', 'c', 'a', 't'], action: 'insert', word: 'cat' },
      { description: 'Insert "car" - shares c → a prefix', highlight: ['root', 'c', 'a', 'r'], action: 'insert', word: 'car' },
      { description: 'Search "cat" - traverse c → a → t, end marker', highlight: ['root', 'c', 'a', 't'], action: 'search', word: 'cat' },
      { description: 'Prefix "ca" - all words starting with "ca"', highlight: ['root', 'c', 'a'], action: 'prefix', prefix: 'ca' }
    ]
  },
  graph: {
    id: 'graph',
    name: 'Graph',
    icon: 'Network',
    category: 'graph',
    description: 'Non-linear structure with vertices (nodes) connected by edges. Can be directed/undirected, weighted/unweighted. Models relationships and networks.',
    timeComplexity: { addNode: 'O(1)', addEdge: 'O(1)', bfs: 'O(V+E)', dfs: 'O(V+E)' },
    spaceComplexity: 'O(V + E)',
    strengths: ['Models complex relationships', 'Flexible structure', 'Paths and connectivity', 'Many real-world applications'],
    weaknesses: ['No inherent hierarchy', 'Complex traversal logic', 'Cycle detection needed', 'Memory for adjacency'],
    useCases: ['Social network analysis', 'GPS and route planning', 'Network topology', 'Dependency graphs', 'Recommendation systems'],
    visualization: { type: 'graph', nodes: 6, edges: 7, directed: false, weighted: false },
    codeId: 'graph',
    animationSteps: [
      { description: 'Graph with 6 nodes, 7 edges', highlight: ['all'], showGraph: true },
      { description: 'BFS from A - Level by level: A → B, C → D, E, F', highlight: ['all'], action: 'bfs', start: 'A' },
      { description: 'DFS from A - Deep first: A → B → D → E → C → F', highlight: ['all'], action: 'dfs', start: 'A' },
      { description: 'Dijkstra from A to F - Shortest path: A→C→F (weight 8)', highlight: ['path'], action: 'dijkstra', start: 'A', end: 'F' },
      { description: 'Cycle detection in undirected graph', highlight: ['cycle'], action: 'detectCycle' }
    ]
  },
  unionfind: {
    id: 'unionfind',
    name: 'Union-Find',
    icon: 'GitBranch',
    category: 'graph',
    description: 'Disjoint Set Union (DSU) tracks partitions of elements. Supports near O(1) union and find operations with path compression and union by rank.',
    timeComplexity: { find: 'O(α(n))', union: 'O(α(n))' },
    spaceComplexity: 'O(n)',
    strengths: ['Near O(1) amortized (inverse Ackermann)', 'Dynamic connectivity', 'Cycle detection', 'Efficient for Kruskal\'s MST'],
    weaknesses: ['No split operation', 'Union only (no division)', 'Path compression overhead', 'Limited use cases'],
    useCases: ['Kruskal\'s Minimum Spanning Tree', 'Network connectivity queries', 'Image processing (connected components)', 'Percolation simulations', 'Games (land ownership)'],
    visualization: { type: 'unionfind', sets: 5, operations: 4, connected: true, parents: [0, 1, 2, 3, 4], ranks: [0, 0, 0, 0, 0] },
    codeId: 'unionfind',
    animationSteps: [
      { description: 'Initial: 5 separate sets {0}, {1}, {2}, {3}, {4}', highlight: [0, 1, 2, 3, 4], showParents: true },
      { description: 'Union(0, 1) - Attach tree with lower rank', highlight: [0, 1], action: 'union', a: 0, b: 1 },
      { description: 'Find(1) with path compression', highlight: [1, 0], action: 'find', x: 1 },
      { description: 'Union(2, 3) - Same rank, increase depth', highlight: [2, 3], action: 'union', a: 2, b: 3 },
      { description: 'Connected(0, 3)? Find roots - Different sets', highlight: [0, 3], action: 'connected', a: 0, b: 3 }
    ]
  },
  minheap: {
    id: 'minheap',
    name: 'Min Heap',
    icon: 'Layers',
    category: 'heap',
    description: 'Complete binary tree where parent ≤ children. Root is minimum element. Supports O(log n) insert and extract-min.',
    timeComplexity: { insert: 'O(log n)', extractMin: 'O(log n)', peek: 'O(1)' },
    spaceComplexity: 'O(n)',
    strengths: ['Guaranteed min at root', 'O(log n) insertion and extraction', 'Complete tree structure', 'Perfect for priority queues'],
    weaknesses: ['No efficient search O(n)', 'Only partial ordering', 'Array-based with parent/child math', 'Cannot access non-root elements fast'],
    useCases: ['Priority queues (std::priority_queue)', 'Dijkstra\'s shortest path', 'Heap sort algorithm', 'K largest/smallest elements', 'Event simulation (min-time first)'],
    visualization: { type: 'heap', min: true, values: [5, 15, 25, 35, 45, 55, 65], treeStructure: true },
    codeId: 'minheap',
    animationSteps: [
      { description: 'Min heap: parent ≤ children always', highlight: ['root'], showProperty: true },
      { description: 'Insert 3 - Add at end, bubble up', highlight: [7], action: 'insert', value: 3 },
      { description: 'Bubble up: Compare with parent, swap if smaller', highlight: [7, 3, 1], action: 'bubbleUp' },
      { description: 'Extract min - Remove root, replace with last, bubble down', highlight: ['root'], action: 'extractMin' },
      { description: 'Bubble down - Compare with children, swap with smaller', highlight: [0, 1, 2], action: 'bubbleDown' }
    ]
  },
  maxheap: {
    id: 'maxheap',
    name: 'Max Heap',
    icon: 'Layers',
    category: 'heap',
    description: 'Complete binary tree where parent ≥ children. Root is maximum element. Supports O(log n) insert and extract-max.',
    timeComplexity: { insert: 'O(log n)', extractMax: 'O(log n)', peek: 'O(1)' },
    spaceComplexity: 'O(n)',
    strengths: ['Guaranteed max at root', 'O(log n) operations', 'Complete tree structure', 'Memory efficient'],
    weaknesses: ['No efficient search O(n)', 'Only partial ordering', 'Cannot access arbitrary elements', 'Array implementation required'],
    useCases: ['Priority queues (max)', 'K largest elements', 'Memory management (max-heap)', 'Job scheduling (highest priority)', 'Load balancing (max load)'],
    visualization: { type: 'heap', min: false, values: [65, 45, 55, 25, 35, 15, 5], treeStructure: true },
    codeId: 'maxheap',
    animationSteps: [
      { description: 'Max heap: parent ≥ children always', highlight: ['root'], showProperty: true },
      { description: 'Insert 70 - Add at end, bubble up', highlight: [7], action: 'insert', value: 70 },
      { description: 'Bubble up: Compare with parent, swap if larger', highlight: [7, 3, 1], action: 'bubbleUp' },
      { description: 'Extract max - Remove root, replace with last, bubble down', highlight: ['root'], action: 'extractMax' },
      { description: 'Bubble down - Compare with children, swap with larger', highlight: [0, 1, 2], action: 'bubbleDown' }
    ]
  }
};

export const ALGORITHMS = {
  bubbleSort: {
    id: 'bubbleSort',
    name: 'Bubble Sort',
    icon: 'RefreshCw',
    category: 'sorting',
    description: 'Repeatedly swaps adjacent elements if they are in wrong order. Largest element "bubbles up" to end each pass.',
    timeComplexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inplace: true,
    steps: [
      'Compare adjacent elements',
      'Swap if left > right',
      'Move to next pair',
      'Largest element reaches end',
      'Repeat for remaining unsorted portion'
    ],
    whenToUse: ['Small arrays (n < 100)', 'Nearly sorted data (O(n))', 'Educational purposes', 'Memory-constrained environments'],
    whenNotToUse: ['Large arrays (O(n²) too slow)', 'Time-critical applications', 'Production sorting needs'],
    codeId: 'bubblesort',
    animationSteps: [
      { description: 'Compare arr[0] and arr[1]', highlight: [0, 1], action: 'compare' },
      { description: 'Swap if arr[0] > arr[1]', highlight: [0, 1], action: 'swap' },
      { description: 'Compare arr[1] and arr[2]', highlight: [1, 2], action: 'compare' },
      { description: 'Largest element 9 reaches end', highlight: [4], action: 'bubble' },
      { description: 'Next pass: compare first 4 elements', highlight: [0, 1, 2, 3], action: 'pass' }
    ]
  },
  selectionSort: {
    id: 'selectionSort',
    name: 'Selection Sort',
    icon: 'RefreshCw',
    category: 'sorting',
    description: 'Finds minimum element in unsorted portion and places it at beginning. Repeats for each position.',
    timeComplexity: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: false,
    inplace: true,
    steps: [
      'Find minimum in unsorted portion',
      'Swap with first unsorted element',
      'Move boundary right',
      'Repeat for remaining'
    ],
    whenToUse: ['Memory-constrained (O(1) space)', 'Swaps are expensive', 'Small to medium datasets'],
    whenNotToUse: ['Large arrays (O(n²))', 'Stable sort required'],
    codeId: 'selectionsort',
    animationSteps: [
      { description: 'Find minimum in arr[0..4]', highlight: [0, 1, 2, 3, 4], action: 'findMin' },
      { description: 'Minimum 1 found at index 3', highlight: [3], showMin: true },
      { description: 'Swap arr[0] with arr[3]', highlight: [0, 3], action: 'swap' },
      { description: 'Find minimum in arr[1..4]', highlight: [1, 2, 3, 4], action: 'findMin' },
      { description: 'Sorted portion grows from left', highlight: [0, 1], showSorted: true }
    ]
  },
  insertionSort: {
    id: 'insertionSort',
    name: 'Insertion Sort',
    icon: 'RefreshCw',
    category: 'sorting',
    description: 'Builds sorted array one element at a time by inserting each element into its correct position.',
    timeComplexity: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' },
    spaceComplexity: 'O(1)',
    stable: true,
    inplace: true,
    steps: [
      'Take first unsorted element',
      'Compare with sorted elements',
      'Shift larger elements right',
      'Insert in correct position'
    ],
    whenToUse: ['Small arrays', 'Nearly sorted data (O(n))', 'Online/streaming data', 'Real-time systems'],
    whenNotToUse: ['Large unsorted arrays', 'Multiple insertions needed'],
    codeId: 'insertionsort',
    animationSteps: [
      { description: 'First element is sorted', highlight: [0], showSorted: true },
      { description: 'Take 3, compare with sorted elements', highlight: [1], action: 'key' },
      { description: 'Shift 5 right to make space', highlight: [1, 2], action: 'shift' },
      { description: 'Insert 3 at position 0', highlight: [0], action: 'insert' },
      { description: 'Next element 1, repeat process', highlight: [2], action: 'key' }
    ]
  },
  mergeSort: {
    id: 'mergeSort',
    name: 'Merge Sort',
    icon: 'RefreshCw',
    category: 'sorting',
    description: 'Divide and conquer algorithm: split array, recursively sort halves, merge sorted halves.',
    timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' },
    spaceComplexity: 'O(n)',
    stable: true,
    inplace: false,
    steps: [
      'Divide array in two halves',
      'Recursively sort each half',
      'Merge sorted halves by comparing'
    ],
    whenToUse: ['Large arrays', 'Stable sort required', 'Linked lists (O(1) extra space)', 'External sorting (disk)'],
    whenNotToUse: ['Memory-constrained (O(n) space)', 'In-place required'],
    codeId: 'mergesort',
    animationSteps: [
      { description: 'Divide: [5, 2, 8, 1] → [5, 2], [8, 1]', highlight: ['all'], action: 'divide' },
      { description: 'Divide again: [5] [2] [8] [1]', highlight: ['all'], action: 'divide' },
      { description: 'Merge [5] and [2] → [2, 5]', highlight: [0, 1], action: 'merge' },
      { description: 'Merge [8] and [1] → [1, 8]', highlight: [2, 3], action: 'merge' },
      { description: 'Final merge [2, 5] and [1, 8] → [1, 2, 5, 8]', highlight: ['all'], action: 'merge' }
    ]
  },
  quickSort: {
    id: 'quickSort',
    name: 'Quick Sort',
    icon: 'RefreshCw',
    category: 'sorting',
    description: 'Pick pivot, partition array around pivot, recursively sort partitions. Average O(n log n), worst O(n²).',
    timeComplexity: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' },
    spaceComplexity: 'O(log n)',
    stable: false,
    inplace: true,
    steps: [
      'Choose pivot element',
      'Partition: elements < pivot left, > pivot right',
      'Recursively sort left partition',
      'Recursively sort right partition'
    ],
    whenToUse: ['General purpose sorting', 'In-memory sorting', 'Average case performance matters'],
    whenNotToUse: ['Worst-case critical (use heap sort)', 'Stable sort required', 'Small arrays (insertion sort better)'],
    codeId: 'quicksort',
    animationSteps: [
      { description: 'Choose pivot (last element: 3)', highlight: [3], action: 'pivot' },
      { description: 'Partition: elements < 3 to left, > 3 to right', highlight: [0, 1, 2, 3], action: 'partition' },
      { description: 'Swap 1 into correct position', highlight: [0, 2], action: 'swap' },
      { description: 'Pivot in correct final position', highlight: [1], showPivotPos: true },
      { description: 'Recursively sort left and right partitions', highlight: [0, 2], action: 'recurse' }
    ]
  },
  heapSort: {
    id: 'heapSort',
    name: 'Heap Sort',
    icon: 'RefreshCw',
    category: 'sorting',
    description: 'Build max heap, repeatedly extract maximum and place at end. O(n log n) worst case.',
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
    whenToUse: ['Memory-constrained (O(1) space)', 'Guaranteed O(n log n) worst case', 'In-place sorting'],
    whenNotToUse: ['Stable sort required', 'Partial sorting (heap not ideal)'],
    codeId: 'heapsort',
    animationSteps: [
      { description: 'Build max heap: heapify from bottom up', highlight: ['all'], action: 'heapify' },
      { description: 'Root (9) is max - swap with last (1)', highlight: [0, 3], action: 'swap' },
      { description: 'Sorted portion grows from end', highlight: [3], showSorted: true },
      { description: 'Heapify root with reduced size', highlight: [0], action: 'heapify' },
      { description: 'Repeat until all sorted', highlight: ['all'], showSorted: true }
    ]
  },
  binarySearch: {
    id: 'binarySearch',
    name: 'Binary Search',
    icon: 'Search',
    category: 'searching',
    description: 'Divides sorted array in half each step. O(log n) search on sorted data.',
    timeComplexity: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' },
    spaceComplexity: 'O(1)',
    steps: [
      'Find middle element',
      'Compare with target',
      'If less, search left half',
      'If greater, search right half',
      'Repeat until found or exhausted'
    ],
    whenToUse: ['Sorted arrays', 'Large datasets', 'Static data (no insertions)'],
    whenNotToUse: ['Unsorted data', 'Linked lists (no random access)', 'Frequent insertions/deletions'],
    codeId: 'binarysearch',
    animationSteps: [
      { description: 'Sorted array: [1, 3, 5, 7, 9, 11, 13, 15]', highlight: ['all'], showArray: true },
      { description: 'Target = 9, left=0, right=7, mid=3', highlight: [3], action: 'mid' },
      { description: 'arr[3]=7 < 9, left=4', highlight: [4, 5, 6, 7], action: 'left' },
      { description: 'mid=5, arr[5]=11 > 9, right=4', highlight: [4], action: 'right' },
      { description: 'mid=4, arr[4]=9 == 9, Found!', highlight: [4], action: 'found' }
    ]
  },
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search',
    icon: 'Network',
    category: 'graph',
    description: 'Explores all neighbors at current depth before moving deeper. Uses queue. Finds shortest path in unweighted graphs.',
    timeComplexity: { time: 'O(V + E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    steps: [
      'Start from source node',
      'Visit all neighbors first (queue)',
      'Mark visited to avoid cycles',
      'Process queue level by level'
    ],
    whenToUse: ['Shortest path (unweighted)', 'Level-order traversal', 'Finding connected components'],
    whenNotToUse: ['Deep graphs (memory)', 'Weighted shortest path (use Dijkstra)'],
    codeId: 'bfs',
    animationSteps: [
      { description: 'Start BFS from A', highlight: ['A'], action: 'start' },
      { description: 'Visit neighbors B, C, D', highlight: ['B', 'C', 'D'], action: 'visit' },
      { description: 'Enqueue all unvisited neighbors', highlight: ['queue'], showQueue: true },
      { description: 'Process B: neighbors E, F', highlight: ['E', 'F'], action: 'visit' },
      { description: 'Level 2 complete, all nodes visited', highlight: ['all'], action: 'complete' }
    ]
  },
  dfs: {
    id: 'dfs',
    name: 'Depth-First Search',
    icon: 'Network',
    category: 'graph',
    description: 'Explores as far as possible before backtracking. Uses stack or recursion. Good for cycle detection and path finding.',
    timeComplexity: { time: 'O(V + E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    steps: [
      'Start from source node',
      'Visit deepest path first',
      'Backtrack when dead end',
      'Mark visited to avoid cycles'
    ],
    whenToUse: ['Path finding', 'Cycle detection', 'Topological sort', 'Maze solving'],
    whenNotToUse: ['Shortest path (BFS better)', 'Level-order needed'],
    codeId: 'dfs',
    animationSteps: [
      { description: 'Start DFS from A', highlight: ['A'], action: 'start' },
      { description: 'Go deep to B', highlight: ['B'], action: 'visit' },
      { description: 'Continue to D (depth first)', highlight: ['D'], action: 'visit' },
      { description: 'Dead end, backtrack to B', highlight: ['B'], action: 'backtrack' },
      { description: 'Visit E, backtrack to A, visit C', highlight: ['A', 'B', 'D', 'E', 'C'], action: 'complete' }
    ]
  },
  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    icon: 'Network',
    category: 'graph',
    description: 'Finds shortest path from source to all nodes in weighted graph with non-negative edges. Uses priority queue.',
    timeComplexity: { time: 'O(E + V log V)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    steps: [
      'Initialize distances as infinity',
      'Set source distance to 0',
      'Use priority queue for min distance',
      'Relax all edges from current node',
      'Repeat until all nodes processed'
    ],
    whenToUse: ['GPS navigation', 'Network routing', 'Game pathfinding', 'Non-negative weights only'],
    whenNotToUse: ['Negative edge weights (use Bellman-Ford)', 'All-pairs shortest (use Floyd-Warshall)'],
    codeId: 'dijkstra',
    animationSteps: [
      { description: 'Initialize distances: A=0, others=∞', highlight: ['A'], action: 'init' },
      { description: 'Process A, relax edges to B(4), C(2)', highlight: ['B', 'C'], action: 'relax' },
      { description: 'Process C (min distance 2), relax A→B→C→E', highlight: ['C', 'E'], action: 'relax' },
      { description: 'Process B (distance 4), relax B→D(5), B→E(10)', highlight: ['D'], action: 'relax' },
      { description: 'Final shortest paths: A→B=4, A→C=2, A→D=9, A→E=3', highlight: ['all'], action: 'complete' }
    ]
  },
  aStar: {
    id: 'aStar',
    name: 'A* Search',
    icon: 'Network',
    category: 'graph',
    description: 'Informed search using heuristic. Finds shortest path efficiently. f(n) = g(n) + h(n).',
    timeComplexity: { time: 'O(E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    steps: [
      'Calculate f = g + h for each node',
      'g = cost from start',
      'h = heuristic estimate to goal',
      'Choose lowest f(n) to explore',
      'Repeat until goal reached'
    ],
    whenToUse: ['Games and pathfinding', 'Maps and navigation', 'Puzzle solving (8-puzzle)', 'When admissible heuristic exists'],
    whenNotToUse: ['No admissible heuristic', 'Infinite state space', 'All pairs needed'],
    codeId: 'astar',
    animationSteps: [
      { description: 'f(n) = g(n) + h(n) where h is heuristic', highlight: ['all'], formula: true },
      { description: 'A: g=0, h=6, f=6', highlight: ['A'], action: 'calculate' },
      { description: 'B: g=4, h=3, f=7 | C: g=2, h=4, f=6', highlight: ['B', 'C'], action: 'calculate' },
      { description: 'C has lower f=6, explore C first', highlight: ['C'], action: 'select' },
      { description: 'Heuristic guides exploration efficiently', highlight: ['path'], action: 'complete' }
    ]
  },
  prim: {
    id: 'prim',
    name: "Prim's Algorithm",
    icon: 'Network',
    category: 'graph',
    description: 'Greedy MST algorithm. Grows tree one edge at a time, always adding cheapest edge connecting tree to outside.',
    timeComplexity: { time: 'O(E + V log V)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    steps: [
      'Start with arbitrary node',
      'Add cheapest edge connecting tree to outside',
      'Repeat until all nodes included'
    ],
    whenToUse: ['Network design', 'Clustering', 'Image segmentation', 'Dense graphs'],
    whenNotToUse: ['Disconnected graphs', 'Need rooted tree'],
    codeId: 'prim',
    animationSteps: [
      { description: 'Start MST with node A', highlight: ['A'], action: 'start' },
      { description: 'Cheapest edge from A: A→B (1)', highlight: ['A', 'B'], action: 'add' },
      { description: 'Cheapest edge from {A,B}: B→C (2)', highlight: ['B', 'C'], action: 'add' },
      { description: 'Cheapest edge from {A,B,C}: B→D (3)', highlight: ['B', 'D'], action: 'add' },
      { description: 'MST complete: edges A-B, B-C, B-D', highlight: ['all'], action: 'complete' }
    ]
  },
  kruskal: {
    id: 'kruskal',
    name: "Kruskal's Algorithm",
    icon: 'Network',
    category: 'graph',
    description: 'Greedy MST algorithm. Sorts all edges by weight and adds cheapest edge that does not form a cycle.',
    timeComplexity: { time: 'O(E log E)', space: 'O(V)' },
    spaceComplexity: 'O(V)',
    steps: [
      'Sort all edges by weight',
      'Add cheapest edge if no cycle (Union-Find)',
      'Repeat until V-1 edges'
    ],
    whenToUse: ['Sparse graphs', 'Network design', 'Clustering', 'Efficient for edges << vertices'],
    whenNotToUse: ['Dense graphs (Prim better)', 'Need rooted tree'],
    codeId: 'kruskal',
    animationSteps: [
      { description: 'Sort edges by weight: (1,2,3,4,5)', highlight: ['all'], action: 'sort' },
      { description: 'Add edge A-B (1), no cycle', highlight: ['A', 'B'], action: 'add' },
      { description: 'Add edge C-E (2), no cycle', highlight: ['C', 'E'], action: 'add' },
      { description: 'Add edge B-D (3), no cycle', highlight: ['B', 'D'], action: 'add' },
      { description: 'MST complete: edges (1,2,3) connect all nodes', highlight: ['all'], action: 'complete' }
    ]
  },
  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci (DP)',
    icon: 'Brain',
    category: 'dp',
    description: 'Dynamic programming solution for Fibonacci. Memoization or bottom-up to avoid exponential recalculation.',
    timeComplexity: { recursive: 'O(2ⁿ)', dp: 'O(n)', spaceOpt: 'O(n) → O(1)' },
    spaceComplexity: 'O(n)',
    formula: 'F(n) = F(n-1) + F(n-2)',
    steps: [
      'Identify overlapping subproblems',
      'Store results in memo/cache',
      'Build up from base cases',
      'Return final result'
    ],
    whenToUse: ['Overlapping subproblems', 'Optimal substructure', 'Sequential decisions'],
    whenNotToUse: ['No overlap', 'No optimal substructure'],
    codeId: 'fibonacci',
    animationSteps: [
      { description: 'Recursive: exponential calls (2^n)', highlight: ['all'], showRecursive: true },
      { description: 'Memo: store F(2), F(3), F(4) after compute', highlight: [2, 3, 4], action: 'memoize' },
      { description: 'F(4) lookup: F(3)+F(2) from cache', highlight: [3, 2], action: 'lookup' },
      { description: 'Bottom-up: compute from 0 to n', highlight: [0, 1, 2, 3, 4], action: 'bottomup' },
      { description: 'Space optimized: only need last two values', highlight: [3, 4], action: 'optimize' }
    ]
  },
  knapsack: {
    id: 'knapsack',
    name: '0/1 Knapsack',
    icon: 'Brain',
    category: 'dp',
    description: 'Maximize value with weight constraint. Each item can be taken or not. Classic DP problem.',
    timeComplexity: { time: 'O(nW)', space: 'O(nW)' },
    spaceComplexity: 'O(nW)',
    formula: 'dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])',
    steps: [
      'Create DP table (n+1) × (W+1)',
      'Fill table bottom-up',
      'Consider including/excluding each item',
      'Return dp[n][W]'
    ],
    whenToUse: ['Resource allocation', 'Budget optimization', 'Selection problems', 'Combinatorial optimization'],
    whenNotToUse: ['Unbounded knapsack', 'Multiple constraints', 'Large W values'],
    codeId: 'knapsack',
    animationSteps: [
      { description: 'DP table 4×8 for items=4, capacity=7', highlight: ['all'], showTable: true },
      { description: 'Item 1 (wt=2, val=3): fill column 2-7', highlight: [1], action: 'fill' },
      { description: 'Item 2 (wt=3, val=4): max(exclude, include)', highlight: [2], action: 'fill' },
      { description: 'Item 3 (wt=4, val=5): fill column 4-7', highlight: [3], action: 'fill' },
      { description: 'Backtrack to find items in optimal solution', highlight: ['all'], action: 'backtrack' }
    ]
  }
};

export const DISTRIBUTED_PATTERNS = {
  ratelimiter: {
    id: 'ratelimiter',
    name: 'Rate Limiter',
    icon: 'Zap',
    category: 'resilience',
    description: 'Controls request rate to prevent abuse and ensure fair usage. Essential for API protection.',
    algorithms: [
      { name: 'Token Bucket', desc: 'Tokens added at fixed rate, requests consume tokens' },
      { name: 'Leaky Bucket', desc: 'Requests processed at fixed rate, excess queued or dropped' },
      { name: 'Fixed Window', desc: 'Count requests per time window, reset at boundary' },
      { name: 'Sliding Window', desc: 'Rolling time window for more accurate counting' }
    ],
    metrics: ['Requests per second', 'Tokens remaining', 'Wait time'],
    useCases: ['API protection', 'DDOS prevention', 'Fair sharing between clients'],
    configuration: { capacity: 100, refillRate: 10, windowSize: 60 },
    codeId: 'ratelimiter',
    animationSteps: [
      { description: 'Token bucket with capacity 10', highlight: ['bucket'], showTokens: true },
      { description: 'Tokens refill at rate 1/second', highlight: ['bucket'], action: 'refill' },
      { description: 'Request arrives, consumes 1 token', highlight: ['bucket'], action: 'consume' },
      { description: 'No tokens: request denied (429)', highlight: ['bucket'], action: 'deny' },
      { description: 'Time passes, tokens accumulate', highlight: ['bucket'], action: 'refill' }
    ]
  },
  circuitbreaker: {
    id: 'circuitbreaker',
    name: 'Circuit Breaker',
    icon: 'Shield',
    category: 'resilience',
    description: 'Prevents cascade failures by failing fast when service is unhealthy. Has CLOSED, OPEN, HALF_OPEN states.',
    states: [
      { name: 'CLOSED', desc: 'Normal operation, requests pass through' },
      { name: 'OPEN', desc: 'Fail fast, no requests to failing service' },
      { name: 'HALF_OPEN', desc: 'Test recovery, limited requests allowed' }
    ],
    thresholds: { failureCount: 5, timeout: 30000, successThreshold: 3 },
    useCases: ['Microservices', 'External API calls', 'Database connections', 'Third-party services'],
    codeId: 'circuitbreaker',
    animationSteps: [
      { description: 'CLOSED: Normal operation, count=0', highlight: ['closed'], showState: true },
      { description: 'Request fails, increment failure count', highlight: ['counter'], action: 'fail' },
      { description: 'Failure count reaches threshold', highlight: ['threshold'], action: 'open' },
      { description: 'OPEN: Fail fast for timeout period', highlight: ['open'], showState: true },
      { description: 'HALF_OPEN: Allow limited requests to test recovery', highlight: ['halfopen'], action: 'test' }
    ]
  },
  distributedlock: {
    id: 'distributedlock',
    name: 'Distributed Lock',
    icon: 'Lock',
    category: 'coordination',
    description: 'Mutual exclusion across distributed systems for resource access. Prevents concurrent access.',
    implementation: [
      { method: 'Database', desc: 'Row lock or advisory lock in database' },
      { method: 'Redis', desc: 'SET NX with expiration (Redlock)' },
      { method: 'ZooKeeper', desc: 'Ephemeral sequential nodes' },
      { method: 'Chubby', desc: 'Paxos-based lock service' }
    ],
    properties: ['Mutual exclusion', 'No deadlock', 'Fault tolerance', 'Liveness'],
    challenges: ['Clock skew', 'Network partitions', 'Lock lifetime management'],
    useCases: ['Leader election', 'Resource serialization', 'Exclusive access control', 'Atomic operations'],
    codeId: 'distributedlock',
    animationSteps: [
      { description: 'Server A acquires lock (SET NX)', highlight: ['A'], action: 'acquire' },
      { description: 'Server B tries lock, fails (already held)', highlight: ['B'], action: 'try' },
      { description: 'Server A releases lock (DEL)', highlight: ['A'], action: 'release' },
      { description: 'Server B acquires lock', highlight: ['B'], action: 'acquire' },
      { description: 'Lock with TTL prevents deadlocks', highlight: ['ttl'], showTTL: true }
    ]
  },
  loadbalancer: {
    id: 'loadbalancer',
    name: 'Load Balancer',
    icon: 'Globe',
    category: 'distribution',
    description: 'Distributes incoming requests across multiple servers for scalability and reliability.',
    algorithms: [
      { name: 'Round Robin', desc: 'Sequentially distribute to each server' },
      { name: 'Least Connections', desc: 'Send to server with fewest connections' },
      { name: 'Weighted', desc: 'Based on server capacity' },
      { name: 'IP Hash', desc: 'Same client to same server (sticky)' },
      { name: 'Least Response Time', desc: 'Fastest responding server' }
    ],
    types: ['Layer 4 (TCP)', 'Layer 7 (HTTP)', 'Global Server LB', 'Regional LB'],
    healthChecks: ['TCP handshake', 'HTTP endpoint', 'Custom check interval'],
    useCases: ['High availability', 'Horizontal scaling', 'Fault tolerance', 'Zero-downtime deployments'],
    codeId: 'loadbalancer',
    animationSteps: [
      { description: 'Request 1: Round robin to Server 1', highlight: ['lb', 's1'], action: 'route' },
      { description: 'Request 2: Round robin to Server 2', highlight: ['lb', 's2'], action: 'route' },
      { description: 'Request 3: Round robin to Server 3', highlight: ['lb', 's3'], action: 'route' },
      { description: 'Server 2 health check fails', highlight: ['s2'], action: 'healthFail' },
      { description: 'Server 2 removed from pool', highlight: ['lb'], action: 'remove' }
    ]
  },
  cachingsharding: {
    id: 'cachingsharding',
    name: 'Cache Sharding',
    icon: 'Database',
    category: 'performance',
    description: 'Partition cache data across multiple nodes for horizontal scaling and reduced hotspots.',
    strategies: [
      { name: 'Key Hashing', desc: 'Hash key to determine shard' },
      { name: 'Consistent Hashing', desc: 'Minimal redistribution on shard changes' },
      { name: 'Range Sharding', desc: 'Key ranges assigned to shards' },
      { name: 'Geo-Sharding', desc: 'Location-based distribution' }
    ],
    considerations: ['Hot keys', 'Uneven distribution', 'Shard failure handling', 'Rebalancing cost'],
    useCases: ['Distributed cache clusters', 'Session storage', 'API response cache', 'Database query cache'],
    codeId: 'cachingsharding',
    animationSteps: [
      { description: 'Key "user:12345" hashes to shard 2', highlight: ['all'], action: 'hash' },
      { description: 'Consistent hash ring placement', highlight: ['ring'], showRing: true },
      { description: 'Shard 3 added, minimal redistribution', highlight: ['ring'], action: 'addShard' },
      { description: 'Shard 2 fails, keys redistribute', highlight: ['ring'], action: 'failShard' },
      { description: 'Virtual nodes for better distribution', highlight: ['vnodes'], showVNodes: true }
    ]
  },
  messagedqueue: {
    id: 'messagedqueue',
    name: 'Message Queue',
    icon: 'Network',
    category: 'async',
    description: 'Asynchronous communication between services via queued messages. Enables decoupling.',
    patterns: [
      { name: 'Point-to-Point', desc: 'One producer, one consumer (work queues)' },
      { name: 'Publish/Subscribe', desc: 'One producer, multiple consumers (topics)' },
      { name: 'Request/Reply', desc: 'Synchronous over async' },
      { name: 'Fan-out/Fan-in', desc: 'Split and combine workflows' }
    ],
    guarantees: ['At-least-once delivery', 'At-most-once delivery', 'Exactly-once semantics'],
    useCases: ['Async processing', 'Event sourcing', 'Service decoupling', 'Buffering/Load leveling'],
    codeId: 'messagedqueue',
    animationSteps: [
      { description: 'Producer publishes message to queue', highlight: ['producer'], action: 'publish' },
      { description: 'Message stored in durable queue', highlight: ['queue'], showMessage: true },
      { description: 'Consumer 1 pulls message', highlight: ['consumer1'], action: 'consume' },
      { description: 'Consumer 2 subscribes to topic', highlight: ['consumer2'], action: 'subscribe' },
      { description: 'Acknowledgement after processing', highlight: ['consumer1'], action: 'ack' }
    ]
  }
};
