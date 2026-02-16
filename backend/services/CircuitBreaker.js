// Circuit Breaker Implementation
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Circuit Breaker States
const STATE = {
  CLOSED: 'CLOSED', // Normal operation
  OPEN: 'OPEN', // Blocking requests
  HALF_OPEN: 'HALF_OPEN' // Testing if service recovered
};

// Circuit Breaker Events
const EVENT = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  TIMEOUT: 'TIMEOUT',
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  HALF_OPEN: 'HALF_OPEN'
};

class CircuitBreaker {
  constructor(options = {}) {
    this.name = options.name || generateUUID();
    this.failureThreshold = options.failureThreshold || 5; // Open after N failures
    this.successThreshold = options.successThreshold || 2; // Close after N successes (half-open)
    this.timeout = options.timeout || 30000; // Time before half-open (ms)
    this.monitoredErrors = options.monitoredErrors || [Error];

    this.state = STATE.CLOSED;
    this.failures = 0;
    this.successes = 0;
    this.lastFailure = null;
    this.nextAttempt = null;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      rejectedRequests: 0,
      stateTransitions: [],
      operations: []
    };

    this._stateTransition(STATE.CLOSED, 'initial');
  }

  // Execute function with circuit breaker protection
  async execute(fn) {
    this.stats.totalRequests++;

    if (this.state === STATE.OPEN) {
      if (Date.now() >= this.nextAttempt) {
        this._stateTransition(STATE.HALF_OPEN, 'timeout_expired');
      } else {
        this.stats.rejectedRequests++;
        this._log('rejected', { reason: 'circuit_open', nextAttempt: this.nextAttempt });
        throw new CircuitOpenError(`Circuit breaker is open. Retry after ${this.nextAttempt}`);
      }
    }

    try {
      const result = await Promise.resolve(fn());
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure(error);
      throw error;
    }
  }

  _onSuccess() {
    this.stats.successfulRequests++;

    if (this.state === STATE.HALF_OPEN) {
      this.successes++;
      if (this.successes >= this.successThreshold) {
        this._stateTransition(STATE.CLOSED, 'recovered');
        this._resetCounters();
      }
    } else {
      this.failures = 0;
    }

    this._log('success', { state: this.state, failures: this.failures });
  }

  _onFailure(error) {
    this.stats.failedRequests++;
    this.lastFailure = Date.now();

    // Check if error should be monitored
    const isMonitored = this.monitoredErrors.some(
      errorType => error instanceof errorType
    );

    if (isMonitored) {
      this.failures++;

      if (this.state === STATE.CLOSED && this.failures >= this.failureThreshold) {
        this._stateTransition(STATE.OPEN, 'threshold_reached');
        this.nextAttempt = Date.now() + this.timeout;
      } else if (this.state === STATE.HALF_OPEN) {
        this._stateTransition(STATE.OPEN, 'half_open_failure');
        this.nextAttempt = Date.now() + this.timeout;
      }
    }

    this._log('failure', { error: error.message, failures: this.failures, isMonitored });
  }

  _stateTransition(newState, reason) {
    const oldState = this.state;
    this.state = newState;
    
    this.stats.stateTransitions.push({
      from: oldState,
      to: newState,
      reason,
      timestamp: Date.now()
    });

    this._log('state_transition', { from: oldState, to: newState, reason });
  }

  _resetCounters() {
    this.failures = 0;
    this.successes = 0;
    this.lastFailure = null;
  }

  _log(type, details) {
    this.stats.operations.push({
      type,
      ...details,
      timestamp: Date.now()
    });
  }

  // Manual controls
  open() {
    this._stateTransition(STATE.OPEN, 'manual');
    this.nextAttempt = Date.now() + this.timeout;
  }

  close() {
    this._stateTransition(STATE.CLOSED, 'manual');
    this._resetCounters();
  }

  forceHalfOpen() {
    this._stateTransition(STATE.HALF_OPEN, 'manual');
  }

  getState() {
    return {
      name: this.name,
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      failureThreshold: this.failureThreshold,
      successThreshold: this.successThreshold,
      nextAttempt: this.nextAttempt,
      lastFailure: this.lastFailure,
      timeUntilNextAttempt: this.state === STATE.OPEN 
        ? Math.max(0, this.nextAttempt - Date.now()) 
        : null,
      ...this.stats
    };
  }

  getStats() {
    return this.getState();
  }

  reset() {
    this.state = STATE.CLOSED;
    this._resetCounters();
    this.nextAttempt = null;
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      rejectedRequests: 0,
      stateTransitions: [],
      operations: []
    };
    this._stateTransition(STATE.CLOSED, 'reset');
  }
}

// Custom Error Classes
class CircuitOpenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CircuitOpenError';
  }
}

class CircuitBreakerTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CircuitBreakerTimeoutError';
  }
}

// Bulkhead Circuit Breaker (with resource isolation)
class BulkheadCircuitBreaker {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 10;
    this.maxQueue = options.maxQueue || 100;
    this.circuitBreaker = new CircuitBreaker(options.circuitBreaker);
    
    this.semaphore = {
      available: this.maxConcurrent,
      waitQueue: []
    };
    
    this.queue = [];
    this.stats = {
      totalExecuted: 0,
      totalQueued: 0,
      rejected: 0,
      timeouts: 0
    };
  }

  async execute(fn, timeout = 5000) {
    // Check circuit breaker
    if (this.circuitBreaker.state === STATE.OPEN) {
      throw new CircuitOpenError('Circuit breaker is open');
    }

    // Try to acquire semaphore
    if (this.semaphore.available > 0) {
      this.semaphore.available--;
      return this._executeWithSemaphore(fn);
    }

    // Try queue
    if (this.queue.length < this.maxQueue) {
      this.stats.totalQueued++;
      return new Promise((resolve, reject) => {
        this.queue.push({ fn, timeout, resolve, reject });
      });
    }

    this.stats.rejected++;
    throw new BulkheadRejectedError('Bulkhead capacity exceeded');
  }

  async _executeWithSemaphore(fn) {
    this.stats.totalExecuted++;
    
    try {
      this.semaphore.available--;
      const result = await this.circuitBreaker.execute(fn);
      return result;
    } finally {
      this._releaseSemaphore();
    }
  }

  _releaseSemaphore() {
    this.semaphore.available++;

    // Process queue
    if (this.queue.length > 0) {
      const { fn, timeout, resolve, reject } = this.queue.shift();
      
      // Set timeout for queued execution
      const timeoutId = setTimeout(() => {
        this.stats.timeouts++;
        reject(new CircuitBreakerTimeoutError('Execution timeout'));
      }, timeout);

      this._executeWithSemaphore(fn).then(result => {
        clearTimeout(timeoutId);
        resolve(result);
      }).catch(error => {
        clearTimeout(timeoutId);
        reject(error);
      });
    }
  }

  getState() {
    return {
      ...this.circuitBreaker.getState(),
      bulkhead: {
        available: this.semaphore.available,
        maxConcurrent: this.maxConcurrent,
        queueSize: this.queue.length,
        maxQueue: this.maxQueue
      },
      ...this.stats
    };
  }
}

class BulkheadRejectedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BulkheadRejectedError';
  }
}

// Circuit Breaker Registry for managing multiple services
class CircuitBreakerRegistry {
  constructor() {
    this.breakers = new Map();
    this.defaultConfig = {};
  }

  register(name, config = {}) {
    const breaker = new CircuitBreaker({ ...this.defaultConfig, ...config, name });
    this.breakers.set(name, breaker);
    return breaker;
  }

  get(name) {
    return this.breakers.get(name) || this.register(name);
  }

  execute(name, fn) {
    return this.get(name).execute(fn);
  }

  getAllStats() {
    const stats = {};
    for (const [name, breaker] of this.breakers) {
      stats[name] = breaker.getState();
    }
    return stats;
  }

  resetAll() {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }
}

module.exports = {
  CircuitBreaker,
  CircuitOpenError,
  CircuitBreakerTimeoutError,
  BulkheadCircuitBreaker,
  BulkheadRejectedError,
  CircuitBreakerRegistry,
  STATE,
  EVENT
};
