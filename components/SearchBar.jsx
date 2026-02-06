'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search, Zap } from 'lucide-react'

export function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const handleSearch = async () => {
    if (!query.trim()) return

    setSearching(true)
    try {
      const response = await fetch(
        `http://localhost:3001/api/search?q=${encodeURIComponent(
          query
        )}&limit=20`
      )
      const result = await response.json()

      if (result.success) {
        onSearch(result.results, result.cacheHit)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
      setSuggestions([])
    }
  }

  const handleAutocomplete = async (prefix) => {
    if (prefix.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/autocomplete?prefix=${encodeURIComponent(
          prefix
        )}&limit=5`
      )
      const result = await response.json()

      if (result.success) {
        setSuggestions(result.suggestions)
      }
    } catch (error) {
      console.error('Autocomplete failed:', error)
    }
  }

  const handleInputChange = (value) => {
    setQuery(value)
    handleAutocomplete(value)
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">
            Search Files
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search indexed files..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && handleSearch()
              }
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              disabled={searching || isLoading}
            />

            <Button
              onClick={handleSearch}
              disabled={searching || isLoading || !query.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>

          {suggestions.length > 0 && (
            <div className="bg-slate-800 border border-slate-600 rounded-lg p-2 space-y-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion)
                    setSuggestions([])
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
