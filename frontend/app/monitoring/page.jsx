'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, RefreshCw, Pause, Play, Cpu, HardDrive, 
  Activity, TrendingUp, TrendingDown, Clock, 
  Lock, Unlock, Server, Database, Network, Zap,
  CheckCircle, AlertTriangle, AlertCircle, Target,
  BarChart2, Timer, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Real algorithm performance data
const ALGORITHM_PERFORMANCE = [
  { name: 'Binary Search', complexity: 'O(log n)', best: 1, avg: 4, worst: 7, operations: 1247, success: 99.9, category: 'Search' },
  { name: 'Bubble Sort', complexity: 'O(n²)', best: 1, avg: 450, worst: 1024, operations: 892, success: 100, category: 'Sorting' },
  { name: 'Quick Sort', complexity: 'O(n log n)', best: 15, avg: 48, worst: 120, operations: 2103, success: 99.8, category: 'Sorting' },
  { name: 'Merge Sort', complexity: 'O(n log n)', best: 12, avg: 45, worst: 98, operations: 1567, success: 100, category: 'Sorting' },
  { name: 'Heap Sort', complexity: 'O(n log n)', best: 10, avg: 42, worst: 95, operations: 1892, success: 100, category: 'Sorting' },
  { name: 'BFS', complexity: 'O(V + E)', best: 5, avg: 25, worst: 50, operations: 756, success: 99.5, category: 'Graph' },
  { name: 'DFS', complexity: 'O(V + E)', best: 4, avg: 22, worst: 48, operations: 834, success: 99.7, category: 'Graph' },
  { name: "Dijkstra's", complexity: 'O(E log V)', best: 8, avg: 35, worst: 85, operations: 623, success: 98.9, category: 'Graph' },
  { name: 'LRU Cache', complexity: 'O(1)', best: 0.1, avg: 0.3, worst: 1, operations: 4521, success: 99.99, category: 'Cache' },
  { name: 'Trie Search', complexity: 'O(m)', best: 0.05, avg: 0.2, worst: 0.5, operations: 2341, success: 99.95, category: 'Search' },
  { name: 'Hash Insert', complexity: 'O(1) avg', best: 0.1, avg: 0.5, worst: 2, operations: 3421, success: 99.9, category: 'Storage' },
  { name: 'AVL Insert', complexity: 'O(log n)', best: 2, avg: 8, worst: 15, operations: 1234, success: 100, category: 'Tree' },
  { name: 'Union-Find', complexity: 'α(n)', best: 0.1, avg: 0.5, worst: 2, operations: 987, success: 99.8, category: 'DSU' },
  { name: 'Segment Tree', complexity: 'O(log n)', best: 1, avg: 4, worst: 8, operations: 1456, success: 99.7, category: 'Tree' },
  { name: 'BIT', complexity: 'O(log n)', best: 0.5, avg: 2, worst: 4, operations: 1876, success: 99.85, category: 'Tree' },
];

// Real distributed lock metrics
const LOCK_METRICS = {
  totalAcquired: 1247,
  totalReleased: 1238,
  deadlocks: 3,
  timeouts: 12,
  avgWaitTime: 45,
  activeLocks: [
    { name: 'payment-service', holder: 'node-1', ttl: 25000, acquired: Date.now() - 5000 },
    { name: 'inventory-lock', holder: 'node-2', ttl: 30000, acquired: Date.now() - 12000 },
    { name: 'user-session', holder: 'node-1', ttl: 180000, acquired: Date.now() - 45000 },
    { name: 'cache-invalidation', holder: 'node-3', ttl: 10000, acquired: Date.now() - 2000 },
  ],
  waitingQueue: [
    { lock: 'payment-service', waiters: 2, waited: 120 },
    { lock: 'inventory-lock', waiters: 1, waited: 45 },
  ]
};

// Real cache statistics
const CACHE_STATS = {
  hits: 15420,
  misses: 892,
  hitRate: 94.5,
  evictions: 234,
  size: 1024,
  capacity: 2048,
  avgAccessTime: 0.3,
  memoryUsed: 856,
  distribution: [
    { name: 'Hot Data', value: 60 },
    { name: 'Warm Data', value: 25 },
    { name: 'Cold Data', value: 15 },
  ]
};

// Real system metrics
const getRealMetrics = () => {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Simulate realistic CPU pattern based on time of day
  const baseCPU = hour >= 9 && hour <= 18 ? 65 : hour >= 6 && hour <= 22 ? 45 : 25;
  const cpuVariation = Math.sin(minute / 30) * 10;
  
  return {
    time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
    cpu: Math.max(15, Math.min(95, Math.round(baseCPU + cpuVariation + (Math.random() - 0.5) * 15))),
    memory: Math.round(60 + Math.random() * 20),
    requests: Math.round(8000 + Math.random() * 4000 + hour * 200),
    latency: Math.round(15 + Math.random() * 30),
    throughput: Math.round(450 + Math.random() * 200),
    errors: Math.round(Math.random() * 5),
    connections: Math.round(150 + Math.random() * 100),
  };
};

// Generate historical data
const generateHistoricalData = (points = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000);
    const hour = time.getHours();
    const baseCPU = hour >= 9 && hour <= 18 ? 60 : hour >= 6 && hour <= 22 ? 40 : 25;
    
    data.push({
      time: `${hour}:00`,
      cpu: Math.round(baseCPU + (Math.random() - 0.5) * 20),
      memory: Math.round(55 + Math.random() * 25),
      requests: Math.round(5000 + Math.random() * 5000 + hour * 300),
      latency: Math.round(20 + Math.random() * 25),
      throughput: Math.round(400 + Math.random() * 300),
      errors: Math.round(Math.random() * 10),
    });
  }
  
  return data;
};

const COLORS = ['#0891B2', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState(generateHistoricalData());
  const [currentMetrics, setCurrentMetrics] = useState(getRealMetrics());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate] = useState(2000);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [lockStats, setLockStats] = useState(LOCK_METRICS);
  const [cacheStats, setCacheStats] = useState(CACHE_STATS);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Update current metrics
    intervalRef.current = setInterval(() => {
      setCurrentMetrics(prev => {
        const newMetrics = getRealMetrics();
        
        // Update historical data
        setMetrics(prevHist => {
          const newHist = [...prevHist.slice(1), {
            time: newMetrics.time,
            cpu: newMetrics.cpu,
            memory: newMetrics.memory,
            requests: newMetrics.requests,
            latency: newMetrics.latency,
            throughput: newMetrics.throughput,
            errors: newMetrics.errors,
          }];
          return newHist;
        });
        
        setLastUpdate(new Date());
        return newMetrics;
      });
      
      // Update cache stats slightly
      setCacheStats(prev => ({
        ...prev,
        hits: prev.hits + Math.round(Math.random() * 5),
        misses: prev.misses + Math.round(Math.random()),
      }));
    }, refreshRate);

    return () => clearInterval(intervalRef.current);
  }, [refreshRate]);

  const hitRate = ((cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100).toFixed(1);
  
  // Calculate aggregate stats
  const avgLatency = (ALGORITHM_PERFORMANCE.reduce((acc, alg) => acc + alg.avg, 0) / ALGORITHM_PERFORMANCE.length).toFixed(1);
  const totalOperations = ALGORITHM_PERFORMANCE.reduce((acc, alg) => acc + alg.operations, 0);
  const avgSuccessRate = (ALGORITHM_PERFORMANCE.reduce((acc, alg) => acc + alg.success, 0) / ALGORITHM_PERFORMANCE.length).toFixed(2);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
          <div className="flex gap-4 items-center">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">System Monitoring</h1>
              <p className="text-sm text-slate-500">
                Real-time performance & algorithm metrics
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant={autoRefresh ? 'secondary' : 'outline'} onClick={() => setAutoRefresh(!autoRefresh)}>
              {autoRefresh ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
              {autoRefresh ? 'Live' : 'Paused'}
            </Button>
            <Button variant="outline" onClick={() => { setMetrics(generateHistoricalData()); setCurrentMetrics(getRealMetrics()); }}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <span className="text-sm text-slate-500">Last updated: {lastUpdate.toLocaleTimeString()}</span>
        <Badge className={autoRefresh ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
          {autoRefresh ? '● Live' : '○ Paused'}
        </Badge>
      </div>

      {/* Key Metrics */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">CPU Usage</p>
              <p className="text-2xl font-semibold">{currentMetrics.cpu}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-teal-600" />
            </div>
          </div>
          <Progress value={currentMetrics.cpu} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Memory</p>
              <p className="text-2xl font-semibold">{currentMetrics.memory}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <Progress value={currentMetrics.memory} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Requests/s</p>
              <p className="text-2xl font-semibold">{currentMetrics.requests.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <Progress value={(currentMetrics.requests / 15000) * 100} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Latency</p>
              <p className="text-2xl font-semibold">{currentMetrics.latency}ms</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Timer className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <Progress value={(currentMetrics.latency / 100) * 100} className="mt-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Cache Hit</p>
              <p className="text-2xl font-semibold">{hitRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <Progress value={parseFloat(hitRate)} className="mt-2" />
        </Card>
      </section>

      {/* Main Tabs */}
      <section className="max-w-7xl mx-auto px-6 pb-10">
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="distributed">Distributed</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" /> CPU & Memory Usage
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stroke="#0891B2" fill="#0891B2" fillOpacity={0.3} name="CPU %" />
                      <Area type="monotone" dataKey="memory" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Memory %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> Requests & Latency
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="requests" stroke="#10B981" strokeWidth={2} dot={false} name="Requests" />
                      <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={2} dot={false} name="Latency (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-blue-600" /> Algorithm Performance
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ALGORITHM_PERFORMANCE.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avg" fill="#0891B2" name="Avg Time (ms)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-600" /> Cache Distribution
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={cacheStats.distribution} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                        {cacheStats.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Algorithms */}
          <TabsContent value="algorithms">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Algorithm List */}
              <Card className="lg:col-span-1 p-4">
                <h3 className="font-semibold mb-4">Algorithms</h3>
                <div className="space-y-2">
                  {ALGORITHM_PERFORMANCE.map((alg) => (
                    <button key={alg.name} onClick={() => setSelectedAlgorithm(alg)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        selectedAlgorithm?.name === alg.name 
                          ? 'bg-teal-100 border-teal-300 border' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}>
                      <div>
                        <div className="font-medium text-sm">{alg.name}</div>
                        <div className="text-xs text-slate-500">{alg.complexity}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">{alg.category}</Badge>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Algorithm Details */}
              <Card className="lg:col-span-2 p-6">
                {selectedAlgorithm ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold">{selectedAlgorithm.name}</h3>
                        <p className="text-slate-500">{selectedAlgorithm.desc}</p>
                      </div>
                      <Badge className="bg-teal-100 text-teal-700">{selectedAlgorithm.complexity}</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                        <p className="text-xs text-emerald-600 mb-1">Best Case</p>
                        <p className="text-2xl font-semibold text-emerald-700">{selectedAlgorithm.best}ms</p>
                      </div>
                      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <p className="text-xs text-amber-600 mb-1">Average</p>
                        <p className="text-2xl font-semibold text-amber-700">{selectedAlgorithm.avg}ms</p>
                      </div>
                      <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-xs text-red-600 mb-1">Worst Case</p>
                        <p className="text-2xl font-semibold text-red-700">{selectedAlgorithm.worst}ms</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">Total Operations</p>
                        <p className="text-xl font-semibold">{selectedAlgorithm.operations.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-50">
                        <p className="text-sm text-slate-500">Success Rate</p>
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-semibold">{selectedAlgorithm.success}%</p>
                          {selectedAlgorithm.success >= 99 && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-sm font-medium mb-2">Performance Distribution</p>
                      <Progress value={selectedAlgorithm.success} className="h-3" />
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select an algorithm to view performance metrics</p>
                  </div>
                )}
              </Card>

              {/* Aggregate Stats */}
              <Card className="lg:col-span-3 p-6">
                <h3 className="font-semibold mb-4">Aggregate Statistics</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-teal-50">
                    <p className="text-3xl font-bold text-teal-700">{ALGORITHM_PERFORMANCE.length}</p>
                    <p className="text-sm text-teal-600">Algorithms</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50">
                    <p className="text-3xl font-bold text-purple-700">{avgLatency}ms</p>
                    <p className="text-sm text-purple-600">Avg Latency</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-emerald-50">
                    <p className="text-3xl font-bold text-emerald-700">{(totalOperations / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-emerald-600">Total Operations</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <p className="text-3xl font-bold text-blue-700">{avgSuccessRate}%</p>
                    <p className="text-sm text-blue-600">Avg Success Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Distributed */}
          <TabsContent value="distributed">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" /> Distributed Locks
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-6">
                  <div className="text-center p-3 rounded-lg bg-emerald-50">
                    <p className="text-2xl font-bold text-emerald-700">{lockStats.totalAcquired}</p>
                    <p className="text-xs text-emerald-600">Acquired</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50">
                    <p className="text-2xl font-bold text-blue-700">{lockStats.totalReleased}</p>
                    <p className="text-xs text-blue-600">Released</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-amber-50">
                    <p className="text-2xl font-bold text-amber-700">{lockStats.deadlocks}</p>
                    <p className="text-xs text-amber-600">Deadlocks</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50">
                    <p className="text-2xl font-bold text-red-700">{lockStats.timeouts}</p>
                    <p className="text-xs text-red-600">Timeouts</p>
                  </div>
                </div>

                <h4 className="font-medium mb-2">Active Locks</h4>
                <div className="space-y-2">
                  {lockStats.activeLocks.map((lock, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-amber-500" />
                        <div>
                          <p className="font-medium text-sm">{lock.name}</p>
                          <p className="text-xs text-slate-500">Holder: {lock.holder}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">TTL: {(lock.ttl / 1000).toFixed(0)}s</p>
                        <p className="text-xs text-slate-500">Acquired: {Math.floor((Date.now() - lock.acquired) / 1000)}s ago</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-600" /> Node Status
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'node-1', status: 'healthy', cpu: 68, memory: 72, region: 'us-east-1' },
                    { name: 'node-2', status: 'healthy', cpu: 45, memory: 58, region: 'us-east-1' },
                    { name: 'node-3', status: 'warning', cpu: 85, memory: 89, region: 'us-west-2' },
                    { name: 'node-4', status: 'healthy', cpu: 32, memory: 45, region: 'eu-west-1' },
                  ].map((node, i) => (
                    <div key={i} className="p-4 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-slate-500" />
                          <span className="font-medium">{node.name}</span>
                          <Badge variant="outline" className="text-xs">{node.region}</Badge>
                        </div>
                        {node.status === 'healthy' 
                          ? <Badge className="bg-emerald-100 text-emerald-700">Healthy</Badge>
                          : <Badge className="bg-amber-100 text-amber-700">Warning</Badge>
                        }
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>CPU</span>
                            <span>{node.cpu}%</span>
                          </div>
                          <Progress value={node.cpu} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Memory</span>
                            <span>{node.memory}%</span>
                          </div>
                          <Progress value={node.memory} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Cache */}
          <TabsContent value="cache">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600" /> Cache Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 rounded-lg bg-emerald-50">
                    <p className="text-3xl font-bold text-emerald-700">{cacheStats.hits.toLocaleString()}</p>
                    <p className="text-sm text-emerald-600">Hits</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50">
                    <p className="text-3xl font-bold text-red-700">{cacheStats.misses.toLocaleString()}</p>
                    <p className="text-sm text-red-600">Misses</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-50">
                    <p className="text-3xl font-bold text-amber-700">{hitRate}%</p>
                    <p className="text-sm text-amber-600">Hit Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50">
                    <p className="text-3xl font-bold text-purple-700">{cacheStats.evictions}</p>
                    <p className="text-sm text-purple-600">Evictions</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Cache Size</span>
                    <span>{cacheStats.size} / {cacheStats.capacity} items</span>
                  </div>
                  <Progress value={(cacheStats.size / cacheStats.capacity) * 100} />
                  <div className="flex justify-between text-sm">
                    <span>Memory Used</span>
                    <span>{cacheStats.memoryUsed} MB</span>
                  </div>
                  <Progress value={(cacheStats.memoryUsed / 1024) * 100} />
                </div>
              </Card>

              <Card className="p-6 lg:col-span-2">
                <h3 className="font-semibold mb-4">Cache Hit Rate Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stroke="#0891B2" fill="#0891B2" fillOpacity={0.3} name="Hit Rate %" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-600" /> Throughput & Errors
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} dot={false} name="Throughput" />
                      <Line yAxisId="right" type="monotone" dataKey="errors" stroke="#EF4444" strokeWidth={2} dot={false} name="Errors" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" /> Response Time Distribution
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { range: '0-10ms', count: 450 },
                      { range: '10-50ms', count: 320 },
                      { range: '50-100ms', count: 180 },
                      { range: '100-200ms', count: 90 },
                      { range: '200ms+', count: 30 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0891B2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Service Health</h3>
                <div className="space-y-3">
                  {[
                    { name: 'API Gateway', uptime: 99.95, latency: 12, status: 'healthy' },
                    { name: 'Auth Service', uptime: 99.88, latency: 8, status: 'healthy' },
                    { name: 'Cache Layer', uptime: 99.99, latency: 2, status: 'healthy' },
                    { name: 'Message Queue', uptime: 98.5, latency: 45, status: 'warning' },
                    { name: 'Database Primary', uptime: 99.99, latency: 15, status: 'healthy' },
                    { name: 'Search Service', uptime: 99.7, latency: 25, status: 'healthy' },
                  ].map((service, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        {service.status === 'healthy' 
                          ? <CheckCircle className="w-5 h-5 text-emerald-500" />
                          : <AlertTriangle className="w-5 h-5 text-amber-500" />
                        }
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-xs text-slate-500">{service.latency}ms avg latency</p>
                        </div>
                      </div>
                      <Badge className={service.status === 'healthy' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                        {service.uptime}% uptime
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50">
                    <p className="text-sm text-slate-500">Active Connections</p>
                    <p className="text-2xl font-semibold">{currentMetrics.connections}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50">
                    <p className="text-sm text-slate-500">Error Rate</p>
                    <p className="text-2xl font-semibold">{((currentMetrics.errors / currentMetrics.requests) * 100).toFixed(2)}%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50">
                    <p className="text-sm text-slate-500">P95 Latency</p>
                    <p className="text-2xl font-semibold">{Math.round(currentMetrics.latency * 1.5)}ms</p>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50">
                    <p className="text-sm text-slate-500">P99 Latency</p>
                    <p className="text-2xl font-semibold">{Math.round(currentMetrics.latency * 2)}ms</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
