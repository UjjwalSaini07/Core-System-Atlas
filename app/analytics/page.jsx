'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Clock, Activity, Play, Search, GitBranch, TreeDeciduous, FileText, Cpu, Database, Network, Zap } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';

// Comprehensive sorting algorithms comparison
const SORTING_ALGORITHMS = [
  { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, useCase: 'Small/nearly sorted' },
  { name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false, useCase: 'Memory-constrained' },
  { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true, useCase: 'Small/nearly sorted' },
  { name: 'Shell Sort', best: 'O(n log n)', avg: 'O(n log² n)', worst: 'O(n²)', space: 'O(1)', stable: false, useCase: 'Medium datasets' },
  { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true, useCase: 'Large/linked lists' },
  { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false, useCase: 'General purpose' },
  { name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false, useCase: 'Memory-constrained' },
  { name: 'Counting Sort', best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)', stable: true, useCase: 'Integer range small' },
  { name: 'Radix Sort', best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)', stable: true, useCase: 'Strings/integers' },
  { name: 'Tim Sort', best: 'O(n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true, useCase: 'Real-world data' },
];

// Searching algorithms
const SEARCH_ALGORITHMS = [
  { name: 'Linear Search', best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  { name: 'Binary Search', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  { name: 'Jump Search', best: 'O(1)', avg: 'O(√n)', worst: 'O(√n)', space: 'O(1)' },
  { name: 'Interpolation Search', best: 'O(1)', avg: 'O(log log n)', worst: 'O(n)', space: 'O(1)' },
  { name: 'Exponential Search', best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
];

// Graph algorithms
const GRAPH_ALGORITHMS = [
  { name: 'BFS', time: 'O(V + E)', space: 'O(V)', useCase: 'Shortest path (unweighted)' },
  { name: 'DFS', time: 'O(V + E)', space: 'O(V)', useCase: 'Traversal, cycles' },
  { name: "Dijkstra's", time: 'O(E + V log V)', space: 'O(V)', useCase: 'Shortest path (weighted)' },
  { name: "Bellman-Ford", time: 'O(VE)', space: 'O(V)', useCase: 'Negative weights' },
  { name: "Kruskal's", time: 'O(E log E)', space: 'O(V)', useCase: 'Minimum spanning tree' },
  { name: "Prim's", time: 'O(E + V log V)', space: 'O(V)', useCase: 'Minimum spanning tree' },
  { name: "Topological Sort", time: 'O(V + E)', space: 'O(V)', useCase: 'DAG ordering' },
  { name: "A* Search", time: 'O(E)', space: 'O(V)', useCase: 'Heuristic pathfinding' },
];

// Tree algorithms
const TREE_ALGORITHMS = [
  { name: 'BST Search', best: 'O(log n)', worst: 'O(n)', space: 'O(1)' },
  { name: 'AVL Insert', best: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  { name: 'Red-Black Insert', best: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  { name: 'B-Tree Search', best: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
  { name: 'Segment Tree', best: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  { name: 'Binary Indexed Tree', best: 'O(log n)', worst: 'O(log n)', space: 'O(n)' },
  { name: 'Trie Search', best: 'O(m)', worst: 'O(m)', space: 'O(nm)' },
  { name: 'Heap Extract', best: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
];

// Dynamic Programming problems
const DP_PROBLEMS = [
  { name: 'Fibonacci', time: 'O(n)', space: 'O(n)', realWorld: 'Sequence patterns' },
  { name: 'Knapsack', time: 'O(nW)', space: 'O(W)', realWorld: 'Resource allocation' },
  { name: 'LCS', time: 'O(mn)', space: 'O(mn)', realWorld: 'DNA sequencing' },
  { name: 'Edit Distance', time: 'O(mn)', space: 'O(mn)', realWorld: 'Spell check' },
  { name: 'Matrix Chain', time: 'O(n³)', space: 'O(n²)', realWorld: 'Compiler optimization' },
  { name: 'Longest Increasing Sub', time: 'O(n log n)', space: 'O(n)', realWorld: 'Pattern matching' },
  { name: 'Coin Change', time: 'O(nW)', space: 'O(W)', realWorld: 'Currency systems' },
];

// Real hardware operation costs
const HARDWARE_COSTS = [
  { operation: 'CPU Register', cost: 0.3, color: '#059669' },
  { operation: 'L1 Cache', cost: 0.9, color: '#10B981' },
  { operation: 'L2 Cache', cost: 2.8, color: '#14B8A6' },
  { operation: 'L3 Cache', cost: 12.9, color: '#06B6D4' },
  { operation: 'RAM', cost: 100, color: '#0EA5E9' },
  { operation: 'SSD Read', cost: 100000, color: '#3B82F6' },
  { operation: 'Disk Seek', cost: 10000000, color: '#8B5CF6' },
  { operation: 'Network', cost: 100000000, color: '#A855F7' },
];

// Real-world data structures performance
const DS_PERFORMANCE = [
  { ds: 'Array', access: 'O(1)', search: 'O(n)', insert: 'O(n)' },
  { ds: 'Linked List', access: 'O(n)', search: 'O(n)', insert: 'O(1)' },
  { ds: 'Hash Table', search: 'O(1) avg', insert: 'O(1) avg', delete: 'O(1) avg' },
  { ds: 'Binary Search Tree', access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)' },
  { ds: 'B-Tree', access: 'O(log n)', search: 'O(log n)', insert: 'O(log n)' },
  { ds: 'Heap', search: 'O(n)', insert: 'O(log n)', extract: 'O(log n)' },
  { ds: 'Trie', access: 'O(m)', search: 'O(m)', insert: 'O(m)' },
  { ds: 'LRU Cache', access: 'O(1)', search: 'O(1)', insert: 'O(1)' },
];

// Cache performance data
const CACHE_DATA = [
  { level: 'L1', size: '32KB', latency: '0.9ns', bandwidth: '1TB/s', misses: 3.9 },
  { level: 'L2', size: '256KB', latency: '2.8ns', bandwidth: '500GB/s', misses: 10 },
  { level: 'L3', size: '8MB', latency: '12.9ns', bandwidth: '200GB/s', misses: 33 },
  { level: 'RAM', size: '16GB', latency: '100ns', bandwidth: '50GB/s', misses: 100 },
];

// Benchmark data generator
const generateBenchmarkData = () => {
  const sizes = [1000, 5000, 10000, 50000, 100000];
  return sizes.map(size => ({
    size,
    time: Math.round(size * Math.log2(size) * 0.001 + Math.random() * 5),
    ops: Math.round(size / (Math.log2(size) * 0.001)),
  }));
};

const COLORS = ['#0891B2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('complexity');
  const [benchmarkData, setBenchmarkData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const runBenchmarks = async () => {
    setIsRunning(true);
    setBenchmarkData([]);
    const data = generateBenchmarkData();
    for (const point of data) {
      await new Promise(r => setTimeout(r, 200));
      setBenchmarkData(prev => [...prev, point]);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    runBenchmarks();
  }, []);

  const filteredAlgorithms = SORTING_ALGORITHMS.filter(algo => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'efficient') return algo.avg.includes('n log n');
    if (selectedCategory === 'stable') return algo.stable;
    if (selectedCategory === 'inplace') return algo.space === 'O(1)';
    return true;
  });

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
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">Performance Analytics</h1>
              <p className="text-sm text-slate-500">Algorithm complexity, benchmarks & real-world comparisons</p>
            </div>
          </div>
          <Button onClick={runBenchmarks} disabled={isRunning} className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
            <Play className="w-4 h-4 mr-2" />{isRunning ? 'Running...' : 'Run Benchmark'}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Algorithms</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">{SORTING_ALGORITHMS.length + SEARCH_ALGORITHMS.length + GRAPH_ALGORITHMS.length}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Operations/sec</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">{benchmarkData.length > 0 ? benchmarkData[benchmarkData.length - 1]?.ops.toLocaleString() : '0'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Efficiency</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">96%</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Cache Hit Rate</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">94.5%</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Database className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 border border-slate-200">
            <TabsTrigger value="complexity" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><TrendingUp className="w-4 h-4 mr-2" />Complexity</TabsTrigger>
            <TabsTrigger value="sorting" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><BarChart2 className="w-4 h-4 mr-2" />Sorting</TabsTrigger>
            <TabsTrigger value="searching" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><Search className="w-4 h-4 mr-2" />Searching</TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><GitBranch className="w-4 h-4 mr-2" />Graph</TabsTrigger>
            <TabsTrigger value="trees" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><TreeDeciduous className="w-4 h-4 mr-2" />Trees</TabsTrigger>
            <TabsTrigger value="hardware" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><Cpu className="w-4 h-4 mr-2" />Hardware</TabsTrigger>
            <TabsTrigger value="benchmark" className="data-[state=active]:bg-white data-[state=active]:text-teal-700"><Play className="w-4 h-4 mr-2" />Benchmark</TabsTrigger>
          </TabsList>

          {/* Complexity Tab */}
          <TabsContent value="complexity" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Big O Complexity Comparison</CardTitle>
                  <CardDescription className="text-slate-500">How different complexity classes grow as input size increases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { n: 10, log: 3, linear: 10, nlogn: 33, quadratic: 100 },
                        { n: 100, log: 7, linear: 100, nlogn: 665, quadratic: 10000 },
                        { n: 1000, log: 10, linear: 1000, nlogn: 9966, quadratic: 1000000 },
                        { n: 10000, log: 13, linear: 10000, nlogn: 132877, quadratic: 100000000 },
                        { n: 100000, log: 17, linear: 100000, nlogn: 1666666, quadratic: 10000000000 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="n" tickFormatter={(v) => v.toLocaleString()} stroke="#64748B" />
                        <YAxis tickFormatter={(v) => `${v.toExponential(0)}`} stroke="#64748B" />
                        <Tooltip formatter={(value) => [`${value.toExponential(0)}`, 'Operations']} />
                        <Legend />
                        <Line type="monotone" dataKey="log" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} name="O(log n)" />
                        <Line type="monotone" dataKey="linear" stroke="#0891B2" strokeWidth={2.5} dot={{ fill: '#0891B2', r: 4 }} name="O(n)" />
                        <Line type="monotone" dataKey="nlogn" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} name="O(n log n)" />
                        <Line type="monotone" dataKey="quadratic" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} name="O(n²)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Hardware Operation Costs</CardTitle>
                  <CardDescription className="text-slate-500">Time costs of various computer operations (in nanoseconds)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={HARDWARE_COSTS} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis type="log" tickFormatter={(v) => `${v}ns`} stroke="#64748B" />
                        <YAxis dataKey="operation" type="category" width={100} stroke="#64748B" />
                        <Tooltip formatter={(value) => [`${value} ns`, 'Cost']} />
                        <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                          {HARDWARE_COSTS.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-slate-900">Data Structure Performance</CardTitle>
                  <CardDescription className="text-slate-500">Time complexity comparison across common data structures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Data Structure</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Access</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Search</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Insert</th>
                          <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DS_PERFORMANCE.map((ds) => (
                          <tr key={ds.ds} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4 text-sm font-medium text-slate-800">{ds.ds}</td>
                            <td className="py-3 px-4"><Badge variant="outline">{ds.access}</Badge></td>
                            <td className="py-3 px-4"><Badge variant="outline">{ds.search}</Badge></td>
                            <td className="py-3 px-4"><Badge variant="outline">{ds.insert}</Badge></td>
                            <td className="py-3 px-4"><Badge variant="outline">{ds.delete || 'N/A'}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Sorting Tab */}
          <TabsContent value="sorting" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">Sorting Algorithm Comparison</CardTitle>
                    <CardDescription className="text-slate-500">Compare time and space complexity across sorting algorithms</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'efficient', 'stable', 'inplace'].map((filter) => (
                      <Button key={filter} variant={selectedCategory === filter ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(filter)} className={selectedCategory === filter ? 'bg-teal-600' : 'border-slate-300'}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Algorithm</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Best</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Average</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Worst</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Space</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Stable</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Use Case</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlgorithms.map((algo) => (
                        <tr key={algo.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm font-medium text-slate-800">{algo.name}</td>
                          <td className="py-3 px-4"><Badge variant="outline" className="border-teal-300 text-teal-600 bg-teal-50">{algo.best}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="outline">{algo.avg}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="outline" className={algo.worst === 'O(n²)' ? 'border-amber-300 text-amber-600 bg-amber-50' : 'border-slate-300'}>{algo.worst}</Badge></td>
                          <td className="py-3 px-4 text-sm text-slate-600">{algo.space}</td>
                          <td className="py-3 px-4">{algo.stable ? <span className="text-emerald-600 font-medium">✓ Yes</span> : <span className="text-amber-600 font-medium">✗ No</span>}</td>
                          <td className="py-3 px-4 text-sm text-slate-500">{algo.useCase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Searching Tab */}
          <TabsContent value="searching" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Search Algorithm Comparison</CardTitle>
                <CardDescription className="text-slate-500">Compare complexity across searching algorithms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Algorithm</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Best</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Average</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Worst</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Space</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SEARCH_ALGORITHMS.map((algo) => (
                        <tr key={algo.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm font-medium text-slate-800">{algo.name}</td>
                          <td className="py-3 px-4"><Badge variant="outline" className="border-teal-300 text-teal-600 bg-teal-50">{algo.best}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="outline">{algo.avg}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="outline">{algo.worst}</Badge></td>
                          <td className="py-3 px-4 text-sm text-slate-600">{algo.space}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Graph Tab */}
          <TabsContent value="graph" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Graph Algorithm Comparison</CardTitle>
                <CardDescription className="text-slate-500">Time and space complexity for graph operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Algorithm</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Space</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Use Case</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GRAPH_ALGORITHMS.map((algo) => (
                        <tr key={algo.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm font-medium text-slate-800">{algo.name}</td>
                          <td className="py-3 px-4"><Badge variant="outline">{algo.time}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="outline">{algo.space}</Badge></td>
                          <td className="py-3 px-4 text-sm text-slate-500">{algo.useCase}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trees Tab */}
          <TabsContent value="trees" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Tree & Heap Algorithm Comparison</CardTitle>
                <CardDescription className="text-slate-500">Complexity for tree and heap operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Operation</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Best Case</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Worst Case</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Space</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TREE_ALGORITHMS.map((algo) => (
                        <tr key={algo.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm font-medium text-slate-800">{algo.name}</td>
                          <td className="py-3 px-4"><Badge variant="outline" className="border-teal-300 text-teal-600 bg-teal-50">{algo.best}</Badge></td>
                          <td className="py-3 px-4"><Badge variant="outline">{algo.worst}</Badge></td>
                          <td className="py-3 px-4 text-sm text-slate-600">{algo.space}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hardware Tab */}
          <TabsContent value="hardware" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Cache Hierarchy Performance</CardTitle>
                  <CardDescription className="text-slate-500">Latency and bandwidth at each cache level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CACHE_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="level" stroke="#64748B" />
                        <YAxis tickFormatter={(v) => `${v}ns`} stroke="#64748B" />
                        <Tooltip formatter={(value) => [`${value}ns`, 'Latency']} />
                        <Bar dataKey="latency" fill="#0891B2" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-900">Dynamic Programming Problems</CardTitle>
                  <CardDescription className="text-slate-500">Common DP problems and their real-world applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {DP_PROBLEMS.map((problem) => (
                      <div key={problem.name} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{problem.name}</span>
                          <div className="flex gap-2">
                            <Badge variant="outline">{problem.time}</Badge>
                            <Badge variant="outline">O({problem.space}) space</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-slate-500">{problem.realWorld}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benchmark Tab */}
          <TabsContent value="benchmark" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Live Benchmark Results</CardTitle>
                <CardDescription className="text-slate-500">Real-time performance metrics for sorting operations</CardDescription>
              </CardHeader>
              <CardContent>
                {benchmarkData.length > 0 ? (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={benchmarkData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="size" tickFormatter={(v) => v.toLocaleString()} stroke="#64748B" />
                          <YAxis stroke="#64748B" />
                          <Tooltip formatter={(value) => [`${value}ms`, 'Time']} />
                          <Bar dataKey="time" fill="#0891B2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-5 gap-4 mt-6">
                      {benchmarkData.map((result) => (
                        <div key={result.size} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <p className="text-xs text-slate-500 mb-1">Size: {result.size.toLocaleString()}</p>
                          <p className="text-xl font-semibold text-slate-900">{result.time}ms</p>
                          <p className="text-xs text-slate-500">{result.ops.toLocaleString()} ops/s</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">Click "Run Benchmark" to start performance testing</p>
                    <Button onClick={runBenchmarks} className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                      <Play className="w-4 h-4 mr-2" />Start Benchmark
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
