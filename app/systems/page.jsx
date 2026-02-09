'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft, Activity, Server, Database, Shield, Zap, Cpu, HardDrive,
  Network, RefreshCw, AlertTriangle, CheckCircle, TrendingUp, Play, Pause,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// -------------------- System Components --------------------
const SYSTEM_COMPONENTS = [
  { id: 'api', name: 'API Gateway', icon: Network, status: 'healthy', uptime: 99.9, latency: 45 },
  { id: 'auth', name: 'Auth Service', icon: Shield, status: 'healthy', uptime: 99.8, latency: 32 },
  { id: 'cache', name: 'Cache Layer', icon: Database, status: 'healthy', uptime: 99.95, latency: 8 },
  { id: 'compute', name: 'Compute Engine', icon: Cpu, status: 'healthy', uptime: 99.7, latency: 156 },
  { id: 'storage', name: 'Storage System', icon: HardDrive, status: 'healthy', uptime: 99.99, latency: 12 },
  { id: 'queue', name: 'Message Queue', icon: Zap, status: 'warning', uptime: 98.5, latency: 89 },

  // Distributed Patterns
  { id: 'ratelimiter', name: 'Rate Limiter', icon: Zap, status: 'healthy', uptime: 99.2, latency: 20 },
  { id: 'circuitbreaker', name: 'Circuit Breaker', icon: Shield, status: 'healthy', uptime: 99.4, latency: 25 },
  { id: 'loadbalancer', name: 'Load Balancer', icon: Globe, status: 'healthy', uptime: 99.5, latency: 40 }
];

export default function SystemsPage() {

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [metrics, setMetrics] = useState({ cpu: 50, memory: 50, requests: 8000, errors: 2 });
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');

  const addLog = useCallback((type, message) => {
    setLogs(prev => [...prev.slice(-50), { type, message, time: new Date().toLocaleTimeString() }]);
  }, []);

  // ----------- Live Metrics + Historical Storage -----------
  useEffect(() => {

    const interval = setInterval(() => {

      const newMetrics = {
        cpu: Math.floor(Math.random() * 40) + 30,
        memory: Math.floor(Math.random() * 40) + 30,
        requests: Math.floor(Math.random() * 5000) + 5000,
        errors: Math.floor(Math.random() * 8)
      };

      setMetrics(newMetrics);

      setHistory(prev => [
        ...prev.slice(-30),
        { time: new Date().toLocaleTimeString(), ...newMetrics }
      ]);
    }, 2000);
    return () => clearInterval(interval);

  }, []);

  const filtered = useMemo(() => {
    return SYSTEM_COMPONENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const component = SYSTEM_COMPONENTS.find(c => c.id === selectedComponent);
  const avgUptime = SYSTEM_COMPONENTS.reduce((a, c) => a + c.uptime, 0) / SYSTEM_COMPONENTS.length;

  return (

    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="sticky top-0 border-b bg-white z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">

          <div className="flex gap-4 items-center">
            <Link href="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>

            <div>
              <h1 className="text-xl font-semibold">Advanced Systems Dashboard</h1>
              <p className="text-sm text-slate-500">Monitoring + Distributed System Simulation</p>
            </div>
          </div>

          <div className="flex gap-3">

            <Badge className={isRunning ? 'bg-emerald-500' : 'bg-slate-300'}>
              {isRunning ? 'Running' : 'Idle'}
            </Badge>

            <Button onClick={() => setIsRunning(p => !p)}>
              {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isRunning ? 'Stop Demo' : 'Start Demo'}
            </Button>

          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard title="Health" value={`${avgUptime.toFixed(2)}%`} icon={Activity} />
          <StatCard title="CPU" value={`${metrics.cpu}%`} icon={Cpu} progress={metrics.cpu} />
          <StatCard title="Memory" value={`${metrics.memory}%`} icon={Database} progress={metrics.memory} />
          <StatCard title="Requests" value={metrics.requests.toLocaleString()} icon={TrendingUp} />

        </div>
        {/* Charts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Historical Metrics</CardTitle>
          </CardHeader>
          <CardContent className="h-60">

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="time" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="cpu" stroke="#0d9488" />
                <Line type="monotone" dataKey="memory" stroke="#0284c7" />
              </LineChart>
            </ResponsiveContainer>

          </CardContent>
        </Card>

        <div className="grid grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="col-span-4 space-y-4">
            <Input placeholder="Search components" value={search} onChange={e => setSearch(e.target.value)} />
            {filtered.map(comp => (
              <ComponentCard
                key={comp.id}
                comp={comp}
                selected={selectedComponent === comp.id}
                onClick={() => setSelectedComponent(comp.id)}
              />
            ))}

            <LogsPanel logs={logs} />
          </div>

          {/* Detail */}
          <div className="col-span-8">
            {component ? (
              <ComponentDetail component={component} isRunning={isRunning} addLog={addLog} />
            ) : (
              <EmptyState />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- Components --------------------
function StatCard({ title, value, icon: Icon, progress }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-slate-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
          </div>
          <Icon className="w-5 h-5 text-teal-600" />
        </div>

        {progress !== undefined && <Progress value={progress} className="mt-2" />}

      </CardContent>
    </Card>
  );
}

function ComponentCard({ comp, selected, onClick }) {
  const Icon = comp.icon;
  return (
    <Card className={`cursor-pointer ${selected && 'ring-2 ring-teal-500'}`} onClick={onClick}>
      <CardContent className="p-4 flex justify-between">

        <div className="flex gap-3 items-center">
          <Icon className="w-5 h-5" />

          <div>
            <p className="font-medium">{comp.name}</p>
            <p className="text-xs text-slate-500">{comp.uptime}% uptime</p>
          </div>

        </div>
        <Badge>{comp.status}</Badge>
      </CardContent>
    </Card>
  );
}

function LogsPanel({ logs }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Live Logs</CardTitle></CardHeader>
      <CardContent>
        <div className="h-56 overflow-y-auto font-mono text-xs space-y-1">
          {logs.map((l, i) => (
            <div key={i}>
              {l.time} - {l.message}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------- Component Detail --------------------
function ComponentDetail({ component, isRunning, addLog }) {

  const [simHistory, setSimHistory] = useState([]);

  // Component specific simulation behavior
  const generateComponentMetrics = () => {

    switch (component.id) {

      case 'ratelimiter':
        return {
          throughput: Math.random() * 2000 + 1000,
          load: Math.random() * 70 + 10
        };

      case 'circuitbreaker':
        return {
          latency: Math.random() * 300 + 50,
          throughput: Math.random() * 1500 + 500,
          load: Math.random() * 90
        };

      case 'loadbalancer':
        return {
          latency: Math.random() * 120 + 30,
          throughput: Math.random() * 3500 + 1500,
          load: Math.random() * 100
        };

      default:
        return {
          latency: Math.random() * 200,
          throughput: Math.random() * 2500,
          load: Math.random() * 80
        };
    }
  };

  useEffect(() => {

    setSimHistory([]); // Reset graph when component changes

    if (!isRunning) return;

    const interval = setInterval(() => {

      const metrics = generateComponentMetrics();

      setSimHistory(prev => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          ...metrics
        }
      ]);
    }, 1500);

    return () => clearInterval(interval);

  }, [isRunning, component.id]);

  return (
    <Card>

      <CardHeader>
        <CardTitle>{component.name}</CardTitle>
      </CardHeader>

      <CardContent>

        <Tabs defaultValue="metrics">

          <TabsList>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="simulation">Simulation</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
          </TabsList>

          {/* METRICS TAB */}
          <TabsContent value="metrics" className="space-y-6">

            <div className="grid grid-cols-3 gap-4">
              <Metric title="Latency" value={`${component.latency}ms`} />
              <Metric title="Uptime" value={`${component.uptime}%`} />
              <Metric title="Status" value={component.status} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Performance Trend</CardTitle>
              </CardHeader>

              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="latency" stroke="#0d9488" />
                    <Line type="monotone" dataKey="throughput" stroke="#2563eb" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </TabsContent>

          {/* SIMULATION TAB */}
          <TabsContent value="simulation" className="space-y-6">

            {component.id === 'ratelimiter' && <RateLimiterDemo isRunning={isRunning} addLog={addLog} />}
            {component.id === 'circuitbreaker' && <CircuitBreakerDemo isRunning={isRunning} addLog={addLog} />}
            {component.id === 'loadbalancer' && <LoadBalancerDemo isRunning={isRunning} addLog={addLog} />}

            {!['ratelimiter', 'circuitbreaker', 'loadbalancer'].includes(component.id) && (
              <GenericSimulation name={component.name} isRunning={isRunning} addLog={addLog} />
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Simulation Load Analysis</CardTitle>
              </CardHeader>

              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="load" stroke="#f59e0b" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </TabsContent>

          {/* CONFIG TAB */}
          <TabsContent value="config" className="space-y-6">

            <pre className="bg-slate-900 text-white p-4 rounded">
{JSON.stringify(component, null, 2)}
            </pre>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Configuration Impact Preview</CardTitle>
              </CardHeader>

              <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simHistory}>
                    <XAxis dataKey="time" hide />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="throughput" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Metric({ title, value }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

// -------------------- Advanced Simulations --------------------
import { Slider } from '@/components/ui/slider';

// ---- Generic Monitoring Simulation ----
function GenericSimulation({ name, isRunning, addLog }) {

  const [events, setEvents] = useState(0);
  const [speed, setSpeed] = useState([1500]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setEvents(e => e + 1);
      addLog('success', `${name} processed event`);
    }, speed[0]);

    return () => clearInterval(interval);

  }, [isRunning, speed]);

  return (
    <div className="space-y-6 mt-4">

      <Metric title="Processed Events" value={events} />

      <div>
        <p className="text-sm mb-2">Simulation Speed</p>
        <Slider min={500} max={3000} step={250} value={speed} onValueChange={setSpeed} />
      </div>

    </div>
  );
}

// ---- Rate Limiter ----
function RateLimiterDemo({ isRunning, addLog }) {

  const [capacity, setCapacity] = useState([10]);
  const [refillRate, setRefillRate] = useState([1]);
  const [tokens, setTokens] = useState(10);
  const [stats, setStats] = useState({ allowed: 0, denied: 0 });

  useEffect(() => {

    if (!isRunning) return;

    const interval = setInterval(() => {
      setTokens(t => Math.min(capacity[0], t + refillRate[0] * 0.2));
    }, 200);

    return () => clearInterval(interval);

  }, [isRunning, capacity, refillRate]);

  const handleRequest = () => {

    if (tokens >= 1) {
      setTokens(t => t - 1);
      setStats(s => ({ ...s, allowed: s.allowed + 1 }));
      addLog('success', 'RateLimiter allowed request');
    } else {
      setStats(s => ({ ...s, denied: s.denied + 1 }));
      addLog('error', 'RateLimiter blocked request');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 mt-4">

      <div className="space-y-4">

        <Metric title="Tokens" value={`${tokens.toFixed(1)} / ${capacity[0]}`} />

        <Progress value={(tokens / capacity[0]) * 100} />

        <Button onClick={handleRequest} disabled={!isRunning} className="w-full">
          Send Request
        </Button>

      </div>

      <div className="space-y-4">

        <Slider label="Capacity" min={5} max={50} step={1} value={capacity} onValueChange={setCapacity} />
        <Slider label="Refill Rate" min={1} max={10} step={1} value={refillRate} onValueChange={setRefillRate} />

        <div className="grid grid-cols-2 gap-4">
          <Metric title="Allowed" value={stats.allowed} />
          <Metric title="Denied" value={stats.denied} />
        </div>
      </div>
    </div>
  );
}

// ---- Circuit Breaker ----
function CircuitBreakerDemo({ isRunning, addLog }) {

  const [failures, setFailures] = useState(0);
  const [threshold, setThreshold] = useState([5]);
  const [state, setState] = useState('CLOSED');

  const simulateRequest = () => {

    if (state === 'OPEN') {
      addLog('error', 'Circuit OPEN - Request Blocked');
      return;
    }

    if (Math.random() < 0.35) {

      const newFailures = failures + 1;
      setFailures(newFailures);

      addLog('error', 'Request failed');

      if (newFailures >= threshold[0]) {
        setState('OPEN');
        addLog('warning', 'Circuit opened');
      }

    } else {
      addLog('success', 'Request success');
    }
  };

  const reset = () => {
    setFailures(0);
    setState('CLOSED');
  };

  return (
    <div className="space-y-6 mt-4">

      <div className="flex justify-between items-center">
        <Badge>{state}</Badge>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>

      <Slider min={2} max={10} step={1} value={threshold} onValueChange={setThreshold} />

      <Metric title="Failures" value={`${failures}/${threshold[0]}`} />

      <Button onClick={simulateRequest} disabled={!isRunning}>
        Simulate Request
      </Button>

    </div>
  );
}

// ---- Load Balancer ----
function LoadBalancerDemo({ isRunning, addLog }) {

  const [servers, setServers] = useState([
    { id: 1, cpu: 40, requests: 10 },
    { id: 2, cpu: 55, requests: 12 },
    { id: 3, cpu: 30, requests: 8 }
  ]);

  const routeRequest = () => {

    const target = servers.reduce((a, b) => a.cpu < b.cpu ? a : b);

    setServers(prev => prev.map(s =>
      s.id === target.id
        ? { ...s, cpu: Math.min(100, s.cpu + 8), requests: s.requests + 1 }
        : { ...s, cpu: Math.max(10, s.cpu - 2) }
    ));

    addLog('success', `LoadBalancer routed request to Server ${target.id}`);
  };

  return (
    <div className="space-y-6 mt-4">

      <div className="grid grid-cols-3 gap-4">

        {servers.map(server => (

          <Card key={server.id} className="p-4">

            <p className="font-medium">Server {server.id}</p>

            <Metric title="CPU" value={`${server.cpu}%`} />
            <Progress value={server.cpu} />

            <Metric title="Requests" value={server.requests} />

          </Card>

        ))}

      </div>

      <Button onClick={routeRequest} disabled={!isRunning} className="w-full">
        Route Request
      </Button>

    </div>
  );
}

function EmptyState() {
  return (
    <Card className="h-full">
      <CardContent className="flex justify-center items-center h-64">
        <Server className="w-12 h-12 text-slate-200" />
      </CardContent>
    </Card>
  );
}
