'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { FileText, Trash2, Eye, Search, ArrowUpDown, Clock, Hash, Filter } from 'lucide-react'

export function FileList({ files, onDelete, onView }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
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

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...(files || [])]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (file) =>
          file.filename.toLowerCase().includes(query) ||
          file.preview.toLowerCase().includes(query)
      )
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.filename.localeCompare(b.filename)
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'date':
        default:
          comparison = b.uploadedAt - a.uploadedAt
          break
      }
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [files, searchQuery, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  if (!files || files.length === 0) {
    return (
      <Card className="p-12 glass-card text-center">
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 rounded-full bg-[var(--color-muted)] flex items-center justify-center">
            <FileText className="w-10 h-10 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full" />
          </div>
        </div>
        <p className="text-[var(--color-foreground)] text-lg mb-2">No files uploaded yet</p>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Upload files using the search tab to get started
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Uploaded Files</h3>
          <Badge className="bg-purple-500/20 border-purple-500/30 text-purple-400">
            {filteredAndSortedFiles.length}
          </Badge>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <Input
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[var(--color-muted)]/50 border-[var(--color-border)]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Sort by:
        </span>
        {[
          { key: 'date', icon: Clock, label: 'Date' },
          { key: 'name', icon: FileText, label: 'Name' },
          { key: 'size', icon: Hash, label: 'Size' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => handleSort(item.key)}
            className={`text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
              sortBy === item.key
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                : 'bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]/80'
            }`}
          >
            <item.icon className="w-3 h-3" />
            {item.label}
            {sortBy === item.key && (
              <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
            )}
          </button>
        ))}
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-3 pr-4">
          {filteredAndSortedFiles.map((file) => (
            <Card
              key={file.id}
              className="p-4 glass hover-lift cursor-pointer transition-all duration-300 group"
              onClick={() => onView(file)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-purple-500/10">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="font-medium text-[var(--color-foreground)] truncate">{file.filename}</p>
                    <Badge variant="outline" className="bg-[var(--color-muted)] border-[var(--color-border)] text-[var(--color-muted-foreground)] text-xs">
                      v{file.version}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--color-muted-foreground)] line-clamp-1 mb-3">{file.preview}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400 flex items-center gap-1 text-xs">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      {formatSize(file.size)}
                    </Badge>
                    <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/20 text-cyan-400 text-xs">
                      {file.wordCount} words
                    </Badge>
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400 flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3" />
                      {formatDate(file.uploadedAt)}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView(file)
                    }}
                    className="bg-[var(--color-muted)] border-[var(--color-border)] hover:bg-[var(--color-muted)]/80"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(file.id)
                    }}
                    className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 w-0 group-hover:w-full transition-all duration-300" />
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
        <span>{filteredAndSortedFiles.length} of {files.length} files</span>
        <span>Total: {formatSize(files.reduce((acc, f) => acc + f.size, 0))}</span>
      </div>
    </div>
  )
}
