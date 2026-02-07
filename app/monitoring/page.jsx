'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Activity, ArrowLeft, RefreshCw, Pause, Play, Server, Database, Zap, Clock, AlertTriangle, TrendingUp, TrendingDown, Minus, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CacheVisualization } from '@/components/CacheVisualization';
import { Analytics } from '@/components/Analytics';
import { SystemStats } from '@/components/SystemStats';

export default function MonitoringPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshRate, setRefreshRate] = useState(2000);
  const [timeRange, setTimeRange] = useState('5m');

  const [lastUpdate, setLastUpdate] = useState(null);
  const intervalRef = useRef(null);

  const fetchStats = async () => {
    try {
      setError(null);
      const res = await fetch('http://localhost:3001/api/stats');
      const json = await res.json();

      if (!json?.success) throw new Error('Invalid response');

      setStats(json);
      setLastUpdate(new Date());
    } catch {
      setError('Monitoring service unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!autoRefresh) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(fetchStats, refreshRate);
    return () => clearInterval(intervalRef.current);
  }, [autoRefresh, refreshRate]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) clearInterval(intervalRef.current);
      else if (autoRefresh) fetchStats();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [autoRefresh]);

  /* ---------- Derived Metrics ---------- */
  const cache = stats?.systemState?.cacheState;
  const index = stats?.systemState?.indexState;

  const cacheHitRate = Number(cache?.hitRate || 0);
  const evictions = cache?.operations?.filter(o => o.type === 'eviction').length || 0;
  const misses = cache?.operations?.filter(o => o.type === 'miss').length || 0;

  const alerts = [];
  if (cacheHitRate < 60) alerts.push('Low cache hit rate detected');
  if (evictions > 20) alerts.push('High cache eviction activity');
  if (!index?.documents) alerts.push('Search index contains no documents');

  const metrics = [
    {
      label: 'Cache Hit Rate',
      value: cacheHitRate,
      unit: '%',
      trend: cacheHitRate > 75 ? 'up' : 'down',
      icon: Zap,
    },
    {
      label: 'Cache Evictions',
      value: evictions,
      unit: '',
      trend: evictions > 10 ? 'down' : 'stable',
      icon: Database,
    },
    {
      label: 'Indexed Documents',
      value: index?.documents || 0,
      unit: '',
      trend: 'up',
      icon: Server,
    },
    {
      label: 'Cache Misses',
      value: misses,
      unit: '',
      trend: misses > 20 ? 'down' : 'stable',
      icon: Activity,
    },
  ];

  const trendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  const isStale =
    lastUpdate && Date.now() - lastUpdate.getTime() > refreshRate * 2;

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">System Monitoring</h1>
              <p className="text-sm text-muted-foreground">
                Infrastructure and performance overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border rounded-md px-2 py-1 text-sm bg-background"
            >
              <option value="1m">Last 1 min</option>
              <option value="5m">Last 5 min</option>
              <option value="15m">Last 15 min</option>
            </select>

            <select
              value={refreshRate}
              onChange={(e) => setRefreshRate(Number(e.target.value))}
              className="border rounded-md px-2 py-1 text-sm bg-background"
            >
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={5000}>5s</option>
            </select>

            <Button
              variant={autoRefresh ? 'secondary' : 'outline'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {autoRefresh ? 'Live' : 'Paused'}
            </Button>

            <Button variant="outline" onClick={fetchStats}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="max-w-7xl mx-auto px-6 py-3 text-sm flex justify-between">
        <span className="text-muted-foreground">
          {loading
            ? 'Connecting to monitoring service…'
            : error
            ? 'Connection error'
            : 'Data stream active'}
        </span>
        <span
          className={
            isStale ? 'text-amber-500' : 'text-emerald-500'
          }
        >
          {isStale ? 'Stale data' : 'Live'}
        </span>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <Card className="p-4 border-amber-500/30 bg-background">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-medium">System Warnings</h3>
            </div>
            <ul className="text-sm text-muted-foreground list-disc ml-5">
              {alerts.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Metrics */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <Card key={i} className="p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">{m.label}</span>
              <m.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold">
                {m.value}
                {m.unit}
              </span>
              {trendIcon(m.trend)}
            </div>
          </Card>
        ))}
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="cache">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="cache">
            {cache && <CacheVisualization cacheState={cache} />}
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
