'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Clock, Activity, Play } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const COMPLEXITY_DATA = [
  { n: 10, linear: 10, log: 3, nlogn: 33, quadratic: 100 },
  { n: 100, linear: 100, log: 7, nlogn: 664, quadratic: 10000 },
  { n: 1000, linear: 1000, log: 10, nlogn: 9966, quadratic: 1000000 },
  { n: 10000, linear: 10000, log: 13, nlogn: 132877, quadratic: 100000000 },
  { n: 100000, linear: 100000, log: 17, nlogn: 1666666, quadratic: 10000000000 }
];

const ALGO_COMPARISON = [
  { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', stable: false },
  { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', stable: true },
  { name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', stable: false },
  { name: 'Counting Sort', best: 'O(n+k)', avg: 'O(n+k)', worst: 'O(n+k)', space: 'O(k)', stable: true },
  { name: 'Radix Sort', best: 'O(nk)', avg: 'O(nk)', worst: 'O(nk)', space: 'O(n+k)', stable: false },
  { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: true },
  { name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', stable: false }
];

const OPERATION_COSTS = [
  { operation: 'CPU Cycle', cost: 0.3, unit: 'ns', color: '#0891B2' },
  { operation: 'L1 Cache', cost: 0.9, unit: 'ns', color: '#0E7490' },
  { operation: 'L2 Cache', cost: 2.8, unit: 'ns', color: '#164E63' },
  { operation: 'Memory', cost: 100, unit: 'ns', color: '#6366F1' },
  { operation: 'SSD Read', cost: 100000, unit: 'ns', color: '#8B5CF6' },
  { operation: 'Network', cost: 100000000, unit: 'ns', color: '#EC4899' }
];

const DSA_CATEGORIES = [
  { name: 'Arrays', ops: 1000000, avgTime: '0.001ms', icon: '📦' },
  { name: 'Linked Lists', ops: 800000, avgTime: '0.002ms', icon: '🔗' },
  { name: 'Hash Tables', ops: 1200000, avgTime: '0.0008ms', icon: '🗂️' },
  { name: 'Binary Trees', ops: 500000, avgTime: '0.002ms', icon: '🌳' },
  { name: 'Graphs', ops: 300000, avgTime: '0.003ms', icon: '🕸️' },
  { name: 'Heaps', ops: 700000, avgTime: '0.001ms', icon: '📊' }
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('complexity');
  const [benchmarkResults, setBenchmarkResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAlgo, setSelectedAlgo] = useState('all');

  const runBenchmarks = async () => {
    setIsRunning(true);
    const sizes = [1000, 5000, 10000, 50000, 100000];
    const results = [];

    for (const size of sizes) {
      const start = performance.now();
      for (let i = 0; i < size; i++) {
        Math.random() * 100;
      }
      const end = performance.now();
      results.push({ size, time: (end - start).toFixed(2), ops: (size / (end - start) * 1000).toFixed(0) });
      await new Promise(r => setTimeout(r, 100));
    }

    setBenchmarkResults(results);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">Performance Analytics</h1>
              <p className="text-sm text-slate-500">
                Algorithm complexity & benchmarking
              </p>
            </div>
          </div>
          <Button 
            onClick={runBenchmarks} 
            disabled={isRunning} 
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Benchmark'}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Operations/sec</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {benchmarkResults.length > 0 ? benchmarkResults[benchmarkResults.length - 1]?.ops : '1.2M'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Avg Time</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {benchmarkResults.length > 0 
                      ? (benchmarkResults.reduce((a, b) => a + parseFloat(b.time), 0) / benchmarkResults.length).toFixed(2)
                      : '0.5'} ms
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">Data Size</p>
                  <p className="text-2xl font-semibold text-slate-900 mt-1">
                    {benchmarkResults.length > 0 ? benchmarkResults[benchmarkResults.length - 1]?.size : '100K'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-teal-600" />
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
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-teal-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 border border-slate-200">
            <TabsTrigger value="complexity" className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Complexity
            </TabsTrigger>
            <TabsTrigger value="algorithms" className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
              <BarChart2 className="w-4 h-4 mr-2" />
              Algorithms
            </TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
              <Activity className="w-4 h-4 mr-2" />
              Operation Costs
            </TabsTrigger>
            <TabsTrigger value="benchmark" className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
              <Play className="w-4 h-4 mr-2" />
              Benchmark
            </TabsTrigger>
          </TabsList>

          <TabsContent value="complexity" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Big O Complexity Chart</CardTitle>
                <CardDescription className="text-slate-500">
                  Compare how different complexity classes grow as input size increases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={COMPLEXITY_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="n" tickFormatter={(v) => v.toLocaleString()} stroke="#64748B" />
                      <YAxis tickFormatter={(v) => `${v.toExponential(0)}`} stroke="#64748B" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}
                        formatter={(value) => [`${value.toExponential(0)}`, 'Operations']}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="log" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} name="O(log n)" />
                      <Line type="monotone" dataKey="linear" stroke="#0891B2" strokeWidth={2.5} dot={{ fill: '#0891B2', r: 4 }} name="O(n)" />
                      <Line type="monotone" dataKey="nlogn" stroke="#6366F1" strokeWidth={2.5} dot={{ fill: '#6366F1', r: 4 }} name="O(n log n)" />
                      <Line type="monotone" dataKey="quadratic" stroke="#F59E0B" strokeWidth={2.5} dot={{ fill: '#F59E0B', r: 4 }} name="O(n²)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-4 gap-4 mt-6">
                  {[
                    { color: '#8B5CF6', name: 'O(log n)', desc: 'Logarithmic - Excellent' },
                    { color: '#0891B2', name: 'O(n)', desc: 'Linear - Good' },
                    { color: '#6366F1', name: 'O(n log n)', desc: 'Linearithmic - Very Good' },
                    { color: '#F59E0B', name: 'O(n²)', desc: 'Quadratic - Poor' }
                  ].map((item) => (
                    <div key={item.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Additional Complexity Classes */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-800 mb-3">More Complexity Classes</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-teal-500" />
                      <span className="text-slate-600">O(1) - Constant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-slate-600">O(n²) - Quadratic</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-slate-600">O(2ⁿ) - Exponential</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-500" />
                      <span className="text-slate-600">O(n!) - Factorial</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-sky-500" />
                      <span className="text-slate-600">O(√n) - Square Root</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-violet-500" />
                      <span className="text-slate-600">O(n² log n)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="algorithms" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-slate-900">Sorting Algorithm Comparison</CardTitle>
                    <CardDescription className="text-slate-500">
                      Compare time and space complexity across different sorting algorithms
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'efficient', 'unstable'].map((filter) => (
                      <Button
                        key={filter}
                        variant={selectedAlgo === filter ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedAlgo(filter)}
                        className={selectedAlgo === filter ? 'bg-teal-600' : 'border-slate-300'}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </Button>
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
                      {ALGO_COMPARISON.map((algo) => (
                        <tr key={algo.name} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 text-sm font-medium text-slate-800">{algo.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-slate-300 text-slate-600 bg-slate-50">{algo.best}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="border-slate-300 text-slate-600 bg-slate-50">{algo.avg}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className={algo.worst === 'O(n²)' ? 'border-amber-300 text-amber-600 bg-amber-50' : 'border-slate-300 text-slate-600 bg-slate-50'}>
                              {algo.worst}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">{algo.space}</td>
                          <td className="py-3 px-4">
                            {algo.stable ? (
                              <span className="text-emerald-600 font-medium">✓ Yes</span>
                            ) : (
                              <span className="text-amber-600 font-medium">✗ No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-500">{getUseCase(algo.name)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Algorithm Recommendations */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">✓ Best for Small Data</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Insertion Sort - Nearly sorted data</li>
                      <li>• Bubble Sort - Educational purposes</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">✓ Best for Large Data</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Merge Sort - Stable, guaranteed O(n log n)</li>
                      <li>• Quick Sort - Best average performance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Relative Operation Costs</CardTitle>
                <CardDescription className="text-slate-500">
                  Approximate time costs of various computer operations (modern hardware)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={OPERATION_COSTS} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis type="log" tickFormatter={(v) => `${v}ns`} stroke="#64748B" />
                      <YAxis dataKey="operation" type="category" width={100} stroke="#64748B" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                        }}
                        formatter={(value) => [`${value} ns`, 'Cost']}
                      />
                      <Bar dataKey="cost" fill="#0891B2" radius={[0, 4, 4, 0]}>
                        {OPERATION_COSTS.map((entry, index) => (
                          <cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Insights */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-5 h-5 text-teal-600" />
                      <h4 className="font-semibold text-slate-800">Fastest</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      CPU cycles and cache access are orders of magnitude faster than memory access
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-slate-800">Key Insight</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      1 disk seek ≈ 10 million CPU cycles - optimize for cache locality
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-violet-50 border border-violet-200">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart2 className="w-5 h-5 text-violet-600" />
                      <h4 className="font-semibold text-slate-800">Network Cost</h4>
                    </div>
                    <p className="text-sm text-slate-600">
                      Network requests are extremely expensive - batch where possible
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="benchmark" className="mt-6">
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Live Benchmark Results</CardTitle>
                <CardDescription className="text-slate-500">
                  Real-time performance metrics for array operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {benchmarkResults.length > 0 ? (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={benchmarkResults}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                          <XAxis dataKey="size" tickFormatter={(v) => v.toLocaleString()} stroke="#64748B" />
                          <YAxis stroke="#64748B" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #E2E8F0',
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                            }}
                            formatter={(value) => [`${value}ms`, 'Time']}
                          />
                          <Bar dataKey="time" fill="#0891B2" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-5 gap-4 mt-6">
                      {benchmarkResults.map((result) => (
                        <div key={result.size} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <p className="text-xs text-slate-500 mb-1">Size: {result.size.toLocaleString()}</p>
                          <p className="text-xl font-semibold text-slate-900">{result.time}ms</p>
                          <p className="text-xs text-slate-500">{result.ops} ops/s</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-4">
                      Click "Run Benchmark" to start performance testing
                    </p>
                    <Button onClick={runBenchmarks} className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm">
                      <Play className="w-4 h-4 mr-2" />
                      Start Benchmark
                    </Button>
                  </div>
                )}

                {/* DSA Performance Overview */}
                <div className="mt-8">
                  <h4 className="font-semibold text-slate-900 mb-4">DSA Operation Performance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {DSA_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{cat.icon}</span>
                          <span className="font-medium text-slate-800">{cat.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Ops/sec:</span>
                          <span className="text-slate-700 font-medium">{cat.ops.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getUseCase(name) {
  const useCases = {
    'Bubble Sort': 'Small datasets, educational',
    'Quick Sort': 'General purpose, in-memory sorting',
    'Merge Sort': 'External sorting, stable sorting',
    'Heap Sort': 'Memory-constrained environments',
    'Counting Sort': 'Integer sorting with limited range',
    'Radix Sort': 'String/integer sorting',
    'Insertion Sort': 'Nearly sorted data, small datasets',
    'Selection Sort': 'Simple implementations',
  };
  return useCases[name] || 'General use';
}
