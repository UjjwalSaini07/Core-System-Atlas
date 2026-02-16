/**
 * Rate Limiter Implementations
 * Real-world: API protection, DDoS prevention, traffic shaping
*/

const { v4: uuidv4 } = require('crypto');

// Author: UjjwalS, AuthorUrl: https://ujjwalsaini.vercel.app/
// Token Bucket Rate Limiter
class TokenBucket {
  constructor(options = {}) {
    this.capacity = options.capacity || 100; // Max tokens
    this.refillRate = options.refillRate || 10; // Tokens per second
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    this.stats = {
      allowed: 0,
      denied: 0,
      operations: []
    };
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }

  // Try to consume tokens
  tryConsume(tokens = 1) {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      this.stats.allowed++;
      this.stats.operations.push({
        type: 'allowed',
        tokens,
        remaining: this.tokens,
        timestamp: Date.now()
      });
      return true;
    }

    this.stats.denied++;
    this.stats.operations.push({
      type: 'denied',
      tokens,
      remaining: this.tokens,
      timestamp: Date.now()
    });
    return false;
  }

  // Get current state
  getState() {
    this.refill();
    return {
      tokens: this.tokens,
      capacity: this.capacity,
      refillRate: this.refillRate,
      ...this.stats
    };
  }

  // Reset
  reset() {
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
    this.stats = { allowed: 0, denied: 0, operations: [] };
  }
}

// Leaky Bucket Rate Limiter
class LeakyBucket {
  constructor(options = {}) {
    this.capacity = options.capacity || 100; // Bucket size
    this.rate = options.rate || 10; // Leak rate per second
    this.queue = [];
    this.lastLeak = Date.now();
    this.stats = {
      accepted: 0,
      dropped: 0,
      operations: []
    };
  }

  leak() {
    const now = Date.now();
    const elapsed = (now - this.lastLeak) / 1000;
    const leakedCount = Math.floor(elapsed * this.rate);
    
    if (leakedCount > 0) {
      this.queue.splice(0, leakedCount);
      this.lastLeak = now;
    }
  }

  tryAdd(item) {
    this.leak();

    if (this.queue.length < this.capacity) {
      this.queue.push(item);
      this.stats.accepted++;
      this.stats.operations.push({
        type: 'accepted',
        queueLength: this.queue.length,
        timestamp: Date.now()
      });
      return true;
    }

    this.stats.dropped++;
    this.stats.operations.push({
      type: 'dropped',
      queueLength: this.queue.length,
      timestamp: Date.now()
    });
    return false;
  }

  getState() {
    this.leak();
    return {
      queueLength: this.queue.length,
      capacity: this.capacity,
      rate: this.rate,
      ...this.stats
    };
  }

  reset() {
    this.queue = [];
    this.lastLeak = Date.now();
    this.stats = { accepted: 0, dropped: 0, operations: [] };
  }
}

// Sliding Window Rate Limiter
class SlidingWindow {
  constructor(options = {}) {
    this.windowSize = options.windowSize || 60000; // 1 minute in ms
    this.maxRequests = options.maxRequests || 100;
    this.requests = []; // Timestamps
    this.stats = {
      allowed: 0,
      denied: 0,
      operations: []
    };
  }

  tryRequest() {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    // Remove old requests outside window
    this.requests = this.requests.filter(t => t > windowStart);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      this.stats.allowed++;
      this.stats.operations.push({
        type: 'allowed',
        count: this.requests.length,
        timestamp: now
      });
      return true;
    }

    this.stats.denied++;
    this.stats.operations.push({
      type: 'denied',
      count: this.requests.length,
      timestamp: now
    });
    return false;
  }

  getRemaining() {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    this.requests = this.requests.filter(t => t > windowStart);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  getResetTime() {
    if (this.requests.length === 0) return 0;
    return this.requests[0] + this.windowSize - Date.now();
  }

  getState() {
    return {
      remaining: this.getRemaining(),
      limit: this.maxRequests,
      windowSize: this.windowSize,
      ...this.stats
    };
  }

  reset() {
    this.requests = [];
    this.stats = { allowed: 0, denied: 0, operations: [] };
  }
}

// Fixed Window Rate Limiter
class FixedWindow {
  constructor(options = {}) {
    this.windowSize = options.windowSize || 60000;
    this.maxRequests = options.maxRequests || 100;
    this.windows = new Map(); // windowKey -> count
    this.stats = { allowed: 0, denied: 0, operations: [] };
  }

  tryRequest(key = 'global') {
    const now = Date.now();
    const windowKey = Math.floor(now / this.windowSize);

    const currentCount = this.windows.get(key) || 0;

    if (currentCount < this.maxRequests) {
      this.windows.set(key, currentCount + 1);
      this.stats.allowed++;
      this.stats.operations.push({
        type: 'allowed',
        key,
        count: currentCount + 1,
        timestamp: now
      });
      return true;
    }

    this.stats.denied++;
    this.stats.operations.push({
      type: 'denied',
      key,
      count: currentCount,
      timestamp: now
    });
    return false;
  }

  getState(key = 'global') {
    const now = Date.now();
    const windowKey = Math.floor(now / this.windowSize);
    const count = this.windows.get(key) || 0;
    const remaining = Math.max(0, this.maxRequests - count);
    const resetTime = (windowKey + 1) * this.windowSize;

    return {
      remaining,
      limit: this.maxRequests,
      resetTime,
      ...this.stats
    };
  }

  reset() {
    this.windows.clear();
    this.stats = { allowed: 0, denied: 0, operations: [] };
  }
}

// Distributed Rate Limiter using Redis-like storage
class DistributedRateLimiter {
  constructor(options = {}) {
    this.storage = new Map(); // Simulated Redis
    this.rateLimiters = new Map(); // identifier -> limiter
    this.defaultConfig = options;
    this.stats = {
      requests: 0,
      allowed: 0,
      denied: 0
    };
  }

  // Lua script equivalent for atomic operations
  async executeScript(script, key, args) {
    // In real implementation, this would be a Lua script sent to Redis
    return this.rateLimiters.get(key)?.tryConsume?.(args[0]) || false;
  }

  async rateLimit(key, config = {}) {
    this.stats.requests++;
    const rateConfig = { ...this.defaultConfig, ...config };
    
    if (!this.rateLimiters.has(key)) {
      this.rateLimiters.set(key, new TokenBucket(rateConfig));
    }

    const allowed = this.rateLimiters.get(key).tryConsume();

    if (allowed) {
      this.stats.allowed++;
    } else {
      this.stats.denied++;
    }

    return {
      allowed,
      limiter: this.rateLimiters.get(key).getState(),
      retryAfter: allowed ? 0 : Math.ceil((1 - this.rateLimiters.get(key).tokens) / this.rateLimiters.get(key).refillRate * 1000)
    };
  }

  // Sliding window log for distributed systems
  async slidingWindowLog(key, windowMs, maxRequests) {
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!this.storage.has(key)) {
      this.storage.set(key, []);
    }

    const timestamps = this.storage.get(key);
    const validTimestamps = timestamps.filter(t => t > windowStart);
    
    if (validTimestamps.length < maxRequests) {
      validTimestamps.push(now);
      this.storage.set(key, validTimestamps);
      return { allowed: true, remaining: maxRequests - validTimestamps.length };
    }

    return { 
      allowed: false, 
      remaining: 0,
      retryAfter: validTimestamps[0] + windowMs - now
    };
  }

  getStats() {
    return {
      ...this.stats,
      activeLimiters: this.rateLimiters.size
    };
  }

  reset() {
    this.storage.clear();
    this.rateLimiters.clear();
    this.stats = { requests: 0, allowed: 0, denied: 0 };
  }
}

module.exports = { 
  TokenBucket, 
  LeakyBucket, 
  SlidingWindow, 
  FixedWindow,
  DistributedRateLimiter 
};
