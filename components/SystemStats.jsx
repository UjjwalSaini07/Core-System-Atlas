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
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
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
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
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
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
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
          className="group relative overflow-hidden p-6 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-muted)]/30 border-[var(--color-border)] hover-lift"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-xl ${c.iconBg}`}>
                <c.icon className={`w-5 h-5 ${c.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{c.title}</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold gradient-text">
                    {c.highlight}
                  </p>
                  {i === 0 && (
                    <TrendIcon
                      className={`w-4 h-4 ${
                        trend === 'up'
                          ? 'text-green-400'
                          : trend === 'down'
                          ? 'text-red-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Progress value={c.progress} className="h-1.5" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {c.rows.map((r) => (
                <div key={r.label}>
                  <p className="text-xs text-muted-foreground">{r.label}</p>
                  <p className="text-sm font-medium">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
