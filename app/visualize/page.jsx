'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Network, Database, GitBranch, Layers, 
  ArrowLeft, Play, Pause, RotateCcw, Settings,
  BarChart2, Info, ChevronRight, ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DSACATEGORIES = [
  { id: 'graph', name: 'Graph', icon: Network, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'heap', name: 'Heap', icon: Layers, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'segment', name: 'Segment Tree', icon: Database, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'unionfind', name: 'Union-Find', icon: GitBranch, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'bit', name: 'Binary Indexed Tree', icon: Database, color: 'text-blue-600', bg: 'bg-blue-100' }
];

const ALGORITHMS = {
  graph: [
    { id: 'bfs', name: 'Breadth-First Search', complexity: 'O(V + E)', desc: 'Shortest path in unweighted graphs' },
    { id: 'dfs', name: 'Depth-First Search', complexity: 'O(V + E)', desc: 'Cycle detection, topological sort' },
    { id: 'dijkstra', name: "Dijkstra's Algorithm", complexity: 'O((V + E) log V)', desc: 'Shortest path in weighted graphs' },
    { id: 'bellmanford', name: 'Bellman-Ford', complexity: 'O(VE)', desc: 'Handles negative weights' },
    { id: 'topological', name: 'Topological Sort', complexity: 'O(V + E)', desc: 'DAG ordering' }
  ],
  heap: [
    { id: 'minheap', name: 'Min Heap', complexity: 'O(log n)', desc: 'Priority queue implementation' },
    { id: 'maxheap', name: 'Max Heap', complexity: 'O(log n)', desc: 'Maximum extraction' },
    { id: 'heapify', name: 'Heapify', complexity: 'O(n)', desc: 'Build heap from array' },
    { id: 'heapsort', name: 'Heap Sort', complexity: 'O(n log n)', desc: 'In-place sorting' }
  ],
  segment: [
    { id: 'rangeSum', name: 'Range Sum Query', complexity: 'O(log n)', desc: 'Sum in subarray range' },
    { id: 'rangeMin', name: 'Range Minimum Query', complexity: 'O(log n)', desc: 'Find min in range' },
    { id: 'rangeUpdate', name: 'Range Update', complexity: 'O(log n)', desc: 'Add value to range' },
    { id: 'findFirst', name: 'Find First Prefix', complexity: 'O(log n)', desc: 'Binary search on tree' }
  ],
  unionfind: [
    { id: 'union', name: 'Union Operation', complexity: 'α(n)', desc: 'Merge sets' },
    { id: 'find', name: 'Find Operation', complexity: 'α(n)', desc: 'Find root with path compression' },
    { id: 'kruskal', name: "Kruskal's MST", complexity: 'O(E log E)', desc: 'Minimum spanning tree' },
    { id: 'components', name: 'Connected Components', complexity: 'O(N + E)', desc: 'Group connected nodes' }
  ],
  bit: [
    { id: 'prefixSum', name: 'Prefix Sum', complexity: 'O(log n)', desc: 'Sum from 0 to index' },
    { id: 'rangeQuery', name: 'Range Query', complexity: 'O(log n)', desc: 'Sum in arbitrary range' },
    { id: 'findKth', name: 'Find Kth Element', complexity: 'O(log n)', desc: 'Order statistics' },
    { id: 'countInv', name: 'Count Inversions', complexity: 'O(n log n)', desc: 'Count inversions in array' }
  ]
};

export default function VisualizePage() {
  const [activeCategory, setActiveCategory] = useState('graph');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [step, setStep] = useState(0);
  const [data, setData] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [stats, setStats] = useState({ comparisons: 0, operations: 0 });
  const [showDetails, setShowDetails] = useState(true);

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
    setStats({ comparisons: 0, operations: 0 });
  }, [activeCategory]);

  useEffect(() => {
    generateData();
  }, [generateData]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(prev => prev + 1);
        setStats(prev => ({ ...prev, operations: prev.operations + 1 }));
      }, 1000 / speed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4 text-blue-600" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-blue-900">Algorithm Visualizer</h1>
              <p className="text-sm text-blue-600/70">
                Interactive DSA visualization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50">
              <span className="text-sm text-blue-600/70">Speed:</span>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-20 accent-blue-600"
              />
              <span className="text-sm w-8 text-blue-700">{speed}x</span>
            </div>
            <Button
              variant={isPlaying ? 'secondary' : 'default'}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className={isPlaying ? '' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {isPlaying ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Play</>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={generateData}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="border-blue-200 bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600/70 uppercase font-medium">Step</p>
                  <p className="text-2xl font-bold text-blue-700">{step}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600/70 uppercase font-medium">Comparisons</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.comparisons}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Network className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600/70 uppercase font-medium">Operations</p>
                  <p className="text-2xl font-bold text-blue-700">{stats.operations}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600/70 uppercase font-medium">Data Size</p>
                  <p className="text-2xl font-bold text-blue-700">{data.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-white/80 backdrop-blur">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600/70 uppercase font-medium">Status</p>
                  <p className="text-2xl font-bold text-blue-700">{isPlaying ? 'Running' : 'Idle'}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPlaying ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-4">
            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-900">Data Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {DSACATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedAlgorithm(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'hover:bg-blue-50 text-blue-700'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    {cat.name}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-900">Algorithms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {currentAlgorithms.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => setSelectedAlgorithm(algo)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                      selectedAlgorithm?.id === algo.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'hover:bg-blue-50 text-blue-700'
                    }`}
                  >
                    <span className="font-medium">{algo.name}</span>
                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-600 bg-blue-50">
                      {algo.complexity}
                    </Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Visualization */}
          <div className="col-span-9">
            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-900 flex items-center gap-2">
                      {selectedAlgorithm ? selectedAlgorithm.name : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Visualization`}
                    </CardTitle>
                    <CardDescription className="text-blue-600/70">
                      {selectedAlgorithm ? selectedAlgorithm.desc : 'Select an algorithm to visualize'}
                    </CardDescription>
                  </div>
                  {selectedAlgorithm && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">{selectedAlgorithm.complexity}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  {activeCategory === 'graph' && (
                    <GraphVisualizer data={data} highlights={highlights} />
                  )}
                  {activeCategory === 'heap' && (
                    <HeapVisualizer data={data} highlights={highlights} />
                  )}
                  {activeCategory === 'segment' && (
                    <SegmentVisualizer data={data} highlights={highlights} />
                  )}
                  {activeCategory === 'unionfind' && (
                    <UnionFindVisualizer data={data} highlights={highlights} />
                  )}
                  {activeCategory === 'bit' && (
                    <BITVisualizer data={data} highlights={highlights} />
                  )}
                </div>

                {selectedAlgorithm && showDetails && (
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">{selectedAlgorithm.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-600/70">Time Complexity:</p>
                            <p className="font-medium text-blue-800">{selectedAlgorithm.complexity}</p>
                          </div>
                          <div>
                            <p className="text-blue-600/70">Description:</p>
                            <p className="font-medium text-blue-800">{selectedAlgorithm.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Reference */}
                {showDetails && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Quick Reference</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-600/70 mb-1">Most Efficient</p>
                        <p className="text-sm font-medium text-blue-800">O(1) - Constant</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-600/70 mb-1">Common</p>
                        <p className="text-sm font-medium text-blue-800">O(log n) - Logarithmic</p>
                      </div>
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-xs text-blue-600/70 mb-1">Linear</p>
                        <p className="text-sm font-medium text-blue-800">O(n) - Linear</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blue-themed Graph Visualizer
function GraphVisualizer({ data, highlights }) {
  const nodes = data.map((val, i) => ({ id: i, value: val }));
  const centerX = 200, centerY = 150, radius = 100;

  const getNodePos = (i, total) => {
    const angle = (2 * Math.PI * i) / total - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <svg width="400" height="300" className="overflow-visible">
      {nodes.map((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length];
        const pos = getNodePos(i, nodes.length);
        const nextPos = getNodePos((i + 1) % nodes.length, nodes.length);
        const isHighlighted = highlights.includes(i);

        return (
          <g key={node.id}>
            <line
              x1={pos.x} y1={pos.y}
              x2={nextPos.x} y2={nextPos.y}
              stroke={isHighlighted ? '#3b82f6' : '#93c5fd'}
              strokeWidth={isHighlighted ? 2 : 1.5}
            />
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isHighlighted ? 24 : 20}
              fill={isHighlighted ? '#3b82f6' : '#dbeafe'}
              stroke={isHighlighted ? '#1d4ed8' : '#3b82f6'}
              strokeWidth={2}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isHighlighted ? 'white' : '#1e40af'}
              fontSize="12"
              fontWeight="bold"
            >
              {node.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Blue-themed Heap Visualizer
function HeapVisualizer({ data, highlights }) {
  const renderNode = (index, x, y, level) => {
    if (index >= data.length) return null;
    const isHighlighted = highlights.includes(index);
    const offset = 120 / (level + 1);

    return (
      <g key={index}>
        {2 * index + 1 < data.length && (
          <line
            x1={x} y1={y}
            x2={x - offset} y2={y + 50}
            stroke={highlights.includes(2 * index + 1) ? '#3b82f6' : '#93c5fd'}
            strokeWidth={highlights.includes(2 * index + 1) ? 2 : 1.5}
          />
        )}
        {2 * index + 2 < data.length && (
          <line
            x1={x} y1={y}
            x2={x + offset} y2={y + 50}
            stroke={highlights.includes(2 * index + 2) ? '#3b82f6' : '#93c5fd'}
            strokeWidth={highlights.includes(2 * index + 2) ? 2 : 1.5}
          />
        )}
        <circle
          cx={x}
          cy={y}
          r={isHighlighted ? 22 : 18}
          fill={isHighlighted ? '#3b82f6' : '#dbeafe'}
          stroke={isHighlighted ? '#1d4ed8' : '#3b82f6'}
          strokeWidth={2}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={isHighlighted ? 'white' : '#1e40af'}
          fontSize="11"
          fontWeight="bold"
        >
          {data[index]}
        </text>
        <text
          x={x}
          y={y + 30}
          textAnchor="middle"
          fill="#3b82f6"
          fontSize="9"
        >
          [{index}]
        </text>
        {renderNode(2 * index + 1, x - offset, y + 50, level + 1)}
        {renderNode(2 * index + 2, x + offset, y + 50, level + 1)}
      </g>
    );
  };

  return (
    <svg width="500" height="300">
      {data.map((_, i) => {
        const level = Math.floor(Math.log2(i + 1));
        const offset = 200 / Math.pow(2, level);
        const x = 250 + (i - Math.pow(2, level) + 0.5) * (400 / Math.pow(2, level));
        const y = 40 + level * 50;
        return renderNode(i, x, y, level);
      })}
    </svg>
  );
}

// Blue-themed Segment Visualizer
function SegmentVisualizer({ data, highlights }) {
  const segmentSize = Math.ceil(data.length / 4);
  const segmentSums = [];
  for (let i = 0; i < Math.ceil(data.length / segmentSize); i++) {
    const start = i * segmentSize;
    const end = Math.min((i + 1) * segmentSize, data.length);
    segmentSums.push(data.slice(start, end).reduce((a, b) => a + b, 0));
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 justify-center flex-wrap">
        {data.map((val, i) => (
          <div
            key={i}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-bold text-sm ${
              highlights.includes(i)
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-blue-50 text-blue-700 border-blue-300'
            }`}
          >
            {val}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {segmentSums.map((sum, i) => (
          <div
            key={i}
            className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold"
          >
            Sum: {sum}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-blue-600/70">
        <p>Segment Tree: Breaks array into segments for efficient range queries</p>
      </div>
    </div>
  );
}

// Blue-themed Union-Find Visualizer
function UnionFindVisualizer({ data, highlights }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 justify-center max-w-lg">
        {data.map((val, i) => (
          <div
            key={i}
            className={`w-14 h-14 flex flex-col items-center justify-center rounded-xl border-2 ${
              highlights.includes(i)
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-blue-50 text-blue-700 border-blue-300'
            }`}
          >
            <span className="text-lg font-bold">{i}</span>
            <span className="text-xs opacity-75">→ {val}</span>
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-blue-600/70">
        <p>Each element points to its parent in the Union-Find structure</p>
        <p className="mt-1">Connected components: {new Set(data).size}</p>
      </div>
    </div>
  );
}

// Blue-themed BIT Visualizer
function BITVisualizer({ data, highlights }) {
  return (
    <div className="space-y-6">
      <div className="flex gap-1 justify-center">
        {data.map((val, i) => (
          <div
            key={i}
            className={`w-10 h-10 flex items-center justify-center rounded font-bold text-sm ${
              highlights.includes(i)
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-700 border border-blue-300'
            }`}
          >
            {val}
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col items-center">
          <div className="px-6 py-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
            Total: {data.reduce((a, b) => a + b, 0)}
          </div>
        </div>
      </div>
      <div className="text-center text-sm text-blue-600/70">
        <p>Binary Indexed Tree stores partial sums for O(log n) queries</p>
      </div>
    </div>
  );
}
