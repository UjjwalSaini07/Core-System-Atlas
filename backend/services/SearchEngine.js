// Search Engine Service Integrates Inverted Index, Trie, and LRU Cache for optimized search
const InvertedIndex = require('../dsa/InvertedIndex');
const Trie = require('../dsa/Trie');
const LRUCache = require('../dsa/LRUCache');

class SearchEngine {
  constructor(cacheCapacity = 100) {
    this.index = new InvertedIndex();
    this.trie = new Trie();
    this.cache = new LRUCache(cacheCapacity);
    this.stats = {
      searches: 0,
      autocompletes: 0,
      cacheHits: 0,
      cacheMisses: 0,
      operations: []
    };
  }

  // Index a file for search
  indexFile(fileId, filename, content) {
    // Add to inverted index
    this.index.indexDocument(fileId, content, {
      filename,
      fileId
    });

    // Add words to trie for autocomplete
    const words = this._tokenize(content);
    for (const word of new Set(words)) {
      this.trie.insert(word);
    }

    // Invalidate related cache entries
    this._invalidateCachePrefix(content.substring(0, 3));

    this.stats.operations.push({
      type: 'indexFile',
      fileId,
      filename,
      timestamp: Date.now()
    });
  }

  // Full-text search with caching
  search(query, limit = 20) {
    const cacheKey = `search:${query}:${limit}`;
    
    // Check cache first (cache-aside pattern)
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      this.stats.operations.push({
        type: 'search',
        query,
        cached: true,
        resultCount: cached.length,
        timestamp: Date.now()
      });
      return {
        results: cached,
        cacheHit: true
      };
    }

    // Cache miss - perform search
    this.stats.cacheMisses++;
    const results = this.index.search(query, limit);
    
    // Store in cache
    this.cache.put(cacheKey, results);

    this.stats.searches++;
    this.stats.operations.push({
      type: 'search',
      query,
      cached: false,
      resultCount: results.length,
      timestamp: Date.now()
    });

    return {
      results,
      cacheHit: false
    };
  }

  // Autocomplete with suggestions
  autocomplete(prefix, limit = 10) {
    const cacheKey = `autocomplete:${prefix}:${limit}`;
    
    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      return {
        suggestions: cached,
        cacheHit: true
      };
    }

    // Get suggestions from trie
    const suggestions = this.trie.autocomplete(prefix, limit);
    this.cache.put(cacheKey, suggestions);

    this.stats.autocompletes++;
    this.stats.cacheMisses++;

    return {
      suggestions,
      cacheHit: false
    };
  }

  // Boolean search: AND/OR/NOT
  booleanSearch(query) {
    const cacheKey = `boolean:${query}`;
    
    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.stats.cacheHits++;
      return {
        results: cached,
        cacheHit: true
      };
    }

    const results = this.index.booleanSearch(query);
    this.cache.put(cacheKey, results);

    this.stats.cacheMisses++;

    return {
      results,
      cacheHit: false
    };
  }

  // Get comprehensive stats about search system
  getStats() {
    const cacheStats = this.cache.getStats();
    const indexStats = this.index.getStats();
    const trieStats = this.trie.getStats();

    return {
      searchEngine: {
        ...this.stats,
        operations: this.stats.operations.slice(-50),
        hitRate: this.stats.cacheHits + this.stats.cacheMisses > 0
          ? ((this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses)) * 100).toFixed(2)
          : 0
      },
      cache: cacheStats,
      index: indexStats,
      trie: trieStats
    };
  }

  // Get detailed system state for visualization
  getSystemState() {
    const stats = this.getStats();
    
    return {
      cacheState: {
        size: stats.cache.size,
        capacity: stats.cache.capacity,
        hitRate: stats.cache.hitRate,
        operations: stats.cache.operations
      },
      indexState: {
        indexedDocuments: stats.index.indexedDocuments,
        indexSize: stats.index.indexSize,
        totalWords: stats.index.totalWords,
        operations: stats.index.operations
      },
      trieState: {
        searches: stats.trie.searches,
        insertions: stats.trie.insertions,
        operations: stats.trie.operations
      },
      searchEngine: stats.searchEngine
    };
  }

  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  _invalidateCachePrefix(prefix) {
    // Simple cache invalidation for related searches
  }

  clear() {
    this.index.clear();
    this.trie.clear();
    this.cache.clear();
    this.stats = {
      searches: 0,
      autocompletes: 0,
      cacheHits: 0,
      cacheMisses: 0,
      operations: []
    };
  }
}

module.exports = SearchEngine;
