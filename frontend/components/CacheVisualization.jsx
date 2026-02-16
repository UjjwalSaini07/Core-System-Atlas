'use client'

import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, } from 'recharts'

const COLORS = {
  primary: '#38BDF8',
  soft: 'rgba(56,189,248,0.15)',
  grid: 'rgba(148,163,184,0.12)',
  text: '#94A3B8',
}

export function CacheVisualization({ cacheState }) {
  const operations = cacheState?.operations || []
  const [range, setRange] = useState(30)
  const [filter, setFilter] = useState('all')

  /* ---------- Derived state ---------- */
  const hitRate = cacheState?.hitRate || '0%'
  const size = cacheState?.size || 0
  const capacity = cacheState?.capacity || 0
  const utilization = capacity ? Math.round((size / capacity) * 100) : 0

  const cachePressure =
    utilization > 85 ? 'High' : utilization > 65 ? 'Moderate' : 'Low'

  const filteredOps = useMemo(() => {
    return operations
      .slice(-range)
      .filter(op => (filter === 'all' ? true : op.type === filter))
  }, [operations, range, filter])

  const timeline = useMemo(() => {
    return filteredOps.map((op, i) => ({
      t: i + 1,
      activity:
        op.type === 'hit' ? 3 : op.type === 'miss' ? 2 : 1,
    }))
  }, [filteredOps])

  /* ---------- Export ---------- */
  const exportCSV = () => {
    if (!filteredOps.length) return

    const csv =
      'type,key\n' +
      filteredOps.map(op => `${op.type},${op.key}`).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'cache-operations.csv'
    link.click()
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold">Cache</h3>
          <p className="text-sm text-muted-foreground">
            LRU cache health and behavior
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={exportCSV}
        >
          Export
        </Button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        <Stat label="Hit rate" value={hitRate} />
        <Stat label="Size" value={size} />
        <Stat label="Capacity" value={capacity} />
        <Stat label="Utilization" value={`${utilization}%`} />
        <Stat
          label="Pressure"
          value={cachePressure}
          subtle
        />
      </div>

      {/* ================= CONTROLS ================= */}
      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex gap-1">
          {[30, 60, 120].map(v => (
            <button
              key={v}
              onClick={() => setRange(v)}
              className={`px-2 py-1 rounded ${
                range === v
                  ? 'bg-muted font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              Last {v}
            </button>
          ))}
        </div>

        <div className="flex gap-1">
          {['all', 'hit', 'miss', 'eviction'].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-2 py-1 rounded capitalize ${
                filter === t
                  ? 'bg-muted font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="mb-8">
        <p className="text-sm font-medium mb-3">
          Recent activity
        </p>

        {timeline.length > 0 ? (
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <CartesianGrid stroke={COLORS.grid} />
                <XAxis dataKey="t" hide />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke={COLORS.primary}
                  fill={COLORS.soft}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* ================= DETAILS ================= */}
      <div>
        <p className="text-sm font-medium mb-2">
          Latest operations
        </p>

        <div className="space-y-1 max-h-40 overflow-y-auto">
          {filteredOps
            .slice(-8)
            .reverse()
            .map((op, i) => (
              <div
                key={i}
                className="flex justify-between text-xs px-2 py-1 rounded bg-muted/40"
              >
                <span className="capitalize">{op.type}</span>
                <span className="font-mono opacity-60 truncate max-w-[180px]">
                  {op.key}
                </span>
              </div>
            ))}

          {filteredOps.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No matching operations
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}

/* ---------- Small components ---------- */
function Stat({ label, value, subtle }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`text-xl font-semibold ${
          subtle ? 'text-cyan-400' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
      No recent cache activity
    </div>
  )
}
