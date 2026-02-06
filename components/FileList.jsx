'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { FileText, Trash2, Eye, Search, ArrowUpDown, Clock, Hash } from 'lucide-react'

export function FileList({ files, onDelete, onView }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'size'
  const [sortOrder, setSortOrder] = useState('desc') // 'asc', 'desc'

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

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (file) =>
          file.filename.toLowerCase().includes(query) ||
          file.preview.toLowerCase().includes(query)
      )
    }

    // Sort
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
      <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-center">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 text-lg">No files uploaded yet</p>
        <p className="text-slate-500 text-sm mt-2">
          Upload files using the search tab to get started
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>Uploaded Files</span>
          <Badge className="bg-slate-700 text-slate-300">
            {filteredAndSortedFiles.length}
          </Badge>
        </h3>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder="Filter files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 pl-9"
            />
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <ArrowUpDown className="w-3 h-3" />
          Sort by:
        </span>
        <button
          onClick={() => handleSort('date')}
          className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${
            sortBy === 'date'
              ? 'bg-cyan-700 text-cyan-300'
              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
          }`}
        >
          <Clock className="w-3 h-3" />
          Date
          {sortBy === 'date' && (
            <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
          )}
        </button>
        <button
          onClick={() => handleSort('name')}
          className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${
            sortBy === 'name'
              ? 'bg-cyan-700 text-cyan-300'
              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
          }`}
        >
          <FileText className="w-3 h-3" />
          Name
          {sortBy === 'name' && (
            <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
          )}
        </button>
        <button
          onClick={() => handleSort('size')}
          className={`text-xs px-2 py-1 rounded transition-colors flex items-center gap-1 ${
            sortBy === 'size'
              ? 'bg-cyan-700 text-cyan-300'
              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
          }`}
        >
          <Hash className="w-3 h-3" />
          Size
          {sortBy === 'size' && (
            <span className="text-xs">{sortOrder === 'desc' ? '↓' : '↑'}</span>
          )}
        </button>
      </div>

      <ScrollArea className="h-80">
        <div className="space-y-2 pr-4">
          {filteredAndSortedFiles.map((file) => (
            <Card
              key={file.id}
              className="p-4 bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
              onClick={() => onView(file)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <p className="font-medium text-white truncate">
                      {file.filename}
                    </p>
                    <Badge variant="outline" className="bg-slate-700 border-slate-600 text-slate-400 text-xs">
                      v{file.version}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {file.preview}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-slate-300 flex items-center gap-1"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      {formatSize(file.size)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-slate-300"
                    >
                      {file.wordCount} words
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-slate-300 flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {formatDate(file.uploadedAt)}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onView(file)
                    }}
                    className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
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
                    className="bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Progress bar on hover */}
              <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-300" />
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          {filteredAndSortedFiles.length} of {files.length} files
        </span>
        <span>
          Total size:{' '}
          {formatSize(files.reduce((acc, f) => acc + f.size, 0))}
        </span>
      </div>
    </div>
  )
}
