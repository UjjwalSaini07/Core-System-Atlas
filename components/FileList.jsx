'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Trash2, Eye } from 'lucide-react'

export function FileList({ files, onDelete, onView }) {
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  if (!files || files.length === 0) {
    return (
      <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-center">
        <FileText className="w-8 h-8 text-slate-500 mx-auto mb-3 opacity-50" />
        <p className="text-slate-400">No files uploaded yet</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Uploaded Files ({files.length})
      </h3>

      <ScrollArea className="h-64">
        <div className="space-y-2 pr-4">
          {files.map((file) => (
            <Card
              key={file.id}
              className="p-4 bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <p className="font-medium text-white truncate">
                      {file.filename}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                    {file.preview}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-slate-300"
                    >
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
                      className="bg-slate-700 border-slate-600 text-slate-300"
                    >
                      v{file.version}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(file)}
                    className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(file.id)}
                    className="bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
