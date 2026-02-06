'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export function Analytics({ stats }) {
  const [indexChart, setIndexChart] = useState([])
  const [searchChart, setSearchChart] = useState([])

  useEffect(() => {
    // Process index operations
    if (stats?.index?.operations) {
      const data = stats.index.operations.slice(-15).map((op, idx) => ({
        time: idx,
        name: op.type,
        value: 1,
      }))
      setIndexChart(data)
    }

    // Process search operations
    if (stats?.searchEngine?.operations) {
      const data = stats.searchEngine.operations.slice(-15).map((op, idx) => ({
        time: idx,
        name: op.type,
        resultCount: op.resultCount || 0,
      }))
      setSearchChart(data)
    }
  }, [stats])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Search Operations */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Search Operations
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Total Searches</span>
            <span className="text-lg font-bold text-cyan-400">
              {stats?.searchEngine?.searches || 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Autocompletes</span>
            <span className="text-lg font-bold text-blue-400">
              {stats?.searchEngine?.autocompletes || 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Cache Hit Rate</span>
            <span className="text-lg font-bold text-green-400">
              {stats?.searchEngine?.hitRate || '0%'}
            </span>
          </div>
        </div>

        {searchChart.length > 0 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="resultCount" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Index Statistics */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Index Statistics
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Indexed Documents</span>
            <span className="text-lg font-bold text-green-400">
              {stats?.index?.indexedDocuments || 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Unique Words</span>
            <span className="text-lg font-bold text-purple-400">
              {stats?.index?.indexSize || 0}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-slate-400">
              Total Indexed Terms
            </span>
            <span className="text-lg font-bold text-pink-400">
              {stats?.index?.totalWords || 0}
            </span>
          </div>
        </div>

        {indexChart.length > 0 && (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={indexChart}>
                <defs>
                  <linearGradient
                    id="colorIndex"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#8b5cf6"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#8b5cf6"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorIndex)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* Recent Operations */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">
          Recent System Operations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cache Operations */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">Cache</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {stats?.cache?.operations
                ?.slice(-8)
                .map((op, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-slate-800 rounded text-xs"
                  >
                    <span className="text-slate-400">{op.type}</span>
                    <span className="text-slate-500 font-mono">
                      {op.key}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Search Operations */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2">
              Search
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {stats?.searchEngine?.operations
                ?.slice(-8)
                .map((op, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-slate-800 rounded text-xs"
                  >
                    <span className="text-slate-400">{op.type}</span>
                    <span className="text-slate-500 font-mono">
                      {op.query?.substring(0, 20) || op.fileId}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
