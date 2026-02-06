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
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          LRU Cache Operations
        </h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 rounded p-3">
            <p className="text-xs text-slate-400 mb-1">Hit Rate</p>
            <p className="text-2xl font-bold text-green-400">{hitRate}</p>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <p className="text-xs text-slate-400 mb-1">Cache Size</p>
            <p className="text-2xl font-bold text-blue-400">{size}</p>
          </div>

          <div className="bg-slate-800 rounded p-3">
            <p className="text-xs text-slate-400 mb-1">Capacity</p>
            <p className="text-2xl font-bold text-cyan-400">{capacity}</p>
          </div>
        </div>

        {/* Operation Timeline */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-300">
            Recent Operations
          </p>

          <div className="bg-slate-800 rounded p-4 space-y-2 max-h-64 overflow-y-auto">
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
                      : 'bg-slate-500'
                  }`}
                />
                <span className="text-xs text-slate-300">
                  {op.type}:{' '}
                  <span className="font-mono text-slate-400">
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
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Operation Distribution
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  formatter={(value, name) => {
                    const op = cacheState.operations[value]
                    return op
                      ? [op.type.toUpperCase(), 'Operation']
                      : [value, name]
                  }}
                />
                <Bar dataKey="type" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Legend */}
      <Card className="p-4 bg-slate-800 border-slate-700">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-slate-300">Cache Hit</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-slate-300">Cache Miss</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <span className="text-sm text-slate-300">Eviction</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
