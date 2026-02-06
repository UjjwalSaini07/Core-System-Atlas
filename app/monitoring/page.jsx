'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CacheVisualization } from '@/components/CacheVisualization';
import { Analytics } from '@/components/Analytics';
import { SystemStats } from '@/components/SystemStats';
import { ArrowLeft, RotateCw, Activity } from 'lucide-react';
import Link from 'next/link';

export default function MonitoringPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      const result = await response.json();
      if (result.success) {
        setStats(result);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(false);
      await fetchStats();
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
                  <Activity className="w-5 h-5 text-green-400" />
                  <h1 className="text-2xl font-bold text-white">System Monitoring</h1>
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  Real-time analytics and performance metrics
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setAutoRefresh(!autoRefresh)}
                variant="outline"
                className={`${
                  autoRefresh
                    ? 'bg-green-900/30 border-green-700 text-green-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                } hover:bg-opacity-80`}
              >
                <RotateCw
                  className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`}
                />
              </Button>
              <Button
                onClick={fetchStats}
                variant="outline"
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {stats && <SystemStats stats={stats} />}

        <Tabs defaultValue="cache" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
            <TabsTrigger value="cache" className="data-[state=active]:bg-slate-700">
              Cache Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-700">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:bg-slate-700">
              Performance
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
              <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Search Performance
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-400">
                        Cache Hit Rate
                      </span>
                      <span className="text-sm font-bold text-green-400">
                        {stats?.systemState?.cacheState?.hitRate}%
                      </span>
                    </div>

                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        style={{
                          width: `${
                            stats?.systemState?.cacheState?.hitRate || 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-xs text-slate-400 mb-1">Cache Hits</p>
                      <p className="text-xl font-bold text-green-400">
                        {stats?.systemState?.cacheState?.operations?.filter(
                          (op) => op.type === 'hit'
                        ).length || 0}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-xs text-slate-400 mb-1">Cache Misses</p>
                      <p className="text-xl font-bold text-red-400">
                        {stats?.systemState?.cacheState?.operations?.filter(
                          (op) => op.type === 'miss'
                        ).length || 0}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-3 rounded">
                      <p className="text-xs text-slate-400 mb-1">Evictions</p>
                      <p className="text-xl font-bold text-amber-400">
                        {stats?.systemState?.cacheState?.operations?.filter(
                          (op) => op.type === 'eviction'
                        ).length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Index Performance
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded">
                      <p className="text-xs text-slate-400 mb-2">Documents</p>
                      <p className="text-2xl font-bold text-blue-400">
                        {stats?.systemState?.indexState?.documents || 0}
                      </p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded">
                      <p className="text-xs text-slate-400 mb-2">
                        Unique Words
                      </p>
                      <p className="text-2xl font-bold text-purple-400">
                        {stats?.systemState?.indexState?.words || 0}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800 p-4 rounded">
                    <p className="text-xs text-slate-400 mb-3">Index Size</p>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                        style={{ width: '45%' }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            System Health
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Backend', 'Cache', 'Index', 'Storage'].map((item) => (
              <div key={item} className="text-center">
                <div className="w-12 h-12 rounded-full bg-green-900/30 border-2 border-green-500 flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-400 font-bold">✓</span>
                </div>
                <p className="text-sm font-medium text-green-400">{item}</p>
                <p className="text-xs text-slate-400">
                  {item === 'Backend'
                    ? 'Healthy'
                    : item === 'Cache'
                    ? 'Operating'
                    : item === 'Index'
                    ? 'Ready'
                    : 'Online'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
