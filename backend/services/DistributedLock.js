/**
 * Distributed Lock Implementation
 * Real-world: Distributed transactions, resource coordination, leader election
*/
const { v4: uuidv4 } = require('crypto');

// Simple in-memory distributed lock (simulates Redis-based lock)
class DistributedLock {
  constructor(options = {}) {
    this.ttl = options.ttl || 30000; // Lock TTL in ms
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 100;
    
    this.locks = new Map(); // lockName -> { token, expiry, metadata }
    this.waitQueues = new Map(); // lockName -> [resolve functions]
    this.stats = {
      acquired: 0,
      released: 0,
      timeouts: 0,
      deadlocks: 0,
      operations: []
    };
  }

  // Acquire lock with optional timeout
  async acquire(lockName, ttl = null, metadata = {}) {
    const lockId = uuidv4();
    const lockTTL = ttl || this.ttl;
    const now = Date.now();
    const expiry = now + lockTTL;

    // Check if lock exists and is still valid
    const existingLock = this.locks.get(lockName);

    if (!existingLock || existingLock.expiry < now) {
      // Acquire the lock
      this.locks.set(lockName, {
        token: lockId,
        expiry,
        metadata: { ...metadata, acquiredAt: now },
        holder: lockId
      });

      this.stats.acquired++;
      this._log('acquired', { lockName, token: lockId, ttl: lockTTL });

      return {
        success: true,
        token: lockId,
        lockName,
        expiry,
        message: 'Lock acquired successfully'
      };
    }

    // Lock is held by someone else
    // Try to acquire with retry
    for (let i = 0; i < this.maxRetries; i++) {
      await this._delay(this.retryDelay);
      const result = await this.acquire(lockName, ttl, metadata);
      if (result.success) return result;
    }

    this.stats.deadlocks++;
    return {
      success: false,
      message: 'Could not acquire lock after retries',
      holder: existingLock.holder
    };
  }

  // Release lock (only if we own it)
  async release(lockName, token) {
    const existingLock = this.locks.get(lockName);

    if (!existingLock) {
      this._log('release', { lockName, result: 'no_lock_exists' });
      return { success: false, message: 'Lock does not exist' };
    }

    if (existingLock.token !== token) {
      this._log('release', { lockName, result: 'invalid_token' });
      return { success: false, message: 'Invalid token - you do not own this lock' };
    }

    this.locks.delete(lockName);
    this.stats.released++;
    this._log('released', { lockName, token });

    // Notify waiting processes
    this._notifyWaiters(lockName);

    return { success: true, message: 'Lock released successfully' };
  }

  // Extend lock TTL (if we own it)
  async extend(lockName, token, additionalTTL = null) {
    const existingLock = this.locks.get(lockName);

    if (!existingLock) {
      return { success: false, message: 'Lock does not exist' };
    }

    if (existingLock.token !== token) {
      return { success: false, message: 'Invalid token' };
    }

    const now = Date.now();
    const extension = additionalTTL || this.ttl;
    existingLock.expiry = now + extension;

    this._log('extended', { lockName, newExpiry: existingLock.expiry });

    return {
      success: true,
      newExpiry: existingLock.expiry,
      message: 'Lock extended successfully'
    };
  }

  // Try to acquire lock with timeout
  async tryAcquire(lockName, timeout, ttl = null) {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const result = await this.acquire(lockName, ttl);
      if (result.success) return result;
      await this._delay(this.retryDelay);
    }

    return {
      success: false,
      message: 'Timeout waiting for lock',
      waited: timeout
    };
  }

  // Execute action with lock (auto acquire/release)
  async withLock(lockName, action, ttl = null) {
    const lock = await this.acquire(lockName, ttl);

    if (!lock.success) {
      throw new LockAcquisitionError(lock.message);
    }

    try {
      const result = await action();
      return result;
    } finally {
      await this.release(lockName, lock.token);
    }
  }

  // Cleanup expired locks
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [name, lock] of this.locks) {
      if (lock.expiry < now) {
        this.locks.delete(name);
        cleaned++;
        this.stats.timeouts++;
      }
    }

    this._log('cleanup', { cleanedLocks: cleaned });
    return cleaned;
  }

  // Get lock info
  getLockInfo(lockName) {
    const lock = this.locks.get(lockName);
    
    if (!lock) {
      return { exists: false };
    }

    const now = Date.now();
    return {
      exists: true,
      ...lock,
      remaining: Math.max(0, lock.expiry - now)
    };
  }

  // Get all locks
  getAllLocks() {
    const locks = [];
    const now = Date.now();

    for (const [name, lock] of this.locks) {
      locks.push({
        name,
        ...lock,
        remaining: Math.max(0, lock.expiry - now)
      });
    }

    return locks;
  }

  _notifyWaiters(lockName) {
    const queue = this.waitQueues.get(lockName) || [];
    this.waitQueues.set(lockName, []);
    
    for (const resolve of queue) {
      resolve();
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _log(type, details) {
    this.stats.operations.push({
      type,
      ...details,
      timestamp: Date.now()
    });
  }

  getStats() {
    return {
      ...this.stats,
      activeLocks: this.locks.size,
      operations: this.stats.operations.slice(-30)
    };
  }

  reset() {
    this.locks.clear();
    this.waitQueues.clear();
    this.stats = {
      acquired: 0,
      released: 0,
      timeouts: 0,
      deadlocks: 0,
      operations: []
    };
  }
}

// Redlock algorithm (multi-node distributed lock)
class Redlock {
  constructor(options = {}) {
    this.servers = options.servers || []; // Array of lock servers
    this.quorum = options.quorum || Math.floor(options.servers?.length / 2) + 1 || 1;
    this.ttl = options.ttl || 30000;
    this.retryCount = options.retryCount || 3;
    this.retryDelay = options.retryDelay || 200;
    
    this.locks = new Map(); // resource -> server -> lock
    this.stats = { acquired: 0, released: 0, failed: 0 };
  }

  async acquire(resource, ttl = null) {
    const lockTTL = ttl || this.ttl;
    const lockId = uuidv4();
    const results = [];

    // Try to acquire on majority of servers
    for (const server of this.servers) {
      if (results.length >= this.quorum) break;
      
      try {
        const result = await this._acquireOnServer(server, resource, lockId, lockTTL);
        results.push({ server, success: result });
      } catch (error) {
        results.push({ server, success: false, error: error.message });
      }
    }

    const successCount = results.filter(r => r.success).length;

    if (successCount >= this.quorum) {
      this.stats.acquired++;
      return {
        success: true,
        lockId,
        resource,
        servers: results.filter(r => r.success).map(r => r.server),
        expiry: Date.now() + lockTTL
      };
    }

    // Release all acquired locks
    await this.releaseAll(resource, lockId);
    this.stats.failed++;

    return {
      success: false,
      message: `Only ${successCount}/${this.quorum} locks acquired`
    };
  }

  async release(resource, lockId) {
    return this.releaseAll(resource, lockId);
  }

  async releaseAll(resource, lockId) {
    const results = [];

    for (const server of this.servers) {
      try {
        const result = await this._releaseOnServer(server, resource, lockId);
        results.push({ server, success: result });
      } catch (error) {
        results.push({ server, success: false, error: error.message });
      }
    }

    return results;
  }

  async _acquireOnServer(server, resource, lockId, ttl) {
    // Simulate acquiring lock on server
    // In real implementation, this would use Redis SET NX PX
    const key = `lock:${resource}`;
    return { success: true, server, key, lockId, ttl };
  }

  async _releaseOnServer(server, resource, lockId) {
    // Simulate releasing lock on server
    return { success: true, server, resource };
  }

  getStats() {
    return {
      ...this.stats,
      servers: this.servers.length,
      quorum: this.quorum
    };
  }
}

// Leader Election using locks
class LeaderElection {
  constructor(lockName) {
    this.lockName = lockName;
    this.distributedLock = new DistributedLock();
    this.isLeader = false;
    this.leaderId = null;
    this.heartbeatInterval = null;
    this.stats = { elections: 0, leadershipChanges: 0 };
  }

  async electLeader(leaderId, ttl = 10000) {
    const lock = await this.distributedLock.acquire(this.lockName, ttl, { leaderId });

    if (lock.success) {
      const wasLeader = this.isLeader;
      this.isLeader = true;
      this.leaderId = leaderId;
      this.stats.elections++;
      
      if (!wasLeader) {
        this.stats.leadershipChanges++;
        this._startHeartbeat(lock.token);
      }

      return { elected: true, leaderId };
    }

    this.isLeader = false;
    return { elected: false, leaderId };
  }

  async resign(leaderId) {
    if (this.leaderId !== leaderId) {
      return { success: false, message: 'Not the current leader' };
    }

    this.isLeader = false;
    this._stopHeartbeat();
    
    await this.distributedLock.release(this.lockName);
    this.leaderId = null;

    return { success: true };
  }

  _startHeartbeat(token) {
    // Start heartbeat to maintain leadership
    this.heartbeatInterval = setInterval(async () => {
      await this.distributedLock.extend(this.lockName, token);
    }, 5000);
  }

  _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  getLeaderInfo() {
    const lockInfo = this.distributedLock.getLockInfo(this.lockName);
    return {
      lockName: this.lockName,
      isLeader: this.isLeader,
      leaderId: this.leaderId,
      lockInfo,
      ...this.stats
    };
  }
}

class LockAcquisitionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'LockAcquisitionError';
  }
}

module.exports = {
  DistributedLock,
  Redlock,
  LeaderElection,
  LockAcquisitionError
};
