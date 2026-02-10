'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Eye, AlertCircle, CheckCircle, Search, Key } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export function CodeFetch({ onView }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFetch = async () => {
    if (!code.trim() || code.length !== 5) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a 5-digit code',
        variant: 'warning',
      })
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`http://localhost:3001/api/files/code/${code}`)
      const data = await response.json()

      if (data.success) {
        setResult(data.file)
        toast({
          title: 'File Found',
          description: `Retrieved: ${data.file.filename}`,
          variant: 'success',
        })
      } else {
        setError(data.message)
        toast({
          title: 'Not Found',
          description: data.message,
          variant: 'destructive',
        })
      }
    } catch (err) {
      setError('Failed to connect to server')
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetch()
    }
  }

  return (
    <Card className="p-6 bg-[var(--color-card)] border-[var(--color-border)] h-full flex flex-col">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
              Fetch by Code
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Enter a 5-digit code to retrieve a file
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
            <Input
              placeholder="Enter 5-digit code..."
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
              onKeyPress={handleKeyPress}
              maxLength={5}
              className="pl-10 bg-[var(--color-muted)]/50 border-[var(--color-border)] text-center text-lg tracking-widest font-mono"
              disabled={loading}
            />
          </div>
          <Button
            onClick={handleFetch}
            disabled={loading || code.length !== 5}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Fetching...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Fetch
              </>
            )}
          </Button>
        </div>

        {/* Code hint */}
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
          <AlertCircle className="w-3 h-3" />
          <span>Enter the unique 5-digit code shown when the file was uploaded</span>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-medium text-green-400">File Found!</span>
              <Badge className="bg-purple-500/20 border-purple-500/30 text-purple-400">
                Code: {result.uniqueCode}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-muted)]/30 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FileText className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{result.filename}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {result.size} bytes • v{result.version}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onView?.(result)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                View File
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(result.content)
                  toast({
                    title: 'Copied',
                    description: 'File content copied to clipboard',
                    variant: 'success',
                  })
                }}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                Copy Content
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="font-medium text-red-400">Error</span>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              {error}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
