'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CacheVisualization } from '@/components/CacheVisualization';
import { Analytics } from '@/components/Analytics';
import { SystemStats } from '@/components/SystemStats';
import { ArrowLeft, RotateCw, Activity, RefreshCw, Play, Pause } from 'lucide-react';
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white">System Monitoring</h1>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  Real-time analytics and performance metrics
                </p>
              </div>
            </div>

            <div className="flex gap-2 items-center">
              {/* Auto Refresh Toggle */}
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant="outline"
                className={`${
                  autoRefresh
                    ? 'bg-green-900/30 border-green-700 text-green-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                } hover:bg-opacity-80`}
              >
                {autoRefresh ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span className="ml-1">{autoRefresh ? 'Live' : 'Paused'}</span>
              </Button>

              {/* Refresh Button */}
              <Button
                onClick={fetchStats}
                variant="outline"
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin-slow' : ''}`} />
              </Button>

              {/* Last Update */}
              {lastUpdate && (
                <span className="text-xs text-slate-500">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Connection Status */}
        <div className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <div className={`w-3 h-3 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
          <span className="text-sm text-slate-300">
            {loading ? 'Connecting to monitoring server...' : 'Live data stream active'}
          </span>
          <div className="ml-auto flex items-center gap-4 text-xs text-slate-500">
            <span>Cache: {stats?.systemState?.cacheState?.size || 0}/{stats?.systemState?.cacheState?.capacity || 100}</span>
            <span>Index: {stats?.systemState?.indexState?.documents || 0} docs</span>
            <span>Trie: {stats?.systemState?.trieState?.insertions || 0} words</span>
          </div>
        </div>

        {/* System Stats Overview */}
        {stats && <SystemStats stats={stats} />}

        {/* Monitoring Tabs */}
        <Tabs defaultValue="cache" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="cache" className="data-[state=active]:bg-slate-700">
              🔄 Cache Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              📊 Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
              ⚡ Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cache" className="mt-6">
            {stats?.systemState?.cacheState && (
              <CacheVisualization
                cacheState={stats.systemState.cacheState}
              />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {stats && <Analytics stats={stats.systemState} />}
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search Performance */}
              <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🔍</span> Search Performance
                </h3>

                <div className="space-y-4">
                  {/* Hit Rate Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-400">
                        Cache Hit Rate
                      </span>
                      <span className="text-sm font-bold text-green-400">
                        {stats?.systemState?.cacheState?.hitRate}%
                      </span>
                    </div>

                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-500"
                        style={{
                          width: `${parseFloat(stats?.systemState?.cacheState?.hitRate || 0)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-slate-800 p-4 rounded-lg text-center">
                      <p className="text-xs text-slate-400 mb-1">Cache Hits</p>
                      <p className="text-2xl font-bold text-green-400">
                        {stats?.systemState?.cacheState?.operations?.filter(
                          (op) => op.type === 'hit'
                        ).length || 0}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg text-center">
                      <p className="text-xs text-slate-400 mb-1">Cache Misses</p>
                      <p className="text-2xl font-bold text-red-400">
                        {stats?.systemState?.cacheState?.operations?.filter(
                          (op) => op.type === 'miss'
                        ).length || 0}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg text-center">
                      <p className="text-xs text-slate-400 mb-1">Evictions</p>
                      <p className="text-2xl font-bold text-amber-400">
                        {stats?.systemState?.cacheState?.operations?.filter(
                          (op) => op.type === 'eviction'
                        ).length || 0}
                      </p>
                    </div>
                  </div>

                  {/* Search Stats */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-400">Total Searches</p>
                        <p className="text-xl font-bold text-cyan-400">
                          {stats?.systemState?.searchEngine?.searches || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Autocompletes</p>
                        <p className="text-xl font-bold text-purple-400">
                          {stats?.systemState?.searchEngine?.autocompletes || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Index Performance */}
              <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📚</span> Index Performance
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-xs text-slate-400 mb-2">Documents Indexed</p>
                      <p className="text-3xl font-bold text-blue-400">
                        {stats?.systemState?.indexState?.documents || 0}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg">
                      <p className="text-xs text-slate-400 mb-2">Unique Words</p>
                      <p className="text-3xl font-bold text-purple-400">
                        {stats?.systemState?.indexState?.words || 0}
                      </p>
                    </div>
                  </div>

                  {/* Index Size Visualization */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-3">Index Capacity</p>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-400 transition-all duration-500"
                          style={{ width: `${Math.min((stats?.systemState?.indexState?.words || 0) / 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>0 words</span>
                        <span>100 words</span>
                      </div>
                    </div>
                  </div>

                  {/* Trie Stats */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-2">Trie Autocomplete</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-slate-500">Insertions</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {stats?.systemState?.trieState?.insertions || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Searches</p>
                        <p className="text-lg font-bold text-cyan-400">
                          {stats?.systemState?.trieState?.searches || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* System Health Overview */}
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            System Health
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Backend Server', status: 'Healthy', color: 'green', icon: '🖥️' },
              { name: 'LRU Cache', status: 'Operating', color: 'green', icon: '⚡' },
              { name: 'Search Index', status: 'Ready', color: 'green', icon: '📚' },
              { name: 'File Storage', status: 'Online', color: 'green', icon: '💾' },
            ].map((item) => (
              <div
                key={item.name}
                className="text-center p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full bg-${item.color}-400 animate-pulse`} />
                  <p className="text-sm font-medium text-white">{item.status}</p>
                </div>
                <p className="text-xs text-slate-400">{item.name}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Legend */}
        <Card className="p-4 bg-slate-800/50 border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-3">Legend</h4>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-xs text-slate-400">Healthy / Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-xs text-slate-400">Cache Hit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-xs text-slate-400">Cache Miss</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-xs text-slate-400">Eviction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-xs text-slate-400">Index Activity</span>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
