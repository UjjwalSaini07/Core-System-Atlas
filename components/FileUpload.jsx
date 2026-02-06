'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FileUpload({ onFileUploaded, isLoading }) {
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  const handleUpload = async () => {
    if (!filename.trim() || !content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both filename and content',
        variant: 'warning',
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90))
    }, 100)

    try {
      const response = await fetch(
        'http://localhost:3001/api/files/upload',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename,
            content,
            mimeType: 'text/plain',
          }),
        }
      )

      const result = await response.json()

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        toast({
          title: 'File Uploaded',
          description: `${filename} has been indexed successfully`,
          variant: 'success',
        })
        onFileUploaded(result.metadata)
        setFilename('')
        setContent('')
      } else {
        toast({
          title: 'Upload Failed',
          description: result.message || 'An error occurred during upload',
          variant: 'destructive',
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      console.error('Upload failed:', error)
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server',
        variant: 'destructive',
      })
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const reader = new FileReader()
        reader.onload = (event) => {
          setFilename(file.name)
          setContent(event.target.result)
        }
        reader.readAsText(file)
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload text files only',
          variant: 'warning',
        })
      }
    }
  }, [toast])

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        setFilename(file.name)
        setContent(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Upload File
            </h3>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.html,.css"
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
          >
            <FileText className="w-4 h-4 mr-2" />
            Browse
          </Button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 hover:border-slate-500'
          }`}
        >
          {dragActive && (
            <div className="absolute inset-0 bg-blue-500/5 rounded-lg" />
          )}
          <div className="relative z-10">
            <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              Drag & drop a file here, or click Browse
            </p>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Filename
          </label>
          <Input
            placeholder="e.g., document.txt"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
            disabled={uploading || isLoading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Content
          </label>
          <Textarea
            placeholder="Enter file content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 h-32 resize-none"
            disabled={uploading || isLoading}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={
            uploading ||
            isLoading ||
            !filename.trim() ||
            !content.trim()
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            SHA-256 Hashing
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-400" />
            Auto Indexing
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            Max 50MB
          </span>
        </div>
      </div>
    </Card>
  )
}
