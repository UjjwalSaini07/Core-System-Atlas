'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Database, Zap, Grid3x3, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export function SystemStats({ stats }) {
  const [cacheHitRate, setCacheHitRate] = useState('0%')
  const [prevCacheHitRate, setPrevCacheHitRate] = useState(null)
  const [animateKey, setAnimateKey] = useState(0)

  useEffect(() => {
    if (stats?.cache) {
      const newHitRate = stats.cache.hitRate || '0%'
      if (prevCacheHitRate !== null && parseFloat(newHitRate) > parseFloat(prevCacheHitRate)) {
        setAnimateKey((prev) => prev + 1)
      }
      setPrevCacheHitRate(newHitRate)
      setCacheHitRate(newHitRate)
    }
  }, [stats?.cache])

  const getTrendIcon = () => {
    if (!prevCacheHitRate) return <Minus className="w-4 h-4 text-slate-400" />
    const current = parseFloat(cacheHitRate)
    const prev = parseFloat(prevCacheHitRate)
    if (current > prev) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (current < prev) return <TrendingDown className="w-4 h-4 text-red-400" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const calculateFillPercentage = () => {
    const size = stats?.cache?.size || 0
    const capacity = stats?.cache?.capacity || 100
    return Math.min((size / capacity) * 100, 100)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Cache Stats */}
      <Card className="p-5 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50 relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              LRU Cache
            </p>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-blue-400">
                  {stats?.cache?.size || 0}
                </p>
                <span className="text-blue-300/70">/ {stats?.cache?.capacity || 100}</span>
              </div>
              
              {/* Capacity bar */}
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                  style={{ width: `${calculateFillPercentage()}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-200/70">
                  Hit Rate: {cacheHitRate}
                </span>
                {getTrendIcon()}
              </div>
              
              <div className="flex gap-4 text-xs">
                <span className="text-green-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  {stats?.cache?.hits || 0} hits
                </span>
                <span className="text-red-400 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  {stats?.cache?.misses || 0} misses
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </Card>

      {/* Index Stats */}
      <Card className="p-5 bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-sm font-medium text-green-300 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Search Index
            </p>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-green-400">
                  {stats?.index?.indexedDocuments || 0}
                </p>
                <span className="text-green-300/70">docs</span>
              </div>
              
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-200/70">Unique words</span>
                  <span className="text-green-400 font-mono">{stats?.index?.indexSize || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-200/70">Total terms</span>
                  <span className="text-green-400 font-mono">{stats?.index?.totalWords || 0}</span>
                </div>
              </div>

              {/* Index health indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  stats?.index?.indexedDocuments > 0 ? 'bg-green-400 animate-pulse' : 'bg-slate-500'
                }`} />
                <span className="text-xs text-green-200/70">
                  {stats?.index?.indexedDocuments > 0 ? 'Index active' : 'No documents indexed'}
                </span>
              </div>
            </div>
          </div>
          <div className="p-3 bg-green-500/10 rounded-lg">
            <Database className="w-6 h-6 text-green-400" />
          </div>
        </div>
      </Card>

      {/* File Storage Stats */}
      <Card className="p-5 bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />
              File Storage
            </p>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-purple-400">
                  {stats?.fileStorage?.totalFiles || 0}
                </p>
                <span className="text-purple-300/70">files</span>
              </div>
              
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-purple-200/70">Total size</span>
                  <span className="text-purple-400 font-mono">
                    {((stats?.fileStorage?.totalSize || 0) / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200/70">Uploaded</span>
                  <span className="text-purple-400 font-mono">{stats?.fileStorage?.filesUploaded || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-200/70">Unique hashes</span>
                  <span className="text-purple-400 font-mono">{stats?.fileStorage?.uniqueHashes || 0}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Grid3x3 className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
