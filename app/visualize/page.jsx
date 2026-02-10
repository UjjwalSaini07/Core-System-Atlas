'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Network, Database, GitBranch, Layers, 
  ArrowLeft, Play, Pause, RotateCcw, Settings,
  BarChart2, Info, ChevronRight, ChevronDown,
  Search, Zap, Target, ArrowRight, ArrowUp, ArrowDown,
  BookOpen, HelpCircle, Eye, CheckCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DSACATEGORIES = [
  { id: 'heap', name: 'Heap', icon: Layers, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Complete binary tree with heap property' },
  { id: 'segment', name: 'Segment Tree', icon: Database, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Range queries on static arrays' },
  { id: 'bit', name: 'Binary Indexed Tree', icon: Database, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Efficient prefix sum queries' },
  { id: 'graph', name: 'Graph', icon: Network, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Nodes connected by edges' },
  { id: 'unionfind', name: 'Union-Find', icon: GitBranch, color: 'text-teal-600', bg: 'bg-teal-100', description: 'Disjoint set data structure' }
];

const ALGORITHMS = {
  heap: [
    { id: 'insert', name: 'Insert', complexity: 'O(log n)', desc: 'Add element to heap', steps: ['Add to end', 'Bubble up', 'Heapify'] },
    { id: 'extract', name: 'Extract Max', complexity: 'O(log n)', desc: 'Remove and return max', steps: ['Swap root with last', 'Remove last', 'Bubble down'] },
    { id: 'heapify', name: 'Heapify', complexity: 'O(n)', desc: 'Build heap from array', steps: ['Start from parent', 'Compare children', 'Swap if needed'] },
    { id: 'heapsort', name: 'Heap Sort', complexity: 'O(n log n)', desc: 'In-place sorting', steps: ['Build max heap', 'Swap root to end', 'Heapify reduced'] }
  ],
  segment: [
    { id: 'build', name: 'Build Tree', complexity: 'O(n)', desc: 'Build segment tree', steps: ['Leaf nodes', 'Internal nodes', 'Combine children'] },
    { id: 'rangeSum', name: 'Range Sum', complexity: 'O(log n)', desc: 'Query sum in range', steps: ['Split query', 'Traverse tree', 'Combine results'] },
    { id: 'rangeMin', name: 'Range Min', complexity: 'O(log n)', desc: 'Query min in range', steps: ['Split query', 'Traverse tree', 'Return min'] }
  ],
  bit: [
    { id: 'build', name: 'Build Tree', complexity: 'O(n log n)', desc: 'Build BIT from array', steps: ['Initialize zeros', 'Add values', 'Propagate up'] },
    { id: 'prefix', name: 'Prefix Sum', complexity: 'O(log n)', desc: 'Sum from 1 to i', steps: ['Start at i', 'Add tree[i]', 'Move to parent'] },
    { id: 'range', name: 'Range Sum', complexity: 'O(log n)', desc: 'Sum in [l, r]', steps: ['Prefix(r)', 'Prefix(l-1)', 'Subtract'] },
    { id: 'update', name: 'Update', complexity: 'O(log n)', desc: 'Add value at index', steps: ['Start at index', 'Update tree[i]', 'Move to parent'] }
  ],
  graph: [
    { id: 'bfs', name: 'BFS', complexity: 'O(V + E)', desc: 'Level-order traversal', steps: ['Queue start', 'Visit neighbors', 'Mark visited'] },
    { id: 'dfs', name: 'DFS', complexity: 'O(V + E)', desc: 'Depth-first traversal', steps: ['Push start', 'Visit neighbor', 'Backtrack'] }
  ],
  unionfind: [
    { id: 'find', name: 'Find', complexity: 'α(n)', desc: 'Find root node', steps: ['Follow parent', 'Path compression', 'Return root'] },
    { id: 'union', name: 'Union', complexity: 'α(n)', desc: 'Merge two sets', steps: ['Find roots', 'Rank comparison', 'Link roots'] }
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
  const [heapArray, setHeapArray] = useState([]);
  
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
    setHeapArray(newData);
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
    setIsPlaying(false);
    setCurrentStepIndex(0);
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
      if (activeCategory === 'heap') {
        setHeapArray(newData);
      }
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
      if (activeCategory === 'heap') {
        setHeapArray(stepData.values);
      }
    }
  };

  // Tutorial/Teaching content
  const getTutorialContent = () => {
    switch (activeCategory) {
      case 'heap':
        return {
          title: 'Understanding Heaps',
          concept: 'A Heap is a complete binary tree where every parent node satisfies the heap property:',
          property: 'Max Heap: Parent ≥ Children | Min Heap: Parent ≤ Children',
          uses: ['Priority Queues', 'Heap Sort', 'Dijkstra\'s Algorithm', 'Memory Management'],
          howItWorks: [
            { step: 1, title: 'Complete Tree', desc: 'All levels are filled except possibly the last, which is filled left to right' },
            { step: 2, title: 'Array Storage', desc: 'Heaps are stored in arrays! For node at index i: Left = 2i+1, Right = 2i+2, Parent = floor((i-1)/2)' },
            { step: 3, title: 'Heapify', desc: 'The process of restoring heap property after insertion or extraction' }
          ]
        };
      case 'segment':
        return {
          title: 'Segment Trees Explained',
          concept: 'A Segment Tree is a binary tree used to store intervals or segments of an array.',
          property: 'Each node represents a segment. Parent stores aggregate (sum/min/max) of its children.',
          uses: ['Range Queries', 'Range Updates', 'Statistics', 'Interval Problems'],
          howItWorks: [
            { step: 1, title: 'Structure', desc: 'Tree height is O(log n). Leaf nodes store individual array elements.' },
            { step: 2, title: 'Query', desc: 'To query [l, r], decompose the range into O(log n) segments' },
            { step: 3, title: 'Combine', desc: 'Combine results from relevant nodes to get final answer' }
          ]
        };
      case 'bit':
        return {
          title: 'Binary Indexed Trees',
          concept: 'Also called Fenwick Tree, it stores cumulative frequencies and enables efficient prefix sums.',
          property: 'Each index i stores the sum of elements in a specific range ending at i.',
          uses: ['Prefix Sums', 'Frequency Tables', 'Cumulative Counts', 'Order Statistics'],
          howItWorks: [
            { step: 1, title: 'Key Insight', desc: 'Tree[i] stores sum of elements from (i - (i & -i)) + 1 to i' },
            { step: 2, title: 'Prefix Query', desc: 'Sum[1..i] = Add tree[i], then move i -= i & -i' },
            { step: 3, title: 'Update', desc: 'To add value at i, update tree[i] and all its ancestors' }
          ]
        };
      default:
        return { title: 'Data Structure', concept: '', property: '', uses: [], howItWorks: [] };
    }
  };

  const tutorial = getTutorialContent();

  // Start Heap Sort with detailed explanation
  const startHeapSort = () => {
    const queue = [];
    const arr = [...data];
    const n = arr.length;
    
    // Phase 1: Build Max Heap
    queue.push({ type: 'message', message: '🔨 Phase 1: Building Max Heap...' });
    
    // Heapify from last non-leaf node
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      queue.push({ type: 'highlight', indices: [i], comparisons: 1 });
      queue.push({ type: 'message', message: `📍 Processing node at index ${i} (value: ${arr[i]})` });
      
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (left < n && arr[left] > arr[largest]) {
        queue.push({ type: 'highlight', indices: [left], comparisons: 1 });
        queue.push({ type: 'message', message: `👈 Left child ${arr[left]} > parent ${arr[largest]}` });
        largest = left;
      } else {
        queue.push({ type: 'message', message: `👈 Left child ${left < n ? arr[left] : 'N/A'} ≤ parent ${arr[largest]}` });
      }
      
      if (right < n && arr[right] > arr[largest]) {
        queue.push({ type: 'highlight', indices: [right], comparisons: 1 });
        queue.push({ type: 'message', message: `👉 Right child ${arr[right]} > current largest ${arr[largest]}` });
        largest = right;
      } else {
        queue.push({ type: 'message', message: `👉 Right child ${right < n ? arr[right] : 'N/A'} ≤ current largest ${arr[largest]}` });
      }
      
      if (largest !== i) {
        queue.push({ type: 'message', message: `🔄 Swapping: ${arr[i]} ↔ ${arr[largest]}` });
        queue.push({ type: 'swap', i, j: largest });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        
        queue.push({ type: 'message', message: `⬇️ Heapifying affected subtree at index ${largest}` });
        // Recursive heapify
        let j = largest;
        while (true) {
          const l = 2 * j + 1;
          const r = 2 * j + 2;
          let largest2 = j;
          
          if (l < n && arr[l] > arr[largest2]) {
            largest2 = l;
          }
          if (r < n && arr[r] > arr[largest2]) {
            largest2 = r;
          }
          
          if (largest2 !== j) {
            queue.push({ type: 'swap', j, largest: largest2 });
            [arr[j], arr[largest2]] = [arr[largest2], arr[j]];
            j = largest2;
          } else break;
        }
      } else {
        queue.push({ type: 'message', message: `✅ Node ${i} satisfies heap property` });
      }
    }
    
    queue.push({ type: 'message', message: '✅ Max Heap built successfully!' });
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━' });
    
    // Phase 2: Extract elements
    queue.push({ type: 'message', message: '🔨 Phase 2: Extracting elements (Sorting)' });
    
    for (let i = n - 1; i > 0; i--) {
      queue.push({ type: 'message', message: `📍 Extracting maximum from root to position ${i}` });
      queue.push({ type: 'swap', i: 0, j: i });
      [arr[0], arr[i]] = [arr[i], arr[0]];
      queue.push({ type: 'highlight', indices: [i] });
      queue.push({ type: 'message', message: `🎯 Maximum element ${arr[i]} placed at sorted position` });
      
      queue.push({ type: 'message', message: '⬇️ Heapifying reduced heap' });
      let j = 0;
      while (true) {
        const l = 2 * j + 1;
        const r = 2 * j + 2;
        let largest = j;
        
        if (l < i && arr[l] > arr[largest]) largest = l;
        if (r < i && arr[r] > arr[largest]) largest = r;
        
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

  // Start Segment Tree Range Query with teaching
  const startSegmentQuery = () => {
    const queue = [];
    const val = parseInt(searchValue) || 8;
    const queryEnd = Math.min(val, data.length - 1);
    
    queue.push({ type: 'message', message: `📚 Segment Tree Range Query: [0, ${queryEnd}]` });
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━━━━━━' });
    
    const segmentSize = Math.ceil(data.length / 4);
    const numSegments = Math.ceil(data.length / segmentSize);
    
    let totalSum = 0;
    const visitedRanges = [];
    
    // Visualize the query process
    for (let i = 0; i < numSegments; i++) {
      const start = i * segmentSize;
      const end = Math.min((i + 1) * segmentSize - 1, data.length - 1);
      
      if (end < queryEnd) {
        visitedRanges.push({ start, end, included: true });
        const segSum = data.slice(start, end + 1).reduce((a, b) => a + b, 0);
        totalSum += segSum;
        queue.push({ type: 'highlight', indices: Array.from({ length: end - start + 1 }, (_, idx) => start + idx) });
        queue.push({ type: 'message', message: `📦 Segment [${start}-${end}]: ${data.slice(start, end + 1).join(' + ')} = ${segSum}` });
      }
    }
    
    // Add remaining elements
    const lastStart = Math.floor(queryEnd / segmentSize) * segmentSize;
    if (lastStart <= queryEnd) {
      const segSum = data.slice(lastStart, queryEnd + 1).reduce((a, b) => a + b, 0);
      totalSum += segSum;
      queue.push({ type: 'highlight', indices: Array.from({ length: queryEnd - lastStart + 1 }, (_, idx) => lastStart + idx) });
      queue.push({ type: 'message', message: `📦 Segment [${lastStart}-${queryEnd}]: ${data.slice(lastStart, queryEnd + 1).join(' + ')} = ${segSum}` });
    }
    
    queue.push({ type: 'message', message: '━━━━━━━━━━━━━━━━━━━━━━━━━' });
    queue.push({ type: 'message', message: `✅ Total Sum = ${totalSum}` });
    queue.push({ type: 'range', range: { start: 0, end: queryEnd }, indices: visitedRanges.flatMap(r => Array.from({ length: r.end - r.start + 1 }, (_, i) => r.start + i)) });
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  // Start BIT Prefix Sum with teaching
  const startBITQuery = () => {
    const queue = [];
    const idx = parseInt(searchValue) || 5;
    const n = data.length;
    const queryIdx = Math.min(idx, n - 1);
    
    queue.push({ type: 'message', message: '📚 BIT Prefix Sum Query' });
    queue.push({ type: 'message', message: `━━━━━━━━━━━━━━━━━━━━` });
    queue.push({ type: 'message', message: `Calculating Sum[1..${queryIdx + 1}]` });
    
    let sum = 0;
    let curr = queryIdx + 1;
    const path = [];
    
    queue.push({ type: 'message', message: `🟢 Start at index ${curr} (tree[${curr}])` });
    
    while (curr > 0) {
      path.push(curr - 1);
      const rangeStart = curr - (curr & -curr) + 1;
      queue.push({ type: 'highlight', indices: [curr - 1] });
      queue.push({ type: 'message', message: `📍 Range [${rangeStart}, ${curr}]: Adding tree[${curr}] = ${data.slice(rangeStart - 1, curr).reduce((a, b) => a + b, 0)}` });
      sum += data[curr - 1];
      queue.push({ type: 'message', message: `➕ Current Sum: ${sum}` });
      curr -= curr & -curr;
      if (curr > 0) {
        queue.push({ type: 'message', message: `⬆️ Move to parent: tree[${curr}]` });
      }
    }
    
    queue.push({ type: 'message', message: `━━━━━━━━━━━━━━━━━━━━` });
    queue.push({ type: 'found', index: queryIdx, indices: path, message: `✅ Prefix Sum[0..${queryIdx}] = ${sum}` });
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  // Start Heap Insert with teaching
  const startHeapInsert = () => {
    const queue = [];
    const val = parseInt(userInput);
    if (!val) {
      queue.push({ type: 'message', message: '⚠️ Please enter a value to insert' });
      setAnimationQueue(queue);
      setIsPlaying(true);
      return;
    }
    
    const arr = [...data, val];
    
    queue.push({ type: 'message', message: '📚 Heap Insert Operation' });
    queue.push({ type: 'message', message: `━━━━━━━━━━━━━━━━━━━━` });
    queue.push({ type: 'message', message: `📍 Added ${val} at end of heap (index ${data.length})` });
    queue.push({ type: 'setdata', values: arr });
    
    // Bubble up
    let i = data.length;
    queue.push({ type: 'message', message: `⬆️ Starting bubble-up from index ${i}` });
    
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      queue.push({ type: 'highlight', indices: [i, parent], comparisons: 1 });
      queue.push({ type: 'message', message: `👆 Comparing child ${arr[i]} with parent ${arr[parent]}` });
      
      if (arr[i] > arr[parent]) {
        queue.push({ type: 'message', message: `🔄 Child ${arr[i]} > parent ${arr[parent]}, swapping` });
        queue.push({ type: 'swap', i, j: parent });
        [arr[i], arr[parent]] = [arr[parent], arr[i]];
        i = parent;
        if (i > 0) {
          queue.push({ type: 'message', message: `⬆️ Continue bubble-up to index ${i}` });
        }
      } else {
        queue.push({ type: 'message', message: `✅ Child ${arr[i]} ≤ parent ${arr[parent]}, heap property satisfied` });
        break;
      }
    }
    
    queue.push({ type: 'message', message: `━━━━━━━━━━━━━━━━━━━━` });
    queue.push({ type: 'found', index: i, indices: [i], message: `✅ Insert Complete! ${val} inserted at index ${i}` });
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  // Start Heap Extract Max with teaching
  const startHeapExtract = () => {
    const queue = [];
    const arr = [...data];
    const n = arr.length;
    
    if (n === 0) {
      queue.push({ type: 'message', message: '⚠️ Heap is empty!' });
      setAnimationQueue(queue);
      setIsPlaying(true);
      return;
    }
    
    queue.push({ type: 'message', message: '📚 Extract Max Operation' });
    queue.push({ type: 'message', message: `━━━━━━━━━━━━━━━━━━━━` });
    
    // Step 1: Swap root with last
    queue.push({ type: 'message', message: `📍 Step 1: Swap root (${arr[0]}) with last element (${arr[n-1]})` });
    queue.push({ type: 'highlight', indices: [0, n-1] });
    queue.push({ type: 'swap', i: 0, j: n - 1 });
    [arr[0], arr[n - 1]] = [arr[n - 1], arr[0]];
    
    // Step 2: Remove last (max element)
    queue.push({ type: 'message', message: `📍 Step 2: Remove ${arr[n-1]} from heap` });
    queue.push({ type: 'highlight', indices: [n - 1] });
    
    // Step 3: Bubble down
    queue.push({ type: 'message', message: `📍 Step 3: Bubble down from root to restore heap property` });
    let i = 0;
    
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      
      if (left < n - 1 && arr[left] > arr[largest]) {
        queue.push({ type: 'highlight', indices: [left], comparisons: 1 });
        queue.push({ type: 'message', message: `👈 Left child ${arr[left]} > current largest ${arr[largest]}` });
        largest = left;
      }
      
      if (right < n - 1 && arr[right] > arr[largest]) {
        queue.push({ type: 'highlight', indices: [right], comparisons: 1 });
        queue.push({ type: 'message', message: `👉 Right child ${arr[right]} > current largest ${arr[largest]}` });
        largest = right;
      }
      
      if (largest !== i) {
        queue.push({ type: 'message', message: `🔄 Swapping ${arr[i]} with ${arr[largest]}` });
        queue.push({ type: 'swap', i, j: largest });
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        i = largest;
      } else {
        queue.push({ type: 'message', message: `✅ Heap property restored at index ${i}` });
        break;
      }
      
      if (i >= Math.floor((n - 1) / 2)) {
        queue.push({ type: 'message', message: `✅ Reached leaf node, heap property satisfied` });
        break;
      }
    }
    
    const maxValue = arr[n - 1];
    arr.pop();
    
    queue.push({ type: 'message', message: `━━━━━━━━━━━━━━━━━━━━` });
    queue.push({ type: 'found', index: -1, indices: [], message: `✅ Extract Complete! Max value: ${maxValue}` });
    queue.push({ type: 'setdata', values: arr });
    
    setAnimationQueue(queue);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backfilter]:bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">Algorithm Visualizer</h1>
              <p className="text-sm text-slate-500">
                Interactive learning with step-by-step animations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={showTutorial ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowTutorial(!showTutorial)}
              className={showTutorial ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-slate-300'}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              {showTutorial ? 'Hide Tutorial' : 'Show Tutorial'}
            </Button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-white">
              <span className="text-sm text-slate-600">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-20 accent-teal-600"
              />
              <span className="text-sm w-8 text-slate-700 font-medium">{speed}x</span>
            </div>
            <Button
              variant={isPlaying ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={animationQueue.length === 0}
              className={isPlaying ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'}
            >
              {isPlaying ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> {animationQueue.length > 0 ? 'Continue' : 'Play'}</>}
            </Button>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400" onClick={generateData}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Current Operation Message */}
        {currentMessage && (
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-teal-600" />
              </div>
              <span className="font-medium text-teal-800">{currentMessage}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-4">
            {/* Data Structure Selection */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Data Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {DSACATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedAlgorithm(null);
                      setSearchValue('');
                      setUserInput('');
                      setAnimationQueue([]);
                      setCurrentMessage('');
                      setIsPlaying(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeCategory === cat.id
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium">{cat.name}</div>
                      <div className={`text-xs ${activeCategory === cat.id ? 'text-teal-200' : 'text-slate-400'}`}>{cat.description}</div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Algorithm Operations */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Input for operations */}
                {(activeCategory === 'heap') && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Value"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="flex-1 border-slate-300"
                    />
                    <Button size="sm" onClick={startHeapInsert} disabled={!userInput}>
                      <ArrowUp className="w-4 h-4" /> Insert
                    </Button>
                  </div>
                )}
                
                {(activeCategory === 'heap') && (
                  <Button size="sm" className="w-full" onClick={startHeapExtract}>
                    <ArrowDown className="w-4 h-4 mr-2" /> Extract Max
                  </Button>
                )}

                {(activeCategory === 'heap') && (
                  <Button size="sm" className="w-full" onClick={startHeapSort}>
                    <ArrowRight className="w-4 h-4 mr-2" /> Heap Sort
                  </Button>
                )}

                {(activeCategory === 'segment' || activeCategory === 'bit') && (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder={activeCategory === 'bit' ? 'Index' : 'Range end'}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="flex-1 border-slate-300"
                    />
                    <Button size="sm" onClick={activeCategory === 'bit' ? startBITQuery : startSegmentQuery} disabled={!searchValue && activeCategory === 'segment'}>
                      <Target className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3">
                  <p className="text-xs text-slate-500 mb-2">Select Operation:</p>
                  {currentAlgorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => setSelectedAlgorithm(algo)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                        selectedAlgorithm?.id === algo.id
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{algo.name}</div>
                        <div className="text-xs text-slate-400">{algo.desc}</div>
                      </div>
                      <Badge variant="outline" className="text-xs border-slate-300 text-slate-500 bg-white">
                        {algo.complexity}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Step:</span>
                  <span className="font-medium">{step}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Comparisons:</span>
                  <span className="font-medium">{comparisons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Operations:</span>
                  <span className="font-medium">{operations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Queue:</span>
                  <span className="font-medium text-teal-600">{animationQueue.length} steps</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {/* Tutorial Panel */}
            {showTutorial && (
              <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg text-teal-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> {tutorial.title}
                  </CardTitle>
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
                          {tutorial.uses.map((use, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-teal-300 text-teal-600 bg-white">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {tutorial.howItWorks.map((item) => (
                        <div key={item.step} className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-xs font-medium text-teal-700">
                            {item.step}
                          </div>
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

            {/* Main Visualization */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900 flex items-center gap-2">
                      {selectedAlgorithm ? selectedAlgorithm.name : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Visualization`}
                      {foundIndex !== null && foundIndex !== -1 && (
                        <Badge className="bg-green-500 text-white animate-bounce">
                          <CheckCircle className="w-3 h-3 mr-1" /> Found!
                        </Badge>
                      )}
                      {foundIndex === -1 && (
                        <Badge className="bg-emerald-500 text-white">
                          <CheckCircle className="w-3 h-3 mr-1" /> Complete!
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-slate-500">
                      {selectedAlgorithm ? selectedAlgorithm.desc : 'Select an operation above to begin learning'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-slate-300 text-slate-500">
                      {data.length} elements
                    </Badge>
                    {isPlaying && (
                      <Badge className="bg-emerald-500 text-white animate-pulse">
                        <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Running
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[350px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle, #0891B2 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                  
                  <div className="relative z-10">
                    {activeCategory === 'heap' && (
                      <HeapVisualizer data={heapArray.length > 0 ? heapArray : data} highlights={highlights} foundIndex={foundIndex} swapHistory={swapHistory} />
                    )}
                    {activeCategory === 'segment' && (
                      <SegmentVisualizer data={data} highlights={highlights} targetRange={targetRange} />
                    )}
                    {activeCategory === 'bit' && (
                      <BITVisualizer data={data} highlights={highlights} foundIndex={foundIndex} />
                    )}
                    {activeCategory === 'graph' && (
                      <GraphVisualizer data={data} highlights={highlights} foundIndex={foundIndex} />
                    )}
                    {activeCategory === 'unionfind' && (
                      <UnionFindVisualizer data={data} highlights={highlights} foundIndex={foundIndex} />
                    )}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center gap-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-sm text-slate-600">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-500" />
                    <span className="text-sm text-slate-600">Found/Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                    <span className="text-sm text-slate-600">Comparing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-600">Default</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Steps Reference */}
            {selectedAlgorithm && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> {selectedAlgorithm.name} Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {selectedAlgorithm.steps.map((stepName, i) => (
                      <div key={i} className="flex items-center">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                          i === currentStepIndex 
                            ? 'bg-teal-100 text-teal-700 border border-teal-300' 
                            : i < currentStepIndex
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {i < currentStepIndex ? <CheckCircle className="w-3 h-3" /> : <span className="w-4 h-4 rounded-full bg-slate-200 text-xs flex items-center justify-center">{i + 1}</span>}
                          <span className="font-medium">{stepName}</span>
                        </div>
                        {i < selectedAlgorithm.steps.length - 1 && (
                          <ArrowRight className="w-4 h-4 text-slate-300 mx-1" />
                        )}
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

// Heap Visualizer with detailed labels
function HeapVisualizer({ data, highlights, foundIndex, swapHistory }) {
  const renderNode = (index, x, y, level) => {
    if (index >= data.length) return null;
    const isHighlighted = highlights.includes(index);
    const isFound = foundIndex === index;
    const wasSwapped = swapHistory.some(s => s.i === index || s.j === index);
    const offset = 100 / (level + 1);

    return (
      <g key={index} className="transition-all duration-500">
        {2 * index + 1 < data.length && (
          <line x1={x} y1={y} x2={x - offset} y2={y + 50}
            stroke={highlights.includes(2 * index + 1) ? '#0891B2' : '#CBD5E1'}
            strokeWidth={highlights.includes(2 * index + 1) ? 2 : 1.5}
            className="transition-all duration-300" />
        )}
        {2 * index + 2 < data.length && (
          <line x1={x} y1={y} x2={x + offset} y2={y + 50}
            stroke={highlights.includes(2 * index + 2) ? '#0891B2' : '#CBD5E1'}
            strokeWidth={highlights.includes(2 * index + 2) ? 2 : 1.5}
            className="transition-all duration-300" />
        )}
        <circle cx={x} cy={y} r={isFound ? 26 : isHighlighted ? 22 : 18}
          fill={isFound ? '#10B981' : isHighlighted ? '#0891B2' : '#F0FDFA'}
          stroke={isFound ? '#059669' : isHighlighted ? '#0E7490' : '#0891B2'}
          strokeWidth={isFound ? 3 : 2}
          className={`transition-all duration-300 ${wasSwapped ? 'animate-bounce' : ''}`} />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
          fill={isFound ? 'white' : isHighlighted ? 'white' : '#0F766E'}
          fontSize="11" fontWeight="bold" className="transition-all duration-300">
          {data[index]}
        </text>
        <text x={x} y={y + 32} textAnchor="middle" fill={isHighlighted ? '#0891B2' : '#94A3B8'} fontSize="9">
          [{index}]
        </text>
        {renderNode(2 * index + 1, x - offset, y + 50, level + 1)}
        {renderNode(2 * index + 2, x + offset, y + 50, level + 1)}
      </g>
    );
  };

  return (
    <svg width="500" height="320">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {data.length > 0 ? (
        data.map((_, i) => {
          const level = Math.floor(Math.log2(i + 1));
          const offset = 180 / Math.pow(2, level);
          const x = 250 + (i - Math.pow(2, level) + 0.5) * (360 / Math.pow(2, level));
          const y = 40 + level * 50;
          return renderNode(i, x, y, level);
        })
      ) : (
        <text x="250" y="160" textAnchor="middle" fill="#94A3B8" fontSize="14">Empty Heap</text>
      )}
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
          const isFound = isInRange && targetRange.end === i;
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`flex items-center justify-center rounded-t border-x border-t transition-all duration-300 ${
                isFound 
                  ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/30'
                  : isInRange
                  ? 'bg-teal-600 text-white border-teal-700'
                  : isHighlighted 
                  ? 'bg-amber-500 text-white border-amber-600' 
                  : 'bg-teal-100 text-teal-700 border-teal-200'
              }`} style={{ width: '38px', height: `${Math.max(val * 2, 28)}px`, transform: isFound ? 'scale(1.1)' : 'scale(1)' }}>
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
            const start = i * segmentSize;
            const end = Math.min((i + 1) * segmentSize - 1, data.length - 1);
            const sum = data.slice(start, end + 1).reduce((a, b) => a + b, 0);
            const isInRange = targetRange.start >= start && targetRange.end <= end;
            
            return (
              <div key={i} className={`px-3 py-1.5 rounded text-sm transition-all ${
                isInRange ? 'bg-teal-600 text-white shadow-lg' : 'bg-teal-50 text-teal-700 border border-teal-200'
              }`}>
                <span className="font-medium">[{start}-{end}]</span>
                <span className="ml-2 opacity-75">= {sum}</span>
              </div>
            );
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
  for (let i = 1; i <= n; i++) {
    const parent = i + (i & -i);
    if (parent <= n) tree[parent] += tree[i];
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="text-center">
        <p className="text-xs text-slate-500 mb-2">Original Array (0-indexed)</p>
        <div className="flex gap-1 flex-wrap justify-center">
          {data.slice(0, n).map((val, i) => (
            <div key={i} className={`w-10 h-10 flex items-center justify-center rounded font-bold text-xs transition-all ${
              foundIndex === i ? 'bg-emerald-500 text-white shadow-lg' : highlights.includes(i) ? 'bg-amber-500 text-white' : 'bg-teal-100 text-teal-700 border border-teal-200'
            }`}>
              {val}
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-slate-500 mb-2">BIT (1-indexed)</p>
        <div className="flex gap-1 flex-wrap justify-center">
          {tree.slice(1).map((val, i) => {
            const isHighlighted = highlights.includes(i);
            const isFound = foundIndex === i;
            
            return (
              <div key={i} className={`relative w-12 h-12 flex items-center justify-center rounded font-bold text-xs transition-all ${
                isFound ? 'bg-emerald-500 text-white shadow-lg scale-110' : isHighlighted ? 'bg-amber-500 text-white' : 'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-700 border border-teal-300'
              }`}>
                {val}
                <span className="absolute -bottom-4 text-[9px] text-slate-400">{i + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GraphVisualizer({ data, highlights, foundIndex }) {
  const nodes = data.map((val, i) => ({ id: i, value: val }));
  const centerX = 200, centerY = 150, radius = 100;

  const getNodePos = (i, total) => {
    const angle = (2 * Math.PI * i) / total - Math.PI / 2;
    return { x: centerX + radius * Math.cos(angle), y: centerY + radius * Math.sin(angle) };
  };

  return (
    <svg width="400" height="300" className="overflow-visible">
      {nodes.map((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length];
        const pos = getNodePos(i, nodes.length);
        const nextPos = getNodePos((i + 1) % nodes.length, nodes.length);
        const isHighlighted = highlights.includes(i);
        const isFound = foundIndex === i;

        return (
          <g key={node.id}>
            <line x1={pos.x} y1={pos.y} x2={nextPos.x} y2={nextPos.y}
              stroke={isHighlighted ? '#0891B2' : '#CBD5E1'}
              strokeWidth={isHighlighted ? 3 : 1.5} />
            <circle cx={pos.x} cy={pos.y} r={isFound ? 28 : isHighlighted ? 24 : 20}
              fill={isFound ? '#10B981' : isHighlighted ? '#0891B2' : '#F0FDFA'}
              stroke={isFound ? '#059669' : isHighlighted ? '#0E7490' : '#0891B2'}
              strokeWidth={isFound ? 3 : 2} />
            <text x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="central"
              fill={isFound ? 'white' : isHighlighted ? 'white' : '#0F766E'}
              fontSize="12" fontWeight="bold">{node.value}</text>
            <text x={pos.x} y={pos.y + 35} textAnchor="middle" fill={isHighlighted ? '#0891B2' : '#94A3B8'} fontSize="9">[{i}]</text>
          </g>
        );
      })}
    </svg>
  );
}

function UnionFindVisualizer({ data, highlights, foundIndex }) {
  const n = data.length || 8;
  const parent = Array.from({ length: n }, (_, i) => i);
  
  return (
    <div className="flex flex-wrap gap-3 justify-center max-w-lg mx-auto">
      {Array.from({ length: n }).map((_, i) => {
        const isHighlighted = highlights.includes(i);
        const isFound = foundIndex === i;
        
        return (
          <div key={i} className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            isFound ? 'bg-emerald-500 text-white shadow-lg scale-110' : isHighlighted ? 'bg-amber-500 text-white shadow-lg scale-105' : 'bg-teal-100 text-teal-700 border-2 border-teal-300'
          }`}>
            {parent[i]}
            <span className={`absolute -bottom-5 text-xs ${isHighlighted ? 'text-amber-600' : 'text-slate-400'}`}>{i}</span>
            {parent[i] === i && (
              <div className="absolute -top-2 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-[8px] text-white">R</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
