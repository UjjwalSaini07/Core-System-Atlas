'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Zap, Clock, Keyboard, Sparkles, ArrowRight, CloudOff, Cloud } from 'lucide-react'

export function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isServerConnected, setIsServerConnected] = useState(false)
  const inputRef = useRef(null)
  const debounceTimer = useRef(null)

  // offline data for when server is not connected
  const offlineFiles = [
    { id: '1', filename: 'sample.txt', preview: 'This is a sample document about scalable systems and distributed computing concepts...', wordCount: 150, uniqueWordCount: 80, score: 0.95 },
    { id: '2', filename: 'readme.md', preview: 'Welcome to the Scalable Systems Simulator documentation and user guide...', wordCount: 250, uniqueWordCount: 120, score: 0.88 },
    { id: '3', filename: 'notes.txt', preview: 'Technical notes on database optimization, caching strategies, and search algorithms...', wordCount: 180, uniqueWordCount: 95, score: 0.82 },
  ]

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
      }
    }
    checkServer()
  }, [])

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, 150)
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query])

  useEffect(() => {
    if (debouncedQuery.length >= 2 && isServerConnected) {
      handleAutocomplete(debouncedQuery)
    } else if (debouncedQuery.length >= 2 && !isServerConnected) {
      // offline autocomplete
      const offlineSuggestions = ['scalable', 'systems', 'search', 'cache', 'database']
        .filter(s => s.toLowerCase().startsWith(debouncedQuery.toLowerCase()))
        .slice(0, 5)
      setSuggestions(offlineSuggestions)
      setShowSuggestions(offlineSuggestions.length > 0)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery, isServerConnected])

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearching(true)
    
    if (!recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
    }

    try {
      if (isServerConnected) {
        const response = await fetch(
          `http://localhost:3001/api/search?q=${encodeURIComponent(query)}&limit=20`
        )
        const result = await response.json()

        if (result.success) {
          onSearch(result.results, result.cacheHit)
          setShowSuggestions(false)
        }
      } else {
        // offline search
        await new Promise(resolve => setTimeout(resolve, 500))
        const filtered = offlineFiles.filter(f => 
          f.filename.toLowerCase().includes(query.toLowerCase()) ||
          f.preview.toLowerCase().includes(query.toLowerCase())
        )
        onSearch(filtered.length > 0 ? filtered : offlineFiles, false)
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Search failed:', error)
      // Fallback to offline mode
      const filtered = offlineFiles.filter(f => 
        f.filename.toLowerCase().includes(query.toLowerCase()) ||
        f.preview.toLowerCase().includes(query.toLowerCase())
      )
      onSearch(filtered.length > 0 ? filtered : offlineFiles, false)
      setShowSuggestions(false)
    } finally {
      setSearching(false)
    }
  }

  const handleAutocomplete = async (prefix) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/autocomplete?prefix=${encodeURIComponent(prefix)}&limit=5`
      )
      const result = await response.json()

      if (result.success) {
        setSuggestions(result.suggestions)
        setShowSuggestions(result.suggestions.length > 0)
      }
    } catch (error) {
      console.error('Autocomplete failed:', error)
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleClearRecent = () => {
    setRecentSearches([])
  }

  return (
    <Card className="group relative overflow-hidden p-6 bg-gradient-to-br from-[var(--color-card)] to-[var(--color-muted)]/30 border-[var(--color-border)] hover-lift animated-border h-full">
      {/* Server Status Badge */}
      <div className="absolute top-2 right-7 mt-2">
        {isServerConnected ? (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-xs text-green-400">
            <Cloud className="w-3 h-3" />
            Connected
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            <CloudOff className="w-3 h-3" />
            Offline
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
            <Search className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Search Files</h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">Find indexed documents</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-purple-500/10 border-purple-500/20 text-purple-400 mt-3">
          <Zap className="w-3 h-3 mr-1" />
          Instant
        </Badge>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 flex items-center pointer-events-none">
            {searching ? (
              <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-[var(--color-muted-foreground)]" />
            )}
          </div>
          <Input
            ref={inputRef}
            placeholder="Search indexed files..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-12 pr-24 py-4 bg-[var(--color-muted)]/50 border-[var(--color-border)] focus:border-purple-500 text-lg"
          />
          <div className="absolute right-2 flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-[var(--color-muted)]/50 rounded text-xs text-[var(--color-muted-foreground)]">
              <Keyboard className="w-3 h-3" />
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {(showSuggestions && suggestions.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl overflow-hidden z-50">
            <div className="px-4 py-2 bg-[var(--color-muted)]/30 border-b border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Suggestions
              </span>
              <span className="text-xs text-[var(--color-muted-foreground)]">
                Press ↓ to select
              </span>
            </div>
            {suggestions.map((suggestion, idx) => (
              <button
                key={suggestion}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[var(--color-muted)] transition-colors ${
                  idx === 0 ? 'bg-[var(--color-muted)]/50' : ''
                }`}
              >
                <Search className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <span className="text-[var(--color-foreground)]">{suggestion}</span>
                <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] ml-auto opacity-0 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl p-4 z-40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-[var(--color-muted-foreground)] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Recent Searches
              </span>
              <button
                onClick={handleClearRecent}
                className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setQuery(search)
                    handleSearch()
                  }}
                  className="px-3 py-1.5 bg-[var(--color-muted)]/50 hover:bg-[var(--color-muted)] rounded-full text-sm text-[var(--color-foreground)] transition-colors flex items-center gap-2"
                >
                  <Clock className="w-3 h-3 text-[var(--color-muted-foreground)]" />
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-3 mb-3 pt-4 border-t border-[var(--color-border)]">
        <p className="text-xs text-[var(--color-muted-foreground)] mb-3">Search Tips:</p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-[var(--color-muted)]/30 rounded text-xs text-[var(--color-muted-foreground)]">
            "exact phrase"
          </span>
          <span className="px-2 py-1 bg-[var(--color-muted)]/30 rounded text-xs text-[var(--color-muted-foreground)]">
            AND, OR, NOT
          </span>
          <span className="px-2 py-1 bg-[var(--color-muted)]/30 rounded text-xs text-[var(--color-muted-foreground)]">
            ←→ Arrow keys
          </span>
        </div>
      </div>
    </Card>
  )
}
