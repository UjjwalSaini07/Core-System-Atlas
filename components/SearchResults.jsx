'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  FileText, Zap, Copy, ExternalLink, Check, 
  Search, Filter, Grid, List, SortAsc, SortDesc,
  Download, Eye, Calendar, Hash, BarChart3
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export function SearchResults({ results, cacheHit = false, query = '', onView }) {
  const [copiedId, setCopiedId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [viewMode, setViewMode] = useState('list') // 'list' | 'grid'
  const [sortBy, setSortBy] = useState('score') // 'score' | 'date' | 'filename'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc' | 'desc'
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'txt' | 'md' | 'code'
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!results?.length) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }

      if (e.key === 'Enter') {
        onView?.(results[activeIndex])
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [results, activeIndex, onView])

  // Reset when results change
  useEffect(() => {
    setActiveIndex(0)
    setSelectedIds(new Set())
  }, [results])

  const highlight = (text) => {
    if (!query) return text
    const idx = text.toLowerCase().indexOf(query.toLowerCase())
    if (idx === -1) return text

    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-cyan-500/20 text-cyan-300 rounded px-0.5">
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    )
  }

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {}
  }

  const getFileType = (filename) => {
    if (!filename) return 'other'
    const ext = filename.split('.').pop()?.toLowerCase()
    if (['txt', 'md', 'json'].includes(ext)) return 'txt'
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java'].includes(ext)) return 'code'
    return 'other'
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Filter and sort results
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results

    // Filter by file type
    if (filterType !== 'all') {
      filtered = filtered.filter(r => {
        if (filterType === 'txt') return getFileType(r.filename) === 'txt'
        if (filterType === 'code') return getFileType(r.filename) === 'code'
        return true
      })
    }

    // Filter by search query (within results)
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.preview?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    return [...filtered].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'score':
          comparison = (Number(b.score) || 0) - (Number(a.score) || 0)
          break
        case 'date':
          comparison = (b.uploadedAt || 0) - (a.uploadedAt || 0)
          break
        case 'filename':
          comparison = a.filename.localeCompare(b.filename)
          break
      }
      return sortOrder === 'desc' ? comparison : -comparison
    })
  }, [results, filterType, searchQuery, sortBy, sortOrder])

  const toggleSelection = (id) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const selectAll = () => {
    if (selectedIds.size === filteredAndSortedResults.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredAndSortedResults.map(r => r.id)))
    }
  }

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
        <p className="text-lg text-[var(--color-foreground)] mb-2">
          {query ? 'No results found' : 'Upload files and start searching'}
        </p>
        {query && (
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Try different keywords or check spelling
          </p>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center">
          <h3 className="text-xl font-semibold">Search Results</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search within results */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <Input
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-40 bg-[var(--color-muted)]/50 border-[var(--color-border)]"
            />
          </div>

          {/* Filter by type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-muted)]/50 border border-[var(--color-border)] text-sm"
          >
            <option value="all">All Types</option>
            <option value="txt">Text</option>
            <option value="code">Code</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-[var(--color-muted)]/50 border border-[var(--color-border)] text-sm"
          >
            <option value="score">Sort by Score</option>
            <option value="date">Sort by Date</option>
            <option value="filename">Sort by Name</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="p-2 rounded-lg bg-[var(--color-muted)]/50 border border-[var(--color-border)] hover:bg-[var(--color-muted)]"
          >
            {sortOrder === 'desc' ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
          </button>

          {/* View mode */}
          <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[var(--color-muted)]' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[var(--color-muted)]' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
          {cacheHit && (
            <Badge className="bg-green-500/20 border-green-500/30 text-green-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Cached
            </Badge>
          )}
        </div>
      </div>

      {/* Selection bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-muted)]/30 border border-[var(--color-border)]">
          <Button size="sm" variant="ghost" onClick={selectAll}>
            {selectedIds.size === filteredAndSortedResults.length ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-sm text-[var(--color-muted-foreground)]">
            {selectedIds.size} selected
          </span>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              const selected = results.filter(r => selectedIds.has(r.id))
              // Export functionality could go here
              console.log('Export:', selected)
            }}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      )}

      {/* Results */}
      <ScrollArea className={viewMode === 'grid' ? 'h-auto' : 'h-[500px]'}>
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3 pr-4'
        }>
          {filteredAndSortedResults.map((r, idx) => {
            const isActive = idx === activeIndex
            const isSelected = selectedIds.has(r.id)
            return (
              <Card
                key={r.id}
                tabIndex={0}
                className={`group relative p-4 glass hover-lift cursor-pointer transition-all ${
                  isActive ? 'ring-1 ring-cyan-500/50' : ''
                } ${isSelected ? 'ring-1 ring-cyan-500/30 bg-cyan-500/5' : ''}`}
                onMouseEnter={() => {
                  setHoveredId(r.id)
                  setActiveIndex(idx)
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onView?.(r)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Selection checkbox */}
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggleSelection(r.id)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 rounded border-[var(--color-border)]"
                      />
                      <span className="text-xs font-mono bg-[var(--color-muted)] px-2 py-0.5 rounded text-muted-foreground">
                        #{idx + 1}
                      </span>
                      <p className="font-medium truncate flex items-center gap-2">
                        {highlight(r.filename || '')}
                        <ExternalLink className="w-3 h-3 opacity-40 flex-shrink-0" />
                      </p>
                    </div>

                    <p className="text-xs font-mono text-muted-foreground line-clamp-2 mb-3">
                      {highlight(r.preview || '')}
                    </p>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 border-blue-500/20 text-blue-400"
                      >
                        <BarChart3 className="w-3 h-3 mr-1" />
                        {Number(r.score).toFixed(2)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                      >
                        <Hash className="w-3 h-3 mr-1" />
                        {r.uniqueWordCount || 0} unique
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-500/10 border-purple-500/20 text-purple-400"
                      >
                        {r.wordCount || 0} words
                      </Badge>
                      {r.uploadedAt && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 border-green-500/20 text-green-400"
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(r.uploadedAt)}
                        </Badge>
                      )}
                    </div>

                    {/* File type indicator */}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {getFileType(r.filename).toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onView?.(r)
                      }}
                      className="p-2 rounded-lg bg-[var(--color-muted)] hover:bg-[var(--color-muted-foreground)]/20"
                      title="View"
                    >
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopy(r.preview || '', r.id)
                      }}
                      className="p-2 rounded-lg bg-[var(--color-muted)] hover:bg-[var(--color-muted-foreground)]/20"
                      title="Copy"
                    >
                      {copiedId === r.id ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom progress indicator */}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all ${
                    hoveredId === r.id || isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </Card>
            )
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
        <span>
          Showing {filteredAndSortedResults.length} of {results.length} results
        </span>
        <div className="flex items-center gap-2">
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
    </div>
  )
}
