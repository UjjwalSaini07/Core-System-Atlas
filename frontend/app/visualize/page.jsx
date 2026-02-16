'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Network, Database, GitBranch, Layers, TreePine, 
  ArrowLeft, Play, Pause, RotateCcw, Settings,
  BarChart2, Info, ChevronRight, ChevronDown,
  Search, Zap, Target, ArrowRight, ArrowUp, ArrowDown,
  BookOpen, HelpCircle, CheckCircle, RefreshCw, 
  Hash, Key, Map, Cpu, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DSACATEGORIES = [
  { id: 'heap', name: 'Heap', icon: Layers, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Complete binary tree with heap property' },
  { id: 'segment', name: 'Segment Tree', icon: Database, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Range queries on static arrays' },
  { id: 'bit', name: 'Binary Indexed Tree', icon: Database, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Efficient prefix sum queries' },
  { id: 'graph', name: 'Graph', icon: Network, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Nodes connected by edges' },
  { id: 'unionfind', name: 'Union-Find', icon: GitBranch, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Disjoint set data structure' },
  { id: 'trie', name: 'Trie', icon: TreePine, color: 'text-emerald-600', bg: 'bg-emerald-100', description: 'Prefix tree for string operations' },
  { id: 'lru', name: 'LRU Cache', icon: Cpu, color: 'text-purple-600', bg: 'bg-purple-100', description: 'Least Recently Used cache' },
  { id: 'hash', name: 'Hash Table', icon: Hash, color: 'text-amber-600', bg: 'bg-amber-100', description: 'Key-value storage with O(1) access' },
  { id: 'avl', name: 'AVL Tree', icon: Network, color: 'text-rose-600', bg: 'bg-rose-100', description: 'Self-balancing BST' },
];

const ALGORITHMS = {
  heap: [
    { id: 'insert', name: 'Insert', complexity: 'O(log n)', desc: 'Add element to heap', steps: ['Add to end', 'Bubble up', 'Heapify'] },
    { id: 'extract', name: 'Extract Max', complexity: 'O(log n)', desc: 'Remove and return max', steps: ['Swap root with last', 'Remove last', 'Bubble down'] },
    { id: 'heapsort', name: 'Heap Sort', complexity: 'O(n log n)', desc: 'In-place sorting', steps: ['Build max heap', 'Swap root to end', 'Heapify reduced'] }
  ],
  segment: [
    { id: 'rangeSum', name: 'Range Sum', complexity: 'O(log n)', desc: 'Query sum in range', steps: ['Split query', 'Traverse tree', 'Combine results'] },
    { id: 'rangeMin', name: 'Range Min', complexity: 'O(log n)', desc: 'Query min in range', steps: ['Split query', 'Traverse tree', 'Return min'] }
  ],
  bit: [
    { id: 'prefix', name: 'Prefix Sum', complexity: 'O(log n)', desc: 'Sum from 1 to i', steps: ['Start at i', 'Add tree[i]', 'Move to parent'] },
    { id: 'range', name: 'Range Sum', complexity: 'O(log n)', desc: 'Sum in [l, r]', steps: ['Prefix(r)', 'Prefix(l-1)', 'Subtract'] },
    { id: 'update', name: 'Update', complexity: 'O(log n)', desc: 'Add value at index', steps: ['Start at index', 'Update tree[i]', 'Move to parent'] }
  ],
  graph: [
    { id: 'bfs', name: 'BFS', complexity: 'O(V + E)', desc: 'Level-order traversal', steps: ['Enqueue start', 'Visit neighbors', 'Mark visited', 'Dequeue'] },
    { id: 'dfs', name: 'DFS', complexity: 'O(V + E)', desc: 'Depth-first traversal', steps: ['Push start', 'Visit neighbor', 'Backtrack', 'Continue'] },
    { id: 'dijkstra', name: "Dijkstra's", complexity: 'O(E log V)', desc: 'Shortest path', steps: ['Initialize distances', 'Select min', 'Relax edges', 'Update distances'] },
    { id: 'topo', name: 'Topological Sort', complexity: 'O(V + E)', desc: 'DAG ordering', steps: ['Find in-degree', 'Enqueue zeros', 'Remove edges', 'Build order'] }
  ],
  unionfind: [
    { id: 'find', name: 'Find', complexity: 'α(n)', desc: 'Find root node', steps: ['Follow parent', 'Path compression', 'Return root'] },
    { id: 'union', name: 'Union', complexity: 'α(n)', desc: 'Merge two sets', steps: ['Find roots', 'Rank comparison', 'Link roots'] },
    { id: 'components', name: 'Components', complexity: 'O(N + E)', desc: 'Count components', steps: ['Initialize sets', 'Process edges', 'Count roots'] }
  ],
  trie: [
    { id: 'insert', name: 'Insert Word', complexity: 'O(m)', desc: 'Add word to trie', steps: ['Traverse/create', 'Mark end node', 'Update count'] },
    { id: 'search', name: 'Search Word', complexity: 'O(m)', desc: 'Find word in trie', steps: ['Follow characters', 'Check end marker', 'Return result'] },
    { id: 'autocomplete', name: 'Auto Complete', complexity: 'O(m + k)', desc: 'Suggest prefixes', steps: ['Find prefix', 'DFS traversal', 'Collect words'] }
  ],
  lru: [
    { id: 'get', name: 'Get', complexity: 'O(1)', desc: 'Retrieve item', steps: ['Hash lookup', 'Move to front', 'Return value'] },
    { id: 'put', name: 'Put', complexity: 'O(1)', desc: 'Store item', steps: ['Hash lookup', 'Add/update', 'Evict if needed', 'Update head/tail'] }
  ],
  hash: [
    { id: 'insert', name: 'Insert', complexity: 'O(1) avg', desc: 'Add key-value', steps: ['Hash function', 'Find bucket', 'Add/update', 'Handle collision'] },
    { id: 'search', name: 'Search', complexity: 'O(1) avg', desc: 'Find key', steps: ['Hash key', 'Find bucket', 'Linear search', 'Return value'] },
    { id: 'delete', name: 'Delete', complexity: 'O(1) avg', desc: 'Remove key', steps: ['Hash key', 'Find bucket', 'Remove entry', 'Rehash if needed'] }
  ],
  avl: [
    { id: 'insert', name: 'Insert', complexity: 'O(log n)', desc: 'Add node', steps: ['BST insert', 'Check balance', 'Rotate if needed', 'Update height'] },
    { id: 'search', name: 'Search', complexity: 'O(log n)', desc: 'Find node', steps: ['Compare values', 'Left/right move', 'Return if found'] },
    { id: 'rotatelr', name: 'Left Rotate', complexity: 'O(1)', desc: 'Fix balance', steps: ['Identify imbalance', 'Perform rotation', 'Update pointers', 'Fix heights'] }
  ]
};

export default function VisualizePage() {
  const [activeCategory, setActiveCategory] = useState('heap');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [step, setStep] = useState(0);
  const [data, setData] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [comparisons, setComparisons] = useState(0);
  const [operations, setOperations] = useState(0);
  const [showDetails, setShowDetails] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [animationQueue, setAnimationQueue] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [foundIndex, setFoundIndex] = useState(null);
  const [targetRange, setTargetRange] = useState({ start: 0, end: 0 });
  const [swapHistory, setSwapHistory] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [userInput, setUserInput] = useState('');
  const [secondaryInput, setSecondaryInput] = useState('');
  const [lruData, setLruData] = useState({});
  const [trieData, setTrieData] = useState({});
  const [hashData, setHashData] = useState([]);
  const [avlData, setAvlData] = useState([]);
  
  const currentAlgorithms = ALGORITHMS[activeCategory] || [];
  const category = DSACATEGORIES.find(c => c.id === activeCategory);

  const generateData = useCallback(() => {
    const size = activeCategory === 'segment' || activeCategory === 'bit' ? 16 : 
                 activeCategory === 'heap' ? 15 : 8;
    const newData = [];
    for (let i = 0; i < size; i++) {
      newData.push(Math.floor(Math.random() * 50) + 10);
    }
    setData(newData);
    setStep(0);
    setHighlights([]);
    setComparisons(0);
    setOperations(0);
    setAnimationQueue([]);
    setCurrentMessage('');
    setFoundIndex(null);
    setSwapHistory([]);
    setSearchValue('');
    setUserInput('');
    setSecondaryInput('');
    setIsPlaying(false);
    setCurrentStepIndex(0);
    
    // Initialize data structures
    if (activeCategory === 'lru') {
      setLruData({ cache: [], capacity: 5 });
    }
    if (activeCategory === 'trie') {
      setTrieData({ root: { children: {}, isEnd: false, count: 0 }, words: [] });
    }
    if (activeCategory === 'hash') {
      setHashData(Array(10).fill(null).map((_, i) => ({ key: i, value: null, occupied: false })));
    }
    if (activeCategory === 'avl') {
      setAvlData([30, 20, 40, 10, 25, 35, 50]);
    }
  }, [activeCategory]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  useEffect(() => {
    if (isPlaying && animationQueue.length > 0) {
      const interval = setInterval(() => {
        setAnimationQueue(prev => {
          if (prev.length === 0) {
            setIsPlaying(false);
            return prev;
          }
          const [next, ...rest] = prev;
          applyAnimationStep(next);
          return rest;
        });
      }, 1200 / speed);
      return () => clearInterval(interval);
    }
  }, [isPlaying, speed, animationQueue]);

  const applyAnimationStep = (stepData) => {
    if (stepData.type === 'highlight') {
      setHighlights(stepData.indices);
      setComparisons(prev => prev + (stepData.comparisons || 0));
      setCurrentStepIndex(prev => prev + 1);
    } else if (stepData.type === 'found') {
      setHighlights(stepData.indices);
      setFoundIndex(stepData.index);
      setCurrentMessage(stepData.message);
      setOperations(prev => prev + 1);
    } else if (stepData.type === 'swap') {
      const newData = [...data];
      const temp = newData[stepData.i];
      newData[stepData.i] = newData[stepData.j];
      newData[stepData.j] = temp;
      setData(newData);
      setSwapHistory(prev => [...prev, { i: stepData.i, j: stepData.j }]);
      setOperations(prev => prev + 1);
      setCurrentStepIndex(prev => prev + 1);
    } else if (stepData.type === 'message') {
      setCurrentMessage(stepData.message);
      setCurrentStepIndex(prev => prev + 1);
    } else if (stepData.type === 'range') {
      setTargetRange(stepData.range);
      setHighlights(stepData.indices || []);
    } else if (stepData.type === 'setdata') {
      setData(stepData.values);
    } else if (stepData.type === 'setlru') {
      setLruData(stepData.data);
    } else if (stepData.type === 'settrie') {
      setTrieData(stepData.data);
    } else if (stepData.type === 'sethash') {
      setHashData(stepData.data);
    } else if (stepData.type === 'setavl') {
      setAvlData(stepData.data);
    }
  };

  // Tutorial content
  const getTutorialContent = () => {
    const tutorials = {
      heap: {
        title: 'Understanding Heaps',
        concept: 'A Heap is a complete binary tree where every parent node satisfies the heap property.',
        property: 'Max Heap: Parent ≥ Children | Min Heap: Parent ≤ Children',
        uses: ['Priority Queues', 'Heap Sort', 'Dijkstra\'s Algorithm', 'Memory Management'],
        howItWorks: [
          { step: 1, title: 'Complete Tree', desc: 'All levels filled left to right. Stored as array!' },
          { step: 2, title: 'Array Storage', desc: 'Node i: Left=2i+1, Right=2i+2, Parent=(i-1)/2' },
          { step: 3, title: 'Heapify', desc: 'Restore heap property after changes' }
        ]
      },
      segment: {
        title: 'Segment Trees',
        concept: 'A Segment Tree is a binary tree for storing array intervals and answering range queries.',
        property: 'Each node stores aggregate (sum/min/max) of its segment.',
        uses: ['Range Queries', 'Range Updates', 'Statistics', 'Competitive Programming'],
        howItWorks: [
          { step: 1, title: 'Structure', desc: 'O(log n) height. Leaf nodes store array elements.' },
          { step: 2, title: 'Query', desc: 'Decompose [l, r] into O(log n) segments' },
          { step: 3, title: 'Combine', desc: 'Merge results from relevant nodes' }
        ]
      },
      bit: {
        title: 'Binary Indexed Trees',
        concept: 'Also called Fenwick Tree, it enables efficient prefix sums and point updates.',
        property: 'Tree[i] stores sum of range [(i - (i & -i)) + 1, i]',
        uses: ['Prefix Sums', 'Frequency Tables', 'Cumulative Counts', 'Order Statistics'],
        howItWorks: [
          { step: 1, title: 'Key Insight', desc: 'Can represent any prefix as sum of O(log n) ranges' },
          { step: 2, title: 'Prefix Query', desc: 'Add tree[i], move i -= i & -i' },
          { step: 3, title: 'Update', desc: 'Update tree[i], move i += i & -i' }
        ]
      },
      graph: {
        title: 'Graph Algorithms',
        concept: 'Graphs consist of vertices (nodes) connected by edges. Can be directed or undirected.',
        property: 'BFS = Queue (level-order) | DFS = Stack (depth-first)',
        uses: ['Social Networks', 'Route Finding', 'Web Crawlers', 'Network Routing'],
        howItWorks: [
          { step: 1, title: 'BFS', desc: 'Visit all neighbors at current distance before moving further.' },
          { step: 2, title: 'DFS', desc: 'Go as deep as possible before backtracking.' },
          { step: 3, title: 'Dijkstra', desc: 'Find shortest path using priority queue.' }
        ]
      },
      unionfind: {
        title: 'Union-Find (Disjoint Set)',
        concept: 'A data structure that tracks elements partitioned into disjoint sets.',
        property: 'Two main operations: Find (with path compression) and Union (by rank).',
        uses: ['Kruskal\'s MST', 'Network Connectivity', 'Image Processing', 'Games'],
        howItWorks: [
          { step: 1, title: 'Find', desc: 'Follow parent pointers to find root.' },
          { step: 2, title: 'Path Compression', desc: 'Flatten tree for faster future lookups.' },
          { step: 3, title: 'Union', desc: 'Merge smaller tree into larger one.' }
        ]
      },
      trie: {
        title: 'Trie (Prefix Tree)',
        concept: 'A tree-like structure for storing strings where each edge represents a character.',
        property: 'All descendants share the same prefix. Search complexity = O(m) where m = key length.',
        uses: ['Auto-complete', 'Spell Checkers', 'IP Routing', 'T9 Predictive Text'],
        howItWorks: [
          { step: 1, title: 'Structure', desc: 'Root is empty. Each path spells a word.' },
          { step: 2, title: 'Insert', desc: 'Create nodes for each character if needed.' },
          { step: 3, title: 'Search', desc: 'Follow characters; check end marker.' }
        ]
      },
      lru: {
        title: 'LRU Cache',
        concept: 'Cache that evicts the least recently used item when full.',
        property: 'O(1) operations using Hash Map + Doubly Linked List.',
        uses: ['Web Caching', 'Database Buffer', 'Browser History', 'CDN Caching'],
        howItWorks: [
          { step: 1, title: 'Hash Map', desc: 'O(1) access to any cached item.' },
          { step: 2, title: 'DLL', desc: 'Recently used moves to front, LRU at tail.' },
          { step: 3, title: 'Eviction', desc: 'Remove tail when capacity exceeded.' }
        ]
      },
      hash: {
        title: 'Hash Table',
        concept: 'Data structure that maps keys to values using a hash function.',
        property: 'Average O(1) time for insert, search, delete.',
        uses: ['Databases', 'Caching', 'Symbol Tables', 'Dictionaries'],
        howItWorks: [
          { step: 1, title: 'Hash Function', desc: 'Maps key to bucket index.' },
          { step: 2, title: 'Collision', desc: 'Handle with chaining or open addressing.' },
          { step: 3, title: 'Operations', desc: 'Direct access via hashed index.' }
        ]
      },
      avl: {
        title: 'AVL Tree',
        concept: 'Self-balancing binary search tree where heights of children differ by at most 1.',
        property: 'Guaranteed O(log n) height, requires rotations to maintain balance.',
        uses: ['Databases', 'Memory Management', 'Set Operations', 'Search Trees'],
        howItWorks: [
          { step: 1, title: 'Balance Factor', desc: 'Height(left) - Height(right) must be -1, 0, or 1.' },
          { step: 2, title: 'Rotations', desc: 'LL, RR, LR, RL rotations to fix imbalances.' },
          { step: 3, title: 'Insert', desc: 'Insert like BST, then rebalance going up.' }
        ]
      }
    };
    return tutorials[activeCategory] || { title: 'Data Structure', concept: '', property: '', uses: [], howItWorks: [] };
  };

  const tutorial = getTutorialContent();

  // Algorithm starters
  const startAlgorithm = () => {
    const queue = [];
    
    if (activeCategory === 'heap') {
      queue.push({ type: 'message', message: '📚 Starting Heap Visualization...' });
      queue.push({ type: 'message', message: `Current Heap: [${data.join(', ')}]` });
      queue.push({ type: 'highlight', indices: Array.from({ length: data.length }, (_, i) => i) });
    }
    
    if (activeCategory === 'graph') {
      const val = parseInt(userInput) || 0;
      queue.push({ type: 'message', message: '📚 Graph Traversal: BFS' });
      queue.push({ type: 'message', message: `Starting from node ${val}` });
      queue.push({ type: 'highlight', indices: [val] });
      queue.push({ type: 'message', message: '👆 Node added to queue' });
    }
    
    if (activeCategory === 'unionfind') {
      queue.push({ type: 'message', message: '📚 Union-Find Visualization' });
      queue.push({ type: 'message', message: 'Each node points to its parent' });
      queue.push({ type: 'highlight', indices: [0, 1, 2] });
    }
    
    if (activeCategory === 'trie') {
      const word = userInput.toLowerCase();
      if (!word) {
        queue.push({ type: 'message', message: '⚠️ Please enter a word to insert' });
      } else {
        queue.push({ type: 'message', message: `📚 Inserting: "${word}"` });
        for (let i = 0; i < word.length; i++) {
          queue.push({ type: 'highlight', indices: [i] });
          queue.push({ type: 'message', message: `📍 Character '${word[i]}' at level ${i + 1}` });
        }
        queue.push({ type: 'message', message: `✅ Word "${word}" inserted successfully!` });
      }
    }
    
    if (activeCategory === 'lru') {
      const key = userInput;
      const value = secondaryInput;
      queue.push({ type: 'message', message: '📚 LRU Cache Operation' });
      queue.push({ type: 'message', message: `Key: ${key || '?'}, Value: ${value || '?'}` });
    }
    
    if (activeCategory === 'hash') {
      const key = parseInt(userInput) % 10;
      queue.push({ type: 'message', message: '📚 Hash Table Operation' });
      queue.push({ type: 'message', message: `Key maps to bucket ${key}` });
      queue.push({ type: 'highlight', indices: [key] });
    }
    
    if (activeCategory === 'avl') {
      const val = parseInt(userInput);
      queue.push({ type: 'message', message: '📚 AVL Tree Insertion' });
      if (val) {
        queue.push({ type: 'message', message: `Inserting ${val}...` });
      }
    }
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  const startHeapSort = () => {
    const queue = [];
    const arr = [...data];
    const n = arr.length;
    
    queue.push({ type: 'message', message: '🔨 Phase 1: Building Max Heap...' });
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      queue.push({ type: 'highlight', indices: [i], comparisons: 1 });
      queue.push({ type: 'message', message: `📍 Processing node ${i} (value: ${arr[i]})` });
      
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n && arr[left] > arr[largest]) {
        queue.push({ type: 'message', message: `👈 Left child ${arr[left]} > parent ${arr[largest]}` });
        largest = left;
      }
      if (right < n && arr[right] > arr[largest]) {
        queue.push({ type: 'message', message: `👉 Right child ${arr[right]} > current largest ${arr[largest]}` });
        largest = right;
      }
      
      if (largest !== i) {
        queue.push({ type: 'message', message: `🔄 Swapping: ${arr[i]} ↔ ${arr[largest]}` });
        queue.push({ type: 'swap', i, j: largest });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
      } else {
        queue.push({ type: 'message', message: `✅ Node ${i} satisfies heap property` });
      }
    }
    
    queue.push({ type: 'message', message: '✅ Max Heap built!' });
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━' });
    queue.push({ type: 'message', message: '🔨 Phase 2: Extracting elements...' });
    
    for (let i = n - 1; i > 0; i--) {
      queue.push({ type: 'message', message: `📍 Swap root to position ${i}` });
      queue.push({ type: 'swap', i: 0, j: i });
      [arr[0], arr[i]] = [arr[i], arr[0]];
      queue.push({ type: 'highlight', indices: [i] });
      
      let j = 0;
      while (true) {
        const left = 2 * j + 1;
        const right = 2 * j + 2;
        let largest = j;
        if (left < i && arr[left] > arr[largest]) largest = left;
        if (right < i && arr[right] > arr[largest]) largest = right;
        if (largest !== j) {
          queue.push({ type: 'swap', j, largest });
          [arr[j], arr[largest]] = [arr[largest], arr[j]];
          j = largest;
        } else break;
      }
    }
    
    queue.push({ type: 'found', index: -1, indices: [], message: '🎉 Heap Sort Complete!' });
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  const startBFS = () => {
    const queue = [];
    const start = parseInt(userInput) || 0;
    const visited = new Set();
    const adj = [[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]];
    
    queue.push({ type: 'message', message: `📚 BFS: Starting from node ${start}` });
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━' });
    
    visited.add(start);
    queue.push({ type: 'highlight', indices: [start], message: `✅ Mark ${start} as visited, enqueue it` });
    
    let i = 0;
    while (i < adj.length) {
      const node = adj[i][0] || i;
      if (!visited.has(node)) {
        visited.add(node);
        queue.push({ type: 'highlight', indices: [node], message: `✅ Visit node ${node}` });
        adj[node]?.forEach(neighbor => {
          if (!visited.has(neighbor)) {
            queue.push({ type: 'message', message: `🔗 Enqueue neighbor ${neighbor}` });
          }
        });
      }
      i++;
    }
    
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━' });
    queue.push({ type: 'found', index: -1, indices: Array.from(visited), message: `✅ BFS Complete! Visited: ${Array.from(visited).join(', ')}` });
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  const startDFS = () => {
    const queue = [];
    const start = parseInt(userInput) || 0;
    const visited = new Set();
    const adj = [[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]];
    
    queue.push({ type: 'message', message: `📚 DFS: Starting from node ${start}` });
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━' });
    
    visited.add(start);
    queue.push({ type: 'highlight', indices: [start], message: `✅ Visit ${start}, mark as visited` });
    
    let i = 0;
    while (i < adj.length) {
      const node = adj[i][0] || i;
      if (!visited.has(node)) {
        visited.add(node);
        queue.push({ type: 'highlight', indices: [node], message: `✅ Recurse to ${node}` });
      } else {
        queue.push({ type: 'message', message: `⬅️ Backtrack from ${node}` });
      }
      i++;
    }
    
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━' });
    queue.push({ type: 'found', index: -1, indices: Array.from(visited), message: `✅ DFS Complete! Visited: ${Array.from(visited).join(', ')}` });
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

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
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">Algorithm Visualizer</h1>
              <p className="text-sm text-slate-500">Interactive learning with step-by-step animations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant={showTutorial ? 'default' : 'outline'} size="sm" onClick={() => setShowTutorial(!showTutorial)} className={showTutorial ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-slate-300'}>
              <BookOpen className="w-4 h-4 mr-2" />{showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-white">
              <span className="text-sm text-slate-600">Speed:</span>
              <input type="range" min="0.5" max="3" step="0.5" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} className="w-20 accent-teal-600" />
              <span className="text-sm w-8 text-slate-700 font-medium">{speed}x</span>
            </div>
            <Button variant={isPlaying ? 'secondary' : 'default'} size="sm" onClick={() => setIsPlaying(!isPlaying)} disabled={animationQueue.length === 0} className={isPlaying ? 'bg-slate-100 text-slate-700' : 'bg-teal-600 hover:bg-teal-700 text-white'}>
              {isPlaying ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> {animationQueue.length > 0 ? 'Continue' : 'Play'}</>}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-600" onClick={generateData}><RotateCcw className="w-4 h-4 mr-2" /> Reset</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Message */}
        {currentMessage && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center"><Zap className="w-5 h-5 text-teal-600" /></div>
              <span className="font-medium text-teal-800">{currentMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-4">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2"><Layers className="w-4 h-4" /> Data Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {DSACATEGORIES.map((cat) => (
                  <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSelectedAlgorithm(null); setSearchValue(''); setUserInput(''); setAnimationQueue([]); setCurrentMessage(''); setIsPlaying(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${activeCategory === cat.id ? 'bg-teal-600 text-white shadow-md' : 'hover:bg-slate-100 text-slate-700'}`}>
                    <cat.icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{cat.name}</div>
                      <div className={`text-xs ${activeCategory === cat.id ? 'text-teal-200' : 'text-slate-400'}`}>{cat.description}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2"><Settings className="w-4 h-4" /> Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Input fields based on category */}
                {activeCategory === 'heap' && (
                  <>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Value" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 border-slate-300" />
                      <Button size="sm" onClick={startHeapSort}><ArrowRight className="w-4 h-4 mr-2" /> Sort</Button>
                    </div>
                    <Button size="sm" className="w-full" onClick={startAlgorithm}>▶️ Visualize Heap</Button>
                  </>
                )}
                {activeCategory === 'graph' && (
                  <>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Start node (0-5)" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 border-slate-300" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={startBFS}>🔍 BFS</Button>
                      <Button size="sm" className="flex-1" onClick={startDFS}>🔍 DFS</Button>
                    </div>
                  </>
                )}
                {activeCategory === 'trie' && (
                  <>
                    <Input type="text" placeholder="Word to insert" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="border-slate-300" />
                    <Button size="sm" className="w-full" onClick={startAlgorithm}>🌳 Insert Word</Button>
                  </>
                )}
                {activeCategory === 'lru' && (
                  <>
                    <div className="flex gap-2">
                      <Input type="text" placeholder="Key" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 border-slate-300" />
                      <Input type="text" placeholder="Value" value={secondaryInput} onChange={(e) => setSecondaryInput(e.target.value)} className="flex-1 border-slate-300" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" onClick={startAlgorithm}>📥 Get</Button>
                      <Button size="sm" className="flex-1" onClick={startAlgorithm}>📤 Put</Button>
                    </div>
                  </>
                )}
                {activeCategory === 'hash' && (
                  <>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Key" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 border-slate-300" />
                    </div>
                    <Button size="sm" className="w-full" onClick={startAlgorithm}># Insert</Button>
                  </>
                )}
                {activeCategory === 'avl' && (
                  <>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="Value" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="flex-1 border-slate-300" />
                    </div>
                    <Button size="sm" className="w-full" onClick={startAlgorithm}>🌳 Insert</Button>
                  </>
                )}

                <div className="border-t border-slate-200 pt-3">
                  <p className="text-xs text-slate-500 mb-2">More Operations:</p>
                  {currentAlgorithms.map((algo) => (
                    <button key={algo.id} onClick={() => setSelectedAlgorithm(algo)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${selectedAlgorithm?.id === algo.id ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'hover:bg-slate-100 text-slate-700'}`}>
                      <div className="text-left">
                        <div className="font-medium">{algo.name}</div>
                        <div className="text-xs text-slate-400">{algo.desc}</div>
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-300 text-slate-500 bg-white">{algo.complexity}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Step:</span><span className="font-medium">{step}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Comparisons:</span><span className="font-medium">{comparisons}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Operations:</span><span className="font-medium">{operations}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Queue:</span><span className="font-medium text-teal-600">{animationQueue.length} steps</span></div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {showTutorial && (
              <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg text-teal-800 flex items-center gap-2"><BookOpen className="w-5 h-5" /> {tutorial.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-600 mb-3">{tutorial.concept}</p>
                      <div className="p-3 rounded-lg bg-white/80 border border-teal-200 mb-3">
                        <p className="text-sm font-medium text-teal-700">{tutorial.property}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 mb-2">Common Uses:</p>
                        <div className="flex flex-wrap gap-1">
                          {tutorial.uses.map((use, i) => (<Badge key={i} variant="outline" className="text-xs border-teal-300 text-teal-600 bg-white">{use}</Badge>))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {tutorial.howItWorks.map((item) => (
                        <div key={item.step} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">{item.step}</div>
                          <div>
                            <p className="text-sm font-medium text-slate-700">{item.title}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      {selectedAlgorithm ? selectedAlgorithm.name : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Visualization`}
                      {foundIndex !== null && foundIndex !== -1 && <Badge className="bg-green-500 text-white animate-bounce"><CheckCircle className="w-3 h-3 mr-1" /> Found!</Badge>}
                      {foundIndex === -1 && <Badge className="bg-emerald-500 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Complete!</Badge>}
                    </CardTitle>
                    <CardDescription className="text-slate-500">{selectedAlgorithm ? selectedAlgorithm.desc : 'Select an operation to begin learning'}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-300 text-slate-500">{data.length || 8} elements</Badge>
                    {isPlaying && <Badge className="bg-emerald-500 text-white animate-pulse"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Running</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[350px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #0891B2 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="relative z-10">
                    {activeCategory === 'heap' && <HeapVisualizer data={data} highlights={highlights} foundIndex={foundIndex} swapHistory={swapHistory} />}
                    {activeCategory === 'segment' && <SegmentVisualizer data={data} highlights={highlights} targetRange={targetRange} />}
                    {activeCategory === 'bit' && <BITVisualizer data={data} highlights={highlights} foundIndex={foundIndex} />}
                    {activeCategory === 'graph' && <GraphVisualizer data={data} highlights={highlights} foundIndex={foundIndex} />}
                    {activeCategory === 'unionfind' && <UnionFindVisualizer data={data} highlights={highlights} foundIndex={foundIndex} />}
                    {activeCategory === 'trie' && <TrieVisualizer data={data} highlights={highlights} userInput={userInput} />}
                    {activeCategory === 'lru' && <LRUVisualizer data={lruData} />}
                    {activeCategory === 'hash' && <HashVisualizer data={hashData} highlights={highlights} />}
                    {activeCategory === 'avl' && <AVLVisualizer data={avlData} highlights={highlights} />}
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-teal-500 animate-pulse" /><span className="text-sm text-slate-600">Current</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-emerald-500" /><span className="text-sm text-slate-600">Found/Complete</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-amber-500" /><span className="text-sm text-slate-600">Comparing</span></div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-slate-300" /><span className="text-sm text-slate-600">Default</span></div>
                </div>
              </CardContent>
            </Card>

            {selectedAlgorithm && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2"><HelpCircle className="w-4 h-4" /> {selectedAlgorithm.name} Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {selectedAlgorithm.steps.map((stepName, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${i === currentStepIndex ? 'bg-teal-100 text-teal-700 border border-teal-300' : i < currentStepIndex ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {i < currentStepIndex ? <CheckCircle className="w-3 h-3" /> : <span className="w-4 h-4 rounded-full bg-slate-200 text-xs flex items-center justify-center">{i + 1}</span>}
                          <span className="font-medium">{stepName}</span>
                        </div>
                        {i < selectedAlgorithm.steps.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 mx-1" />}
                      </div>
                    ))}
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

// Visualizer Components
function HeapVisualizer({ data, highlights, foundIndex, swapHistory }) {
  const renderNode = (index, x, y, level) => {
    if (index >= data.length) return null;
    const isHighlighted = highlights.includes(index);
    const isFound = foundIndex === index;
    const wasSwapped = swapHistory.some(s => s.i === index || s.j === index);
    const offset = 100 / (level + 1);

    return (
      <g key={index} className="transition-all duration-500">
        {2 * index + 1 < data.length && <line x1={x} y1={y} x2={x - offset} y2={y + 50} stroke={highlights.includes(2 * index + 1) ? '#0891B2' : '#CBD5E1'} strokeWidth={highlights.includes(2 * index + 1) ? 2 : 1.5} className="transition-all duration-300" />}
        {2 * index + 2 < data.length && <line x1={x} y1={y} x2={x + offset} y2={y + 50} stroke={highlights.includes(2 * index + 2) ? '#0891B2' : '#CBD5E1'} strokeWidth={highlights.includes(2 * index + 2) ? 2 : 1.5} className="transition-all duration-300" />}
        <circle cx={x} cy={y} r={isFound ? 26 : isHighlighted ? 22 : 18} fill={isFound ? '#10B981' : isHighlighted ? '#0891B2' : '#F0FDFA'} stroke={isFound ? '#059669' : isHighlighted ? '#0E7490' : '#0891B2'} strokeWidth={isFound ? 3 : 2} className={`transition-all duration-300 ${wasSwapped ? 'animate-bounce' : ''}`} />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={isFound ? 'white' : isHighlighted ? 'white' : '#0F766E'} fontSize="11" fontWeight="bold" className="transition-all duration-300">{data[index]}</text>
        <text x={x} y={y + 32} textAnchor="middle" fill={isHighlighted ? '#0891B2' : '#94A3B8'} fontSize="9">[{index}]</text>
        {renderNode(2 * index + 1, x - offset, y + 50, level + 1)}
        {renderNode(2 * index + 2, x + offset, y + 50, level + 1)}
      </g>
    );
  };

  return (
    <svg width="500" height="320">
      <defs><filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {data.length > 0 ? data.map((_, i) => { const level = Math.floor(Math.log2(i + 1)); const offset = 180 / Math.pow(2, level); const x = 250 + (i - Math.pow(2, level) + 0.5) * (360 / Math.pow(2, level)); const y = 40 + level * 50; return renderNode(i, x, y, level); }) : <text x="250" y="160" textAnchor="middle" fill="#94A3B8" fontSize="14">Empty Heap</text>}
    </svg>
  );
}

function SegmentVisualizer({ data, highlights, targetRange }) {
  const segmentSize = Math.ceil(data.length / 4);
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
        {data.map((val, i) => {
          const isHighlighted = highlights.includes(i);
          const isInRange = targetRange.start <= i && i <= targetRange.end;
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`flex items-center justify-center rounded-t border-x border-t transition-all duration-300 ${isInRange ? 'bg-teal-600 text-white border-teal-700' : isHighlighted ? 'bg-amber-500 text-white border-amber-600' : 'bg-teal-100 text-teal-700 border-teal-200'}`} style={{ width: '38px', height: `${Math.max(val * 2, 28)}px`, transform: isInRange && targetRange.end === i ? 'scale(1.1)' : 'scale(1)' }}>
                <span className="text-xs font-bold">{val}</span>
              </div>
              <span className={`text-xs mt-2 ${isHighlighted ? 'text-amber-600 font-medium' : 'text-slate-500'}`}>{i}</span>
            </div>
          );
        })}
      </div>
      {data.length > 0 && (
        <div className="flex gap-3 flex-wrap justify-center max-w-2xl">
          {Array.from({ length: Math.ceil(data.length / segmentSize) }).map((_, i) => {
            const sum = data.slice(i * segmentSize, Math.min((i + 1) * segmentSize, data.length)).reduce((a, b) => a + b, 0);
            return <div key={i} className="px-3 py-1.5 rounded text-sm bg-teal-50 text-teal-700 border border-teal-200"><span className="font-medium">[{i * segmentSize}-{(i + 1) * segmentSize - 1}]</span><span className="ml-2 opacity-75">= {sum}</span></div>;
          })}
        </div>
      )}
    </div>
  );
}

function BITVisualizer({ data, highlights, foundIndex }) {
  const n = data.length || 16;
  const tree = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) tree[i] = data[i - 1] || 0;
  for (let i = 1; i <= n; i++) { const parent = i + (i & -i); if (parent <= n) tree[parent] += tree[i]; }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="text-center">
        <p className="text-xs text-slate-500 mb-2">Original Array</p>
        <div className="flex gap-1 flex-wrap justify-center">
          {data.slice(0, n).map((val, i) => <div key={i} className={`w-10 h-10 flex items-center justify-center rounded font-bold text-xs ${foundIndex === i ? 'bg-emerald-500 text-white' : highlights.includes(i) ? 'bg-amber-500 text-white' : 'bg-teal-100 text-teal-700 border border-teal-200'}`}>{val}</div>)}
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-500 mb-2">BIT (1-indexed)</p>
        <div className="flex gap-1 flex-wrap justify-center">
          {tree.slice(1).map((val, i) => <div key={i} className={`relative w-12 h-12 flex items-center justify-center rounded font-bold text-xs ${foundIndex === i ? 'bg-emerald-500 text-white' : highlights.includes(i) ? 'bg-amber-500 text-white' : 'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 border border-teal-300'}`}>{val}<span className="absolute -bottom-4 text-[9px] text-slate-400">{i + 1}</span></div>)}
        </div>
      </div>
    </div>
  );
}

function GraphVisualizer({ data, highlights, foundIndex }) {
  const nodes = data.map((val, i) => ({ id: i, value: val }));
  const centerX = 200, centerY = 150, radius = 100;
  const adj = [[1, 2], [0, 3, 4], [0, 5], [1], [1], [2]];

  const getNodePos = (i, total) => {
    const angle = (2 * Math.PI * i) / total - Math.PI / 2;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  };

  return (
    <svg width="400" height="300" className="overflow-visible">
      {nodes.map((node, i) => {
        const pos = getNodePos(i, nodes.length);
        const isHighlighted = highlights.includes(i);
        const isFound = foundIndex === i;
        return (
          <g key={node.id}>
            {adj[i]?.map(j => {
              const nextPos = getNodePos(j, nodes.length);
              return <line key={j} x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y} stroke={highlights.includes(i) && highlights.includes(j) ? '#0891B2' : '#CBD5E1'} strokeWidth={highlights.includes(i) && highlights.includes(j) ? 3 : 1.5} />;
            })}
            <circle cx={pos.x} cy={pos.y} r={isFound ? 28 : isHighlighted ? 24 : 20} fill={isFound ? '#10B981' : isHighlighted ? '#0891B2' : '#F0FDFA'} stroke={isFound ? '#059669' : isHighlighted ? '#0E7490' : '#0891B2'} strokeWidth={isFound ? 3 : 2} />
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central" fill={isFound ? 'white' : isHighlighted ? 'white' : '#0F766E'} fontSize="12" fontWeight="bold">{node.value}</text>
            <text x={pos.x} y={pos.y + 35} textAnchor="middle" fill={isHighlighted ? '#0891B2' : '#94A3B8'} fontSize="9">[{i}]</text>
          </g>
        );
      })}
    </svg>
  );
}

function UnionFindVisualizer({ data, highlights, foundIndex }) {
  const n = data.length || 8;
  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
      {Array.from({ length: n }).map((_, i) => {
        const isHighlighted = highlights.includes(i);
        const isFound = foundIndex === i;
        return (
          <div key={i} className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm ${isFound ? 'bg-emerald-500 text-white' : isHighlighted ? 'bg-amber-500 text-white' : 'bg-teal-100 text-teal-700 border-2 border-teal-300'}`}>
            {i}
            <span className={`absolute -bottom-5 text-xs ${isHighlighted ? 'text-amber-600' : 'text-slate-400'}`}>{i}</span>
            <div className="absolute -top-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center"><span className="text-[8px] text-white">R</span></div>
          </div>
        );
      })}
    </div>
  );
}

function TrieVisualizer({ data, highlights, userInput }) {
  const words = ['apple', 'app', 'application', 'apply', 'banana', 'band', 'bandana'];
  const trie = { children: {}, isEnd: false };
  
  words.forEach(word => {
    let node = trie;
    for (const char of word) {
      if (!node.children[char]) node.children[char] = { children: {}, isEnd: false };
      node = node.children[char];
    }
    node.isEnd = true;
  });

  const renderTrie = (node, x, y, level = 0) => {
    const char = Object.keys(node.children)[0];
    const childX = x + (level === 0 ? 0 : level % 2 === 0 ? 60 : -60);
    const childY = y + 50;
    
    return (
      <g key={`${level}-${char || 'root'}`}>
        <circle cx={x} cy={y} r={node.isEnd ? 20 : 15} fill={node.isEnd ? '#10B981' : '#F0FDFA'} stroke={node.isEnd ? '#059669' : '#0891B2'} strokeWidth={2} />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={node.isEnd ? 'white' : '#0F766E'} fontSize="10" fontWeight="bold">{level === 0 ? 'root' : char}</text>
        {node.isEnd && <circle cx={x + 12} cy={y - 12} r={6} fill="#0891B2" />}
        {Object.entries(node.children).map(([c, child], i) => {
          const offsetX = (i - Object.entries(node.children).length / 2) * 40;
          return (
            <g key={c}>
              <line x1={x} y1={y} x2={x + offsetX} y2={y + 40} stroke="#CBD5E1" strokeWidth="1" />
              {renderTrie(child, x + offsetX, y + 40, level + 1)}
            </g>
          );
        })}
      </g>
    );
  };

  return <div className="flex flex-col items-center">{renderTrie(trie, 250, 30)}<p className="text-sm text-slate-500 mt-4">Trie stores prefix tree for efficient string operations</p></div>;
}

function LRUVisualizer({ data }) {
  const { cache = [], capacity = 5 } = data;
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="text-sm text-slate-500">HEAD</div>
        {[...Array(capacity)].map((_, i) => (
          <div key={i} className={`w-16 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium ${i < cache.length ? 'bg-teal-100 border-teal-400 text-teal-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
            {cache[i]?.key || '—'}
          </div>
        ))}
        <div className="text-sm text-slate-500">TAIL</div>
      </div>
      <div className="flex gap-2 text-xs text-slate-500">
        <span>← MRU</span>
        <span>LRU →</span>
      </div>
    </div>
  );
}

function HashVisualizer({ data, highlights }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center max-w-lg">
      {data.map((bucket, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="text-xs text-slate-500 mb-1">{i}</div>
          <div className={`w-16 h-12 rounded-lg border-2 flex items-center justify-center ${bucket.occupied ? 'bg-teal-100 border-teal-400' : 'bg-slate-50 border-slate-200'}`}>
            {bucket.occupied ? <span className="text-xs font-medium">{bucket.key}</span> : <span className="text-xs text-slate-400">∅</span>}
          </div>
          {highlights.includes(i) && <div className="w-16 h-1 bg-amber-500 mt-1 animate-pulse" />}
        </div>
      ))}
    </div>
  );
}

function AVLVisualizer({ data, highlights }) {
  const insertNode = (root, value) => {
    if (!root) return { value, left: null, right: null, height: 1 };
    if (value < root.value) root.left = insertNode(root.left, value);
    else if (value > root.value) root.right = insertNode(root.right, value);
    return root;
  };

  let tree = null;
  data.forEach(val => { tree = insertNode(tree, val); });

  const renderAVL = (node, x, y, level = 0) => {
    if (!node) return null;
    const offset = 80 / (level + 1);
    return (
      <g key={node.value}>
        <line x1={x} y1={y} x2={x - offset} y2={y + 50} stroke="#CBD5E1" strokeWidth="1" />
        <line x1={x} y1={y} x2={x + offset} y2={y + 50} stroke="#CBD5E1" strokeWidth="1" />
        <circle cx={x} cy={y} r={highlights.includes(node.value) ? 22 : 18} fill={highlights.includes(node.value) ? '#0891B2' : '#F0FDFA'} stroke={highlights.includes(node.value) ? '#0E7490' : '#0891B2'} strokeWidth="2" />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={highlights.includes(node.value) ? 'white' : '#0F766E'} fontSize="10" fontWeight="bold">{node.value}</text>
        {renderAVL(node.left, x - offset, y + 50, level + 1)}
        {renderAVL(node.right, x + offset, y + 50, level + 1)}
      </g>
    );
  };

  return <svg width="500" height="300">{tree && renderAVL(tree, 250, 40)}</svg>;
}
