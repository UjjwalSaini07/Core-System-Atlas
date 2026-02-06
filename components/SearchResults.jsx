'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Zap, Copy, ExternalLink, Check } from 'lucide-react'
import { useState } from 'react'

export function SearchResults({ results, cacheHit = false, query = '', onView }) {
  const [copiedId, setCopiedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  if (!results || results.length === 0) {
    return (
      <Card className="p-12 glass-card text-center">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
            <FileText className="w-10 h-10 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
        <p className="text-[var(--color-foreground)] text-lg mb-2">
          {query ? 'No results found' : 'Upload files and start searching'}
        </p>
        {query && (
          <p className="text-sm text-[var(--color-muted-foreground)]">
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
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Search Results</h3>
          <Badge className="bg-cyan-500/20 border-cyan-500/30 text-cyan-400">{results.length} found</Badge>
        </div>
        {cacheHit && (
          <Badge className="bg-green-500/20 border-green-500/30 text-green-400 flex items-center gap-1">
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
              className={`p-4 glass hover-lift cursor-pointer transition-all duration-300 ${
                hoveredId === result.id ? 'ring-1 ring-cyan-500/50' : ''
              }`}
              onMouseEnter={() => setHoveredId(result.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onView?.(result)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-[var(--color-muted-foreground)] bg-[var(--color-muted)] px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <p className="font-medium text-[var(--color-foreground)] flex items-center gap-2 truncate">
                      {result.filename}
                      <ExternalLink className="w-3 h-3 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </p>
                  </div>
                  <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mb-3 font-mono text-xs">
                    {result.preview}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                      Score: {parseFloat(result.score).toFixed(2)}
                    </Badge>
                    <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
                      {result.uniqueWordCount} unique
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400">
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
                    className="p-2 bg-[var(--color-muted)] hover:bg-[var(--color-muted-foreground)]/20 rounded-lg transition-colors"
                    title="Copy preview"
                  >
                    {copiedId === result.id ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                    )}
                  </button>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ${hoveredId === result.id ? 'w-full' : 'w-0'}`} />
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)] pt-2">
        <span>Showing {results.length} of {results.length} results</span>
        <span className="flex items-center gap-1">
          {cacheHit ? (
            <>
              <Zap className="w-3 h-3 text-green-400" />
              Served from cache
            </>
          ) : (
            'Fresh search'
          )}
        </span>
      </div>
    </div>
  )
}
