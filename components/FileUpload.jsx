'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Upload } from 'lucide-react'

export function FileUpload({ onFileUploaded, isLoading }) {
  const [filename, setFilename] = useState('')
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!filename.trim() || !content.trim()) {
      alert('Please enter filename and content')
      return
    }

    setUploading(true)

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

      if (result.success) {
        onFileUploaded(result.metadata)
        setFilename('')
        setContent('')
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Upload File
          </h3>
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
            className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 h-32"
            disabled={uploading || isLoading}
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={
            uploading ||
            isLoading ||
            !filename.trim() ||
            !content.trim()
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </div>
    </Card>
  )
}
