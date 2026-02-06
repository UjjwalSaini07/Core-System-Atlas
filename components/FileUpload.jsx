'use client'

import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle, File, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FileUpload({ onFileUploaded, isLoading }) {
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('idle') // idle, uploading, success, error
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
    setUploadStatus('uploading')
    setUploadProgress(0)

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 15, 90))
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
        setUploadStatus('success')
        toast({
          title: 'File Uploaded Successfully',
          description: `${filename} has been indexed and is ready for search`,
          variant: 'success',
        })
        onFileUploaded(result.metadata)
        setFilename('')
        setContent('')
      } else {
        setUploadStatus('error')
        toast({
          title: 'Upload Failed',
          description: result.message || 'An error occurred during upload',
          variant: 'destructive',
        })
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus('error')
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
        setUploadStatus('idle')
      }, 2000)
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

  const features = [
    { icon: '🔍', text: 'Full-text search' },
    { icon: '⚡', text: 'Auto indexing' },
    { icon: '🔒', text: 'SHA-256 hashing' },
    { icon: '📊', text: 'Real-time analytics' },
  ]

  return (
    <Card className="group relative overflow-hidden p-6 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-muted)]/30 border-[var(--color-border)] hover-lift animated-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20">
            <Upload className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Upload File</h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">Add documents to the index</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="bg-[var(--color-muted)]/50 border-[var(--color-border)] hover:bg-[var(--color-muted)]"
        >
          <File className="w-4 h-4 mr-2" />
          Browse
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.html,.css"
          className="hidden"
        />
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative mb-6 rounded-xl border-2 border-dashed transition-all duration-300 ${
          dragActive
            ? 'border-cyan-500 bg-cyan-500/10'
            : 'border-[var(--color-border)] hover:border-[var(--color-muted-foreground)]'
        }`}
      >
        <div className="p-8 text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all ${
            dragActive ? 'bg-cyan-500/20 scale-110' : 'bg-[var(--color-muted)]'
          }`}>
            <FileText className="w-8 h-8 text-[var(--color-muted-foreground)]" />
          </div>
          <p className="text-[var(--color-foreground)] mb-2">
            <span className="text-cyan-400 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            TXT, MD, JSON, JS, TS, JSX, TSX, HTML, CSS
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)] block mb-2">
            Filename
          </label>
          <Input
            placeholder="e.g., document.txt"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="bg-[var(--color-muted)]/50 border-[var(--color-border)] focus:border-cyan-500"
            disabled={uploading}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--color-muted-foreground)] block mb-2">
            Content
          </label>
          <Textarea
            placeholder="Enter file content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-[var(--color-muted)]/50 border-[var(--color-border)] focus:border-cyan-500 resize-none"
            disabled={uploading}
          />
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-6 p-4 rounded-xl bg-[var(--color-muted)]/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {uploadStatus === 'success' ? 'Upload Complete!' : 'Uploading...'}
            </span>
            <span className="text-sm font-medium text-cyan-400">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
          {uploadStatus === 'success' && (
            <div className="flex items-center gap-2 mt-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">File indexed successfully</span>
            </div>
          )}
        </div>
      )}

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={uploading || !filename.trim() || !content.trim()}
        className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Upload & Index
          </>
        )}
      </Button>

      {/* Features */}
      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-[var(--color-border)]">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
            <span>{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
