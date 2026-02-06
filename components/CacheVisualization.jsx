'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export function CacheVisualization({ cacheState }) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (cacheState?.operations) {
      const recentOps = cacheState.operations.slice(-20)
      const data = recentOps.map((op, idx) => ({
        time: idx,
        type: op.type,
        color:
          op.type === 'hit'
            ? '#22c55e'
            : op.type === 'miss'
            ? '#ef4444'
            : op.type === 'eviction'
            ? '#f59e0b'
            : '#64748b',
      }))
      setChartData(data)
    }
  }, [cacheState])

  const hitRate = cacheState?.hitRate || '0%'
  const size = cacheState?.size || 0
  const capacity = cacheState?.capacity || 100

  return (
    <div className="space-y-4">
      <Card className="p-6 glass-card">
        <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
          LRU Cache Operations
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[var(--color-muted)]/30 rounded p-3">
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Hit Rate</p>
            <p className="text-2xl font-bold text-green-400">{hitRate}</p>
          </div>

          <div className="bg-[var(--color-muted)]/30 rounded p-3">
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Cache Size</p>
            <p className="text-2xl font-bold text-blue-400">{size}</p>
          </div>

          <div className="bg-[var(--color-muted)]/30 rounded p-3">
            <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Capacity</p>
            <p className="text-2xl font-bold text-cyan-400">{capacity}</p>
          </div>
        </div>

        {/* Operation Timeline */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-foreground)]">
            Recent Operations
          </p>

          <div className="bg-[var(--color-muted)]/30 rounded p-4 space-y-2 max-h-64 overflow-y-auto">
            {cacheState?.operations?.slice(-15).map((op, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    op.type === 'hit'
                      ? 'bg-green-500'
                      : op.type === 'miss'
                      ? 'bg-red-500'
                      : op.type === 'eviction'
                      ? 'bg-amber-500'
                      : 'bg-[var(--color-muted-foreground)]'
                  }`}
                />
                <span className="text-xs text-[var(--color-foreground)]">
                  {op.type}:{' '}
                  <span className="font-mono text-[var(--color-muted-foreground)] opacity-70">
                    {op.key}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Operation Distribution */}
      {cacheState?.operations && cacheState.operations.length > 0 && (
        <Card className="p-6 glass-card">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
            Operation Distribution
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 25%)" />
                <XAxis dataKey="time" stroke="hsl(215 20% 65%)" />
                <YAxis stroke="hsl(215 20% 65%)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(217 33% 12%)',
                    border: '1px solid hsl(217 33% 20%)',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => {
                    const op = cacheState.operations[value]
                    return op
                      ? [op.type.toUpperCase(), 'Operation']
                      : [value, name]
                  }}
                />
                <Bar dataKey="type" fill="hsl(199 89% 48%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4 glass-card">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-[var(--color-muted-foreground)]">Cache Hit</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-[var(--color-muted-foreground)]">Cache Miss</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-sm text-[var(--color-muted-foreground)]">Eviction</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
