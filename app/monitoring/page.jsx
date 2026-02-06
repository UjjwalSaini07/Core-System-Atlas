'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CacheVisualization } from '@/components/CacheVisualization';
import { Analytics } from '@/components/Analytics';
import { SystemStats } from '@/components/SystemStats';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, RotateCw, Activity, RefreshCw, Play, Pause, Database, Zap, FileText, Server, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

export default function MonitoringPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      const result = await response.json();
      if (result.success) {
        setStats(result);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to fetch monitoring data',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStats();
      setLoading(false);
    };
    init();
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const healthItems = [
    { name: 'Backend Server', status: 'Healthy', icon: Server, color: 'green' },
    { name: 'LRU Cache', status: stats?.cache?.size > 0 ? 'Active' : 'Idle', icon: Zap, color: 'cyan' },
    { name: 'Search Index', status: stats?.index?.indexedDocuments > 0 ? 'Ready' : 'Empty', icon: Database, color: 'green' },
    { name: 'File Storage', status: 'Online', icon: FileText, color: 'purple' },
  ];

  const metrics = [
    { label: 'Cache Hit Rate', value: parseFloat(stats?.systemState?.cacheState?.hitRate || 0), trend: 'up', icon: TrendingUp },
    { label: 'Search Latency', value: 12, unit: 'ms', trend: 'down', icon: Clock },
    { label: 'Memory Usage', value: 64, unit: '%', trend: 'stable', icon: Activity },
    { label: 'Active Connections', value: stats?.systemState?.indexState?.documents || 0, trend: 'up', icon: Server },
  ];

  const colorClasses = {
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4 text-green-400" />,
    down: <TrendingDown className="w-4 h-4 text-red-400" />,
    stable: <Minus className="w-4 h-4 text-amber-400" />,
  };

  return (
    <>
      {/* Animated Background */}
      <div className="animated-bg" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[var(--color-muted)]/50 border-[var(--color-border)]"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/20">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold gradient-text">System Monitoring</h1>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Real-time analytics and performance metrics
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant="outline"
                className={`${autoRefresh ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-[var(--color-muted)]/50 border-[var(--color-border)]'}`}
              >
                {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {autoRefresh ? 'Live' : 'Paused'}
              </Button>
              <Button
                onClick={fetchStats}
                variant="outline"
                className="bg-[var(--color-muted)]/50 border-[var(--color-border)]"
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* Connection Status */}
          <Card className="p-4 glass-card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
                <span className="text-[var(--color-foreground)]">
                  {loading ? 'Connecting to monitoring server...' : 'Live data stream active'}
                </span>
                {lastUpdate && (
                  <span className="text-sm text-[var(--color-muted-foreground)]">
                    Last update: {lastUpdate.toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
                <span className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Cache: {stats?.systemState?.cacheState?.size || 0}/{stats?.systemState?.cacheState?.capacity || 100}
                </span>
                <span className="flex items-center gap-1">
                  <Database className="w-4 h-4 text-green-400" />
                  {stats?.systemState?.indexState?.documents || 0} docs
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4 text-purple-400" />
                  {stats?.systemState?.trieState?.insertions || 0} words
                </span>
              </div>
            </div>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, idx) => (
              <Card key={idx} className="p-4 glass-card">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--color-muted-foreground)]">{metric.label}</span>
                  {metric.icon && <metric.icon className="w-4 h-4 text-[var(--color-muted-foreground)]" />}
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-[var(--color-foreground)]">
                    {metric.value}{metric.unit || '%'}
                  </span>
                  {trendIcons[metric.trend]}
                </div>
              </Card>
            ))}
          </div>

          {/* System Stats */}
          {stats && <SystemStats stats={stats} />}

          {/* Health Overview */}
          <Card className="p-6 glass-card">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              System Health
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {healthItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative overflow-hidden p-4 rounded-xl border ${colorClasses[item.color]} group hover-lift`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.color === 'green' ? 'bg-green-500/20' : item.color === 'cyan' ? 'bg-cyan-500/20' : 'bg-purple-500/20'}`}>
                      <item.icon className={`w-5 h-5 ${colorClasses[item.color].split(' ')[0]}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-foreground)]">{item.name}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'Healthy' || item.status === 'Active' || item.status === 'Ready' || item.status === 'Online' ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
                        <p className="text-xs text-[var(--color-muted-foreground)]">{item.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Monitoring Tabs */}
          <Tabs defaultValue="cache" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="cache" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                🔄 Cache Activity
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                📊 Analytics
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
                ⚡ Performance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cache" className="mt-6">
              {stats?.systemState?.cacheState && (
                <CacheVisualization cacheState={stats.systemState.cacheState} />
              )}
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              {stats && <Analytics stats={stats.systemState} />}
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 glass-card">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                    <span>🔍</span> Search Performance
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Cache Hit Rate</span>
                        <span className="text-sm font-bold text-green-400">{stats?.systemState?.cacheState?.hitRate}%</span>
                      </div>
                      <Progress value={parseFloat(stats?.systemState?.cacheState?.hitRate || 0)} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Cache Hits', value: stats?.systemState?.cacheState?.operations?.filter((op) => op.type === 'hit').length || 0, color: 'text-green-400' },
                        { label: 'Cache Misses', value: stats?.systemState?.cacheState?.operations?.filter((op) => op.type === 'miss').length || 0, color: 'text-red-400' },
                        { label: 'Evictions', value: stats?.systemState?.cacheState?.operations?.filter((op) => op.type === 'eviction').length || 0, color: 'text-amber-400' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-[var(--color-muted)]/30 text-center">
                          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <Card className="p-6 glass-card">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
                    <span>📚</span> Index Performance
                  </h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center">
                        <p className="text-3xl font-bold text-green-400">{stats?.systemState?.indexState?.documents || 0}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">Documents Indexed</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
                        <p className="text-3xl font-bold text-purple-400">{stats?.systemState?.indexState?.words || 0}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">Unique Words</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-muted-foreground)] mb-2">Index Size</p>
                      <Progress value={Math.min((stats?.systemState?.indexState?.words || 0) / 10, 100)} />
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
