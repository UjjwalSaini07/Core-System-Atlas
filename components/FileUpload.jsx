'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle, File, Sparkles, CloudOff, Cloud } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function FileUpload({ onFileUploaded }) {
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('idle')
  const [isServerConnected, setIsServerConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const fileInputRef = useRef(null)
  const { toast } = useToast()

  // Check if server is connected
  useEffect(() => {
    const checkServer = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)
        const response = await fetch('http://localhost:3001/api/health', { 
          signal: controller.signal 
        })
        clearTimeout(timeoutId)
        setIsServerConnected(response.ok)
      } catch (error) {
        setIsServerConnected(false)
      } finally {
        setIsChecking(false)
      }
    }
    checkServer()
  }, [])

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFilename(file.name)
        setContent(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const handleUpload = async () => {
    if (!filename.trim() || !content.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a filename and content, or select a file',
        variant: 'warning',
      })
      return
    }

    setUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 15, 90))
    }, 100)

    try {
      if (isServerConnected) {
        // Real server upload
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
      } else {
        // offline mode - simulate upload
        await new Promise(resolve => setTimeout(resolve, 1500))
        clearInterval(progressInterval)
        setUploadProgress(100)
        setUploadStatus('success')
        
        // Create offline metadata
        const offlineFile = {
          id: generateId(),
          filename,
          content,
          size: new Blob([content]).size,
          wordCount: content.split(/\s+/).filter(w => w.length > 0).length,
          uniqueWordCount: new Set(content.toLowerCase().split(/\s+/)).size,
          version: 1,
          uploadedAt: Date.now(),
          preview: content.substring(0, 150) + '...',
        }
        
        toast({
          title: 'offline Mode - File Added',
          description: `${filename} added locally (backend not connected)`,
          variant: 'success',
        })
        onFileUploaded(offlineFile)
        setFilename('')
        setContent('')
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadStatus('error')
      console.error('Upload failed:', error)
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server. Using offline mode.',
        variant: 'destructive',
      })
      setIsServerConnected(false)
    } finally {
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
        setUploadStatus('idle')
      }, 2000)
    }
  }

  const features = [
    { icon: '🔍', text: 'Full-text search' },
    { icon: '⚡', text: 'Auto indexing' },
    { icon: '🔒', text: 'SHA-256 hashing' },
    { icon: '📊', text: 'Real-time analytics' },
  ]

  return (
    <div className="space-y-6">
      {/* Server Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Upload File</h2>
        {isChecking ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-muted)]/50 text-sm text-[var(--color-muted-foreground)]">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Checking...
          </div>
        ) : isServerConnected ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-sm text-green-400">
            <Cloud className="w-4 h-4" />
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-sm text-amber-400">
            <CloudOff className="w-4 h-4" />
            offline Mode
          </div>
        )}
      </div>

      {/* File Selection */}
      <Card className="p-6 bg-[var(--color-card)] border-[var(--color-border)]">
        <div className="flex flex-col gap-4">
          {/* File Input Button */}
          <div className="flex items-center gap-4">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
            >
              <File className="w-5 h-5 mr-2" />
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.md,.json,.js,.ts,.jsx,.tsx,.html,.css"
              className="hidden"
            />
            <span className="text-sm text-[var(--color-muted-foreground)]">
              {filename ? filename : 'No file selected'}
            </span>
          </div>

          {/* OR divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-sm text-[var(--color-muted-foreground)]">OR enter manually</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          {/* Filename Input */}
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

          {/* Content Input */}
          <div>
            <label className="text-sm font-medium text-[var(--color-muted-foreground)] block mb-2">
              Content
            </label>
            <Textarea
              placeholder="Enter or paste your file content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] bg-[var(--color-muted)]/50 border-[var(--color-border)] focus:border-cyan-500 resize-none"
              disabled={uploading}
            />
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="p-4 rounded-xl bg-[var(--color-muted)]/30">
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
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Upload & Index
              </>
            )}
          </Button>

          {/* Supported Formats */}
          <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <span>Supported formats:</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.txt</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.md</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.json</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.js</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.ts</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.html</span>
            <span className="px-2 py-0.5 bg-[var(--color-muted)] rounded">.css</span>
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--color-border)]">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-[var(--color-muted-foreground)]">
                <span>{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
