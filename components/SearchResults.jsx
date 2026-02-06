'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Zap, Copy, ExternalLink, Check } from 'lucide-react'
import { useState } from 'react'

export function SearchResults({
  results,
  cacheHit = false,
  query = '',
  onView,
}) {
  const [copiedId, setCopiedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  if (!results || results.length === 0) {
    return (
      <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-center">
        <div className="relative">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <div className="absolute -top-2 -right-2">
            <div className="w-4 h-4 bg-slate-700 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-slate-400 text-lg">
          {query
            ? 'No results found for your search'
            : 'Upload files and start searching'}
        </p>
        {query && (
          <p className="text-slate-500 text-sm mt-2">
            Try different keywords or check your spelling
          </p>
        )}
      </Card>
    )
  }

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>Search Results</span>
          <Badge className="bg-slate-700 text-slate-300">
            {results.length} found
          </Badge>
        </h3>

        {cacheHit && (
          <Badge className="bg-green-600 text-white flex items-center gap-1 animate-pulse">
            <Zap className="w-3 h-3" />
            Cached
          </Badge>
        )}
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-3 pr-4">
          {results.map((result, idx) => (
            <Card
              key={result.id}
              className={`p-4 bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer group ${
                hoveredId === result.id ? 'shadow-lg shadow-cyan-500/10' : ''
              }`}
              onMouseEnter={() => setHoveredId(result.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onView?.(result)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <p className="font-medium text-white truncate flex items-center gap-2">
                      {result.filename}
                      <ExternalLink className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-3 font-mono text-xs">
                    {result.preview}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-900/30 border-blue-700 text-blue-300"
                    >
                      Score: {parseFloat(result.score).toFixed(2)}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-cyan-900/30 border-cyan-700 text-cyan-300"
                    >
                      {result.uniqueWordCount} unique
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-purple-900/30 border-purple-700 text-purple-300"
                    >
                      {result.wordCount} total
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopy(result.preview, result.id)
                    }}
                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded transition-colors"
                    title="Copy preview"
                  >
                    {copiedId === result.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Hover effect bar */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${
                  hoveredId === result.id ? 'w-full' : 'w-0'
                }`}
              />
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
        <span>
          Showing {results.length} of {results.length} results
        </span>
        <span>
          {cacheHit ? 'Served from cache' : 'Fresh search'}
        </span>
      </div>
    </div>
  )
}
