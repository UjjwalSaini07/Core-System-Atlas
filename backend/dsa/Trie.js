// Trie (Prefix Tree) Implementation
class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
    this.frequency = 0;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.stats = {
      insertions: 0,
      searches: 0,
      operations: []
    };
  }

  insert(word) {
    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }

    if (!node.isWord) {
      node.isWord = true;
      this.stats.insertions++;
    }
    node.frequency++;

    this.stats.operations.push({
      type: 'insert',
      word: lowerWord,
      timestamp: Date.now()
    });
  }

  // Autocomplete search: returns top K results by frequency
  autocomplete(prefix, limit = 10) {
    let node = this.root;
    const lowerPrefix = prefix.toLowerCase();

    // Navigate to prefix node
    for (const char of lowerPrefix) {
      if (!node.children[char]) {
        this.stats.searches++;
        this.stats.operations.push({
          type: 'autocomplete',
          prefix: lowerPrefix,
          results: [],
          timestamp: Date.now()
        });
        return [];
      }
      node = node.children[char];
    }

    // DFS to find all words with this prefix
    const results = [];
    this._dfs(node, lowerPrefix, results);

    // Sort by frequency (descending) and limit
    const topResults = results
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit)
      .map(r => r.word);

    this.stats.searches++;
    this.stats.operations.push({
      type: 'autocomplete',
      prefix: lowerPrefix,
      results: topResults,
      timestamp: Date.now()
    });

    return topResults;
  }

  _dfs(node, currentWord, results) {
    if (node.isWord) {
      results.push({
        word: currentWord,
        frequency: node.frequency
      });
    }

    for (const char in node.children) {
      this._dfs(node.children[char], currentWord + char, results);
    }
  }

  search(word) {
    let node = this.root;
    const lowerWord = word.toLowerCase();

    for (const char of lowerWord) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }

    return node.isWord;
  }

  getStats() {
    return {
      ...this.stats,
      operations: this.stats.operations.slice(-30)
    };
  }

  clear() {
    this.root = new TrieNode();
    this.stats = {
      insertions: 0,
      searches: 0,
      operations: []
    };
  }
}

module.exports = Trie;
