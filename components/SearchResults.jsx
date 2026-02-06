'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Zap } from 'lucide-react'

export function SearchResults({
  results,
  cacheHit = false,
  query = '',
}) {
  if (!results || results.length === 0) {
    return (
      <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-center">
        <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3 opacity-50" />
        <p className="text-slate-400">
          {query
            ? 'No results found'
            : 'Upload files and search to see results'}
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Search Results ({results.length})
        </h3>

        {cacheHit && (
          <Badge className="bg-green-600 text-white flex items-center gap-1">
            <Zap className="w-3 h-3" /> Cached
          </Badge>
        )}
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-3 pr-4">
          {results.map((result, idx) => (
            <Card
              key={result.id}
              className="p-4 bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-slate-400">
                      #{idx + 1}
                    </span>
                    <p className="font-medium text-white truncate">
                      {result.filename}
                    </p>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                    {result.preview}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-900/30 border-blue-700 text-blue-300"
                    >
                      Score: {result.score}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-cyan-900/30 border-cyan-700 text-cyan-300"
                    >
                      {result.uniqueWordCount} words
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-purple-900/30 border-purple-700 text-purple-300"
                    >
                      {result.wordCount} total
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
