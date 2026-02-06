/**
 * Inverted Index Implementation
 * Core data structure for full-text search engines
 * Maps words to documents/files containing them
 */

class InvertedIndex {
  constructor() {
    this.index = new Map(); // word -> Set of document IDs
    this.documents = new Map(); // documentId -> document metadata
    this.wordFrequency = new Map(); // documentId -> word frequency map
    this.stats = {
      indexedDocuments: 0,
      totalWords: 0,
      operations: []
    };
  }

  /**
   * Index a document: extract words and build index
   */
  indexDocument(docId, content, metadata = {}) {
    if (this.documents.has(docId)) {
      this._removeDocument(docId);
    }

    const words = this._tokenize(content);
    const uniqueWords = new Set();
    const wordFreq = new Map();

    // Count word frequencies
    for (const word of words) {
      uniqueWords.add(word);
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }

    // Add to inverted index
    for (const word of uniqueWords) {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word).add(docId);
    }

    this.documents.set(docId, {
      id: docId,
      content,
      metadata,
      wordCount: words.length,
      uniqueWordCount: uniqueWords.size,
      indexedAt: Date.now()
    });

    this.wordFrequency.set(docId, wordFreq);
    this.stats.indexedDocuments++;
    this.stats.totalWords += uniqueWords.size;

    this.stats.operations.push({
      type: 'index',
      docId,
      wordCount: uniqueWords.size,
      timestamp: Date.now()
    });
  }

  /**
   * Search: find documents matching query
   * Returns results ranked by TF-IDF score
   */
  search(query, limit = 20) {
    const queryWords = this._tokenize(query);
    const docScores = new Map();

    // Calculate TF-IDF scores
    for (const word of queryWords) {
      if (!this.index.has(word)) continue;

      const docIds = this.index.get(word);
      const idf = Math.log(this.documents.size / (docIds.size + 1));

      for (const docId of docIds) {
        const tf = this.wordFrequency.get(docId)?.get(word) || 0;
        const score = tf * idf;
        docScores.set(docId, (docScores.get(docId) || 0) + score);
      }
    }

    // Sort by score and return top K
    const results = Array.from(docScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([docId, score]) => ({
        id: docId,
        score: score.toFixed(4),
        ...this.documents.get(docId)
      }));

    this.stats.operations.push({
      type: 'search',
      query,
      resultCount: results.length,
      timestamp: Date.now()
    });

    return results;
  }

  /**
   * Boolean search: AND/OR/NOT operations
   */
  booleanSearch(query) {
    // Simple parser for "word1 AND word2 OR word3 NOT word4"
    const tokens = query.toLowerCase().split(/\s+/);
    let results = null;

    let i = 0;
    while (i < tokens.length) {
      const word = tokens[i];
      const NOT = i > 0 && tokens[i - 1] === 'not';
      
      let docSet = this.index.has(word) ? new Set(this.index.get(word)) : new Set();
      
      if (NOT) {
        const allDocs = new Set(this.documents.keys());
        docSet = new Set([...allDocs].filter(d => !docSet.has(d)));
      }

      if (results === null) {
        results = docSet;
      } else {
        const operator = tokens[i - 1];
        if (operator === 'and') {
          results = new Set([...results].filter(d => docSet.has(d)));
        } else if (operator === 'or') {
          results = new Set([...results, ...docSet]);
        }
      }

      i++;
    }

    const resultDocs = Array.from(results || [])
      .map(docId => ({
        id: docId,
        ...this.documents.get(docId)
      }));

    return resultDocs;
  }

  _removeDocument(docId) {
    if (!this.documents.has(docId)) return;

    const wordFreq = this.wordFrequency.get(docId) || new Map();
    
    for (const word of wordFreq.keys()) {
      if (this.index.has(word)) {
        this.index.get(word).delete(docId);
        if (this.index.get(word).size === 0) {
          this.index.delete(word);
        }
      }
    }

    this.documents.delete(docId);
    this.wordFrequency.delete(docId);
  }

  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  getStats() {
    return {
      ...this.stats,
      operations: this.stats.operations.slice(-30),
      indexSize: this.index.size
    };
  }

  clear() {
    this.index.clear();
    this.documents.clear();
    this.wordFrequency.clear();
    this.stats = {
      indexedDocuments: 0,
      totalWords: 0,
      operations: []
    };
  }
}

module.exports = InvertedIndex;
