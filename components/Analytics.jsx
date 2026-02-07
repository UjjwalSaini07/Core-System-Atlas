'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, } from 'recharts'

const COLORS = {
  primary: '#38BDF8',
  secondary: '#818CF8',
  grid: 'rgba(148,163,184,0.12)',
  text: '#94A3B8',
}

/* ---------------- Utils ---------------- */
function percentile(values, p) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor((p / 100) * sorted.length)]
}

export function Analytics({ stats }) {
  const [range, setRange] = useState('5m')
  const [searchChart, setSearchChart] = useState([])
  const [indexChart, setIndexChart] = useState([])

  const windowSize = range === '1m' ? 10 : range === '15m' ? 60 : 30

  /* ---------------- Data Processing ---------------- */
  useEffect(() => {
    // Search volume buckets
    if (stats?.searchEngine?.operations?.length) {
      const ops = stats.searchEngine.operations.slice(-windowSize)

      const buckets = ops.reduce((acc, _, i) => {
        const k = Math.floor(i / 3)
        acc[k] = acc[k] || { t: k + 1, searches: 0 }
        acc[k].searches += 1
        return acc
      }, [])

      setSearchChart(buckets)
    } else {
      setSearchChart([])
    }

    // Index growth (only if meaningful)
    if (stats?.index?.indexedDocuments > 0) {
      setIndexChart(
        Array.from({ length: 10 }).map((_, i) => ({
          t: i + 1,
          value: Math.min(stats.index.indexedDocuments, i + 1),
        }))
      )
    } else {
      setIndexChart([])
    }
  }, [stats, windowSize])

  /* ---------------- Metrics ---------------- */
  const latencyValues =
    stats?.searchEngine?.operations
      ?.slice(-windowSize)
      .map(op => op.latency || 0) || []

  const p95 = percentile(latencyValues, 95)

  const exportCSV = () => {
    const rows = stats?.searchEngine?.operations || []
    if (!rows.length) return

    const csv =
      'query,latency\n' +
      rows.map(r => `${r.query || ''},${r.latency || 0}`).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'search-analytics.csv'
    link.click()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">Search Operations</h3>
            <p className="text-sm text-muted-foreground">
              Query volume and latency trends
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="text-sm bg-background border rounded px-2 py-1"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
            </select>

            <Button size="sm" variant="outline" onClick={exportCSV}>
              CSV
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Metric label="Searches" value={stats?.searchEngine?.searches || 0} />
          <Metric label="Autocompletes" value={stats?.searchEngine?.autocompletes || 0} />
          <Metric label="Cache Hit Rate" value={stats?.searchEngine?.hitRate || '0%'} />
        </div>

        <div className="h-52">
          {searchChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={searchChart}>
                <CartesianGrid stroke={COLORS.grid} />
                <XAxis dataKey="t" stroke={COLORS.text} tickLine={false} />
                <YAxis stroke={COLORS.text} allowDecimals={false} />
                <Tooltip />
                {p95 > 0 && (
                  <ReferenceLine
                    y={p95}
                    stroke={COLORS.secondary}
                    strokeDasharray="4 4"
                  />
                )}
                <Bar
                  dataKey="searches"
                  fill={COLORS.primary}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState label="No recent search activity" />
          )}
        </div>
      </Card>

      {/* ================= INDEX STATISTICS ================= */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Index Statistics</h3>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <Metric label="Documents" value={stats?.index?.indexedDocuments || 0} />
          <Metric label="Unique Words" value={stats?.index?.indexSize || 0} />
          <Metric label="Total Terms" value={stats?.index?.totalWords || 0} />
        </div>

        <div className="h-52">
          {indexChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={indexChart}>
                <CartesianGrid stroke={COLORS.grid} />
                <XAxis dataKey="t" stroke={COLORS.text} tickLine={false} />
                <YAxis stroke={COLORS.text} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={COLORS.primary}
                  fill={COLORS.primary}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState label="Index is empty" />
          )}
        </div>
      </Card>

      {/* ================= RECENT OPERATIONS ================= */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Recent System Operations</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CacheOperationList items={stats?.cache?.operations} />
          <OperationList
            title="Search"
            items={stats?.searchEngine?.operations}
            field="query"
          />
        </div>
      </Card>
    </div>
  )
}

/* ---------------- Small Components ---------------- */
function Metric({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  )
}

function EmptyState({ label }) {
  return (
    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}

/* --------- Improved Cache Operations --------- */
function CacheOperationList({ items = [] }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">Cache</p>

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No cache activity</p>
      ) : (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {items.slice(-10).map((op, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-2 py-1 rounded bg-muted/40 text-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                    op.type === 'hit'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : op.type === 'miss'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {op.type}
                </span>
                <span className="font-mono opacity-70 truncate max-w-[140px]">
                  {op.key}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function OperationList({ title, items = [], field }) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{title}</p>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {items?.slice(-10).map((op, i) => (
          <div
            key={i}
            className="flex justify-between px-2 py-1 text-xs bg-muted/40 rounded"
          >
            <span>{op.type}</span>
            <span className="font-mono opacity-70 truncate max-w-[140px]">
              {op[field]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
