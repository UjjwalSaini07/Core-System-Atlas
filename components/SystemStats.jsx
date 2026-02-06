'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Database, Zap, Grid3x3 } from 'lucide-react'

export function SystemStats({ stats }) {
  const [cacheHitRate, setCacheHitRate] = useState('0%')

  useEffect(() => {
    if (stats?.cache) {
      setCacheHitRate(stats.cache.hitRate || '0%')
    }
  }, [stats])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Cache Stats */}
      <Card className="p-5 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-300 mb-2">
              LRU Cache
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-400">
                {stats?.cache?.size || 0}/{stats?.cache?.capacity || 100}
              </p>
              <p className="text-xs text-blue-200">
                Hit Rate: {cacheHitRate}
              </p>
              <p className="text-xs text-blue-200">
                {stats?.cache?.hits || 0} hits,{' '}
                {stats?.cache?.misses || 0} misses
              </p>
            </div>
          </div>
          <Zap className="w-6 h-6 text-blue-400" />
        </div>
      </Card>

      {/* Index Stats */}
      <Card className="p-5 bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-green-300 mb-2">
              Search Index
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-400">
                {stats?.index?.indexedDocuments || 0}
              </p>
              <p className="text-xs text-green-200">
                {stats?.index?.indexSize || 0} unique words
              </p>
              <p className="text-xs text-green-200">
                {stats?.index?.totalWords || 0} indexed terms
              </p>
            </div>
          </div>
          <Database className="w-6 h-6 text-green-400" />
        </div>
      </Card>

      {/* File Storage Stats */}
      <Card className="p-5 bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-purple-300 mb-2">
              File Storage
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-400">
                {stats?.fileStorage?.totalFiles || 0}
              </p>
              <p className="text-xs text-purple-200">
                {(
                  (stats?.fileStorage?.totalSize || 0) / 1024
                ).toFixed(1)}{' '}
                KB total
              </p>
              <p className="text-xs text-purple-200">
                {stats?.fileStorage?.filesUploaded || 0} uploaded
              </p>
            </div>
          </div>
          <Grid3x3 className="w-6 h-6 text-purple-400" />
        </div>
      </Card>
    </div>
  )
}
