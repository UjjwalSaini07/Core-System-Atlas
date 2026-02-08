'use client'

import { useEffect, useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Database, Zap, Grid3x3, TrendingUp, TrendingDown, Minus, } from 'lucide-react'

export function SystemStats({ stats }) {
  const cache = stats?.systemState?.cacheState
  const index = stats?.systemState?.indexState
  const storage = stats?.systemState?.fileStorage
  const prevHitRateRef = useRef(null)
  const hitRate = Number(cache?.hitRate || 0)

  const trend =
    prevHitRateRef.current === null
      ? 'neutral'
      : hitRate > prevHitRateRef.current
      ? 'up'
      : hitRate < prevHitRateRef.current
      ? 'down'
      : 'neutral'

  useEffect(() => {
    if (!isNaN(hitRate)) {
      prevHitRateRef.current = hitRate
    }
  }, [hitRate])

  const TrendIcon =
    trend === 'up'
      ? TrendingUp
      : trend === 'down'
      ? TrendingDown
      : Minus

  const cacheUtilization = cache?.capacity
    ? Math.min((cache.size / cache.capacity) * 100, 100)
    : 0

  const indexProgress = Math.min((index?.indexedDocuments || 0) / 10, 100)
  const storageProgress = Math.min((storage?.totalFiles || 0) / 10, 100)
  const cards = [
    {
      title: 'LRU Cache',
      icon: Zap,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-100',
      highlight: `${cache?.size || 0}/${cache?.capacity || 100}`,
      trend,
      progress: cacheUtilization,
      rows: [
        { label: 'Hit Rate', value: `${hitRate.toFixed(1)}%` },
        { label: 'Hits', value: cache?.hits || 0 },
        { label: 'Misses', value: cache?.misses || 0 },
      ],
    },
    {
      title: 'Search Index',
      icon: Database,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      highlight: index?.indexedDocuments || 0,
      progress: indexProgress,
      rows: [
        { label: 'Unique Words', value: index?.indexSize || 0 },
        { label: 'Total Terms', value: index?.totalWords || 0 },
        {
          label: 'Status',
          value: index?.indexedDocuments > 0 ? 'Active' : 'Idle',
        },
      ],
    },
    {
      title: 'File Storage',
      icon: Grid3x3,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-100',
      highlight: storage?.totalFiles || 0,
      progress: storageProgress,
      rows: [
        {
          label: 'Total Size',
          value: `${((storage?.totalSize || 0) / 1024).toFixed(1)} KB`,
        },
        { label: 'Uploaded', value: storage?.filesUploaded || 0 },
        { label: 'Unique', value: storage?.uniqueHashes || 0 },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((c, i) => (
        <Card
          key={c.title}
          className="group relative overflow-hidden p-6 bg-white border-slate-200 shadow-sm hover-lift"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${c.iconBg}`}>
                <c.icon className={`w-5 h-5 ${c.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-slate-500">{c.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-slate-800">
                    {c.highlight}
                  </p>
                  {i === 0 && (
                    <TrendIcon
                      className={`w-4 h-4 ${
                        trend === 'up'
                          ? 'text-emerald-500'
                          : trend === 'down'
                          ? 'text-red-500'
                          : 'text-slate-400'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Progress value={c.progress} className="h-1.5 bg-slate-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {c.rows.map((r) => (
                <div key={r.label}>
                  <p className="text-xs text-slate-500">{r.label}</p>
                  <p className="text-sm font-medium text-slate-700">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
