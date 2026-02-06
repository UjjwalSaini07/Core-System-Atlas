'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search, Zap, Clock, ArrowDown, Keyboard } from 'lucide-react'

export function SearchBar({ onSearch, onAutocomplete, isLoading }) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const inputRef = useRef(null)
  const debounceTimer = useRef(null)

  // Debounce autocomplete
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

  // Handle autocomplete
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      handleAutocomplete(debouncedQuery)
    } else {
      setSuggestions([])
    }
  }, [debouncedQuery])

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearching(true)
    
    // Add to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/search?q=${encodeURIComponent(
          query
        )}&limit=20`
      )
      const result = await response.json()

      if (result.success) {
        onSearch(result.results, result.cacheHit)
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleAutocomplete = async (prefix) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/autocomplete?prefix=${encodeURIComponent(
          prefix
        )}&limit=5`
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

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const firstSuggestion = suggestions[0]
      if (firstSuggestion) {
        setQuery(firstSuggestion)
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">
            Search Files
          </h3>
          <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
            <Keyboard className="w-3 h-3" />
            <span>Ctrl+K to focus</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Input
                ref={inputRef}
                placeholder="Search indexed files..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 pr-20"
                disabled={searching || isLoading}
              />
              {/* Character count */}
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                {query.length}/100
              </span>
            </div>

            <Button
              onClick={handleSearch}
              disabled={searching || isLoading || !query.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              {searching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Suggestions Dropdown */}
          {(showSuggestions && suggestions.length > 0) && (
            <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-slate-700/50 border-b border-slate-600 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Suggestions
                </span>
                <span className="text-xs text-slate-500">
                  Press ↓ to select
                </span>
              </div>
              {suggestions.map((suggestion, idx) => (
                <button
                  key={suggestion}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                    idx === 0 ? 'bg-slate-700/50' : ''
                  }`}
                >
                  <Search className="w-3 h-3 text-slate-500" />
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !showSuggestions && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Recent Searches
                </span>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-slate-500 hover:text-slate-300"
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
                    className="text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Tips */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Search Tips:</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded">
              Use quotes for exact match: "search term"
            </span>
            <span className="text-xs px-2 py-1 bg-slate-700/50 text-slate-400 rounded">
              AND, OR, NOT supported
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
