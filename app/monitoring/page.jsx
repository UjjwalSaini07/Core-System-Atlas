'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Pause, Play, Cpu, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CacheVisualization } from '@/components/CacheVisualization';
import { Analytics } from '@/components/Analytics';
import { SystemStats } from '@/components/SystemStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

/* ---------------- Chart Fake Data ---------------- */
const METRICSDATA = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 30) + 40,
  memory: Math.floor(Math.random() * 20) + 50,
  requests: Math.floor(Math.random() * 5000) + 8000,
  latency: Math.floor(Math.random() * 30) + 20
}));

const SERVICESTATUS = [
  { name: 'API Gateway', status: 'healthy', uptime: 99.9 },
  { name: 'Auth Service', status: 'healthy', uptime: 99.8 },
  { name: 'Cache Layer', status: 'healthy', uptime: 99.95 },
  { name: 'Message Queue', status: 'warning', uptime: 98.5 }
];

export default function MonitoringPage() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate, setRefreshRate] = useState(2000);
  const [lastUpdate, setLastUpdate] = useState(null);

  const intervalRef = useRef(null);

  const [metrics] = useState(METRICSDATA);

  const [currentMetrics, setCurrentMetrics] = useState({
    cpu: 0,
    memory: 0,
    requests: 0,
    latency: 0
  });

  const fetchStats = async () => {
    try {
      setError(null);

      const res = await fetch('http://localhost:3001/api/stats');
      const json = await res.json();

      if (!json?.success) throw new Error();

      setStats(json);
      setLastUpdate(new Date());
    } catch {
      setError('Monitoring service unavailable');
    } finally {
      setLoading(false);
    }
  };

  /* Effects */
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    intervalRef.current = setInterval(fetchStats, refreshRate);
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, refreshRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMetrics({
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 20) + 50,
        requests: Math.floor(Math.random() * 5000) + 10000,
        latency: Math.floor(Math.random() * 30) + 20
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* Derived */
  const avgHealth =
    SERVICESTATUS.reduce((a, b) => a + b.uptime, 0) / SERVICESTATUS.length;

  const isStale =
    lastUpdate && Date.now() - lastUpdate.getTime() > refreshRate * 2;

  return (
    <main className="min-h-screen bg-slate-50">

      <header className="border-b sticky top-0 bg-white shadow-sm">
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
                Infrastructure + Performance Dashboard
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant={autoRefresh ? 'secondary' : 'outline'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <Pause className="mr-2 w-4 h-4" /> : <Play className="mr-2 w-4 h-4" />}
              {autoRefresh ? 'Live' : 'Paused'}
            </Button>

            <Button variant="outline" onClick={fetchStats}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

        </div>
      </header>

      {/* STATUS */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between text-sm">
        <span>{loading ? 'Connecting...' : error ? 'Connection error' : 'Data stream active'}</span>

        <Badge className={isStale ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}>
          {isStale ? 'Stale' : 'Live'}
        </Badge>
      </div>

      {/* METRIC CARDS */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <Card className="p-4">
          <p className="text-sm text-slate-500">System Health</p>
          <p className="text-2xl font-semibold text-emerald-600">
            {Math.round(avgHealth)}%
          </p>
          <Progress value={avgHealth} />
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-500">CPU</p>
          <p className="text-2xl font-semibold">{currentMetrics.cpu}%</p>
          <Progress value={currentMetrics.cpu} />
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-500">Memory</p>
          <p className="text-2xl font-semibold">{currentMetrics.memory}%</p>
          <Progress value={currentMetrics.memory} />
        </Card>

        <Card className="p-4">
          <p className="text-sm text-slate-500">Latency</p>
          <p className="text-2xl font-semibold">{currentMetrics.latency}ms</p>
        </Card>

      </section>

      {/* TABS */}
      <section className="max-w-7xl mx-auto px-6 pb-10">

        <Tabs defaultValue="overview">

          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>


          <TabsContent value="overview">
            <div className="grid grid-cols-2 gap-6">
              {/* CPU + MEMORY */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">CPU & Memory Usage</h3>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />

                      <Area type="monotone" dataKey="cpu" stroke="#0891B2" fill="#0891B2" />
                      <Area type="monotone" dataKey="memory" stroke="#0EA5E9" fill="#0EA5E9" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* REQUESTS + LATENCY */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Requests & Latency</h3>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />

                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />

                      <Tooltip />

                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="requests"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                      />

                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="latency"
                        stroke="#F97316"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* SERVICES */}
          <TabsContent value="services">
            <Card className="p-6">
              {SERVICESTATUS.map((service, i) => (
                <div key={i} className="flex justify-between border-b py-3">
                  <div className="flex gap-3">
                    {service.status === 'healthy'
                      ? <CheckCircle className="text-emerald-500" />
                      : <AlertTriangle className="text-amber-500" />}
                    {service.name}
                  </div>
                  <div>{service.uptime}% uptime</div>
                </div>
              ))}
            </Card>
          </TabsContent>

          <TabsContent value="cache">
            {stats && <CacheVisualization cacheState={stats.systemState.cacheState} />}
          </TabsContent>

          <TabsContent value="analytics">
            {stats && <Analytics stats={stats.systemState} />}
          </TabsContent>

          <TabsContent value="performance">
            {stats && <SystemStats stats={stats} />}
          </TabsContent>
          
        </Tabs>
      </section>
    </main>
  );
}
