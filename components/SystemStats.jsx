'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Database, Zap, Grid3x3, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'

export function SystemStats({ stats }) {
  const [cacheHitRate, setCacheHitRate] = useState(0)
  const [prevCacheHitRate, setPrevCacheHitRate] = useState(null)

  useEffect(() => {
    if (stats?.cache) {
      const newHitRate = parseFloat(stats.cache.hitRate || 0)
      setPrevCacheHitRate(cacheHitRate)
      setCacheHitRate(newHitRate)
    }
  }, [stats?.cache])

  const getTrendIcon = () => {
    if (prevCacheHitRate === null) return <Activity className="w-4 h-4 text-[var(--color-muted-foreground)]" />
    if (cacheHitRate > prevCacheHitRate) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (cacheHitRate < prevCacheHitRate) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-[var(--color-muted-foreground)]" />
  }

  const calculateFillPercentage = () => {
    const size = stats?.cache?.size || 0
    const capacity = stats?.cache?.capacity || 100
    return Math.min((size / capacity) * 100, 100)
  }

  const statsCards = [
    {
      title: 'LRU Cache',
      icon: Zap,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10',
      gradient: 'from-cyan-500 to-blue-500',
      data: [
        { label: 'Size', value: `${stats?.cache?.size || 0}/${stats?.cache?.capacity || 100}`, highlight: true },
        { label: 'Hit Rate', value: `${cacheHitRate.toFixed(1)}%` },
        { label: 'Hits', value: stats?.cache?.hits || 0 },
        { label: 'Misses', value: stats?.cache?.misses || 0 },
      ],
      progress: calculateFillPercentage(),
    },
    {
      title: 'Search Index',
      icon: Database,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
      gradient: 'from-green-500 to-emerald-500',
      data: [
        { label: 'Documents', value: stats?.index?.indexedDocuments || 0, highlight: true },
        { label: 'Unique Words', value: stats?.index?.indexSize || 0 },
        { label: 'Total Terms', value: stats?.index?.totalWords || 0 },
        { label: 'Status', value: stats?.index?.indexedDocuments > 0 ? 'Active' : 'Idle' },
      ],
      progress: Math.min((stats?.index?.indexSize || 0) / 10, 100),
    },
    {
      title: 'File Storage',
      icon: Grid3x3,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      gradient: 'from-purple-500 to-pink-500',
      data: [
        { label: 'Files', value: stats?.fileStorage?.totalFiles || 0, highlight: true },
        { label: 'Total Size', value: `${((stats?.fileStorage?.totalSize || 0) / 1024).toFixed(1)} KB` },
        { label: 'Uploaded', value: stats?.fileStorage?.filesUploaded || 0 },
        { label: 'Unique', value: stats?.fileStorage?.uniqueHashes || 0 },
      ],
      progress: Math.min((stats?.fileStorage?.totalFiles || 0) / 10, 100),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statsCards.map((card, idx) => (
        <Card
          key={idx}
          className="group relative overflow-hidden p-6 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-muted)]/30 border-[var(--color-border)] hover-lift"
        >
          {/* Animated gradient border */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${card.iconBg} border border-white/5`}>
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-muted-foreground)]">{card.title}</p>
                  <div className="flex items-center gap-2">
                    <p className={`text-2xl font-bold ${card.data.find(d => d.highlight) ? 'gradient-text' : 'text-[var(--color-foreground)]'}`}>
                      {card.data.find(d => d.highlight)?.value}
                    </p>
                    {idx === 0 && getTrendIcon()}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <Progress value={card.progress} className="h-1.5" />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {card.data.filter(d => !d.highlight).map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xs text-[var(--color-muted-foreground)]">{item.label}</span>
                  <span className="text-sm font-medium text-[var(--color-foreground)]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
