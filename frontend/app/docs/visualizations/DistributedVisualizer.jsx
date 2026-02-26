'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Check, X, Lock, Unlock, RefreshCw, Zap, Shield, Database, Network, Globe, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// ==================== RATE LIMITER VISUALIZER ====================
export function RateLimiterVisualizer({ data, step }) {
  const { animationSteps = [] } = data;
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { action = null, highlight = [], showTokens = false } = currentStep;
  
  // Token bucket state simulation
  const tokens = 10;
  const maxTokens = 10;
  
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-200 mb-2">Token Bucket Algorithm</h4>
        <p className="text-sm text-slate-400">Capacity: 10 tokens | Refill Rate: 1/second</p>
      </div>
      
      <div className="flex items-center gap-12">
        {/* Token Bucket */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-slate-400 mb-2">Token Bucket</div>
          <div className={`
            relative w-24 h-40 rounded-b-xl rounded-t-sm border-4 overflow-hidden transition-all duration-500
            ${action === 'deny' ? 'border-red-500 bg-red-900/20' : 'border-slate-600 bg-slate-800'}
          `}>
            {/* Water/Tokens */}
            <div 
              className={`
                absolute bottom-0 left-0 right-0 bg-gradient-to-t from-teal-500 to-teal-400 transition-all duration-500
                ${action === 'deny' ? 'h-0' : 'h-3/4'}
              `}
              style={{ height: action === 'refill' ? '90%' : action === 'consume' ? '60%' : '75%' }}
            >
              {/* Tokens representation */}
              <div className="flex flex-wrap justify-center gap-1 p-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-4 h-4 rounded-full bg-white/80 animate-pulse" />
                ))}
              </div>
            </div>
            
            {/* Overflow indicator */}
            {action === 'refill' && (
              <div className="absolute top-2 right-2">
                <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
              </div>
            )}
          </div>
          
          {/* Token count */}
          <div className={`
            mt-2 px-3 py-1 rounded-full text-sm font-bold
            ${action === 'deny' ? 'bg-red-500 text-white' : 'bg-teal-500 text-white'}
          `}>
            {action === 'deny' ? '0' : action === 'consume' ? '6' : '7'}/10
          </div>
        </div>
        
        {/* Request Arrow */}
        <div className="flex flex-col items-center">
          <ArrowRight className={`w-12 h-12 transition-colors duration-300 ${action === 'deny' ? 'text-red-500' : 'text-teal-500'}`} />
          <span className="text-xs text-slate-400 mt-1">
            {action === 'deny' ? 'DENIED' : action === 'consume' ? 'ALLOWED' : 'IDLE'}
          </span>
        </div>
        
        {/* Request/Response */}
        <div className="flex flex-col items-center">
          <div className={`
            w-20 h-20 rounded-xl border-2 flex items-center justify-center transition-all duration-300
            ${action === 'deny' 
              ? 'border-red-500 bg-red-900/30' 
              : action === 'consume'
                ? 'border-emerald-500 bg-emerald-900/30'
                : 'border-slate-600 bg-slate-800'}
          `}>
            {action === 'deny' ? (
              <X className="w-10 h-10 text-red-500" />
            ) : action === 'consume' ? (
              <Check className="w-10 h-10 text-emerald-500" />
            ) : (
              <Zap className="w-10 h-10 text-slate-500" />
            )}
          </div>
          <span className="text-xs text-slate-400 mt-2">
            {action === 'deny' ? '429 Too Many' : action === 'consume' ? '200 OK' : 'Waiting'}
          </span>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="flex gap-4">
        <div className={`px-4 py-2 rounded-lg ${action === 'refill' ? 'bg-amber-500/20 border border-amber-500' : 'bg-slate-800'}`}>
          <span className="text-xs text-slate-400">Tokens:</span>
          <span className="ml-2 font-bold text-white">{action === 'refill' ? '↑ Refilling' : '7'}</span>
        </div>
        <div className={`px-4 py-2 rounded-lg ${action === 'deny' ? 'bg-red-500/20 border border-red-500' : 'bg-slate-800'}`}>
          <span className="text-xs text-slate-400">Requests:</span>
          <span className="ml-2 font-bold text-white">Waiting</span>
        </div>
      </div>
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== CIRCUIT BREAKER VISUALIZER ====================
export function CircuitBreakerVisualizer({ data, step }) {
  const { animationSteps = [] } = data;
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { showState = false, action = null, highlight = [] } = currentStep;
  
  const states = ['closed', 'halfopen', 'open'];
  const currentState = showState ? highlight[0] : 'closed';
  const failureCount = action === 'fail' ? 1 : action === 'open' ? 5 : 0;
  
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-200 mb-2">Circuit Breaker State Machine</h4>
        <p className="text-sm text-slate-400">Failure Threshold: 5 | Timeout: 30s</p>
      </div>
      
      {/* State Diagram */}
      <div className="flex items-center gap-8">
        {/* CLOSED State */}
        <div className={`
          relative p-6 rounded-xl border-2 transition-all duration-500
          ${currentState === 'closed' 
            ? 'border-emerald-500 bg-emerald-500/10 scale-110' 
            : 'border-slate-600 bg-slate-800'}
        `}>
          <Shield className={`w-16 h-16 mx-auto mb-2 ${currentState === 'closed' ? 'text-emerald-500' : 'text-slate-500'}`} />
          <div className={`text-center font-bold ${currentState === 'closed' ? 'text-emerald-500' : 'text-slate-400'}`}>
            CLOSED
          </div>
          <div className="text-xs text-slate-500 text-center mt-1">Normal Operation</div>
          {currentState === 'closed' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">{failureCount}</span>
            </div>
          )}
        </div>
        
        {/* Arrow to OPEN */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-8 h-8 text-slate-500" />
          <span className="text-xs text-slate-500">failures &gt; 5</span>
        </div>
        
        {/* OPEN State */}
        <div className={`
          relative p-6 rounded-xl border-2 transition-all duration-500
          ${currentState === 'open' 
            ? 'border-red-500 bg-red-500/10 scale-110' 
            : 'border-slate-600 bg-slate-800'}
        `}>
          <X className={`w-16 h-16 mx-auto mb-2 ${currentState === 'open' ? 'text-red-500' : 'text-slate-500'}`} />
          <div className={`text-center font-bold ${currentState === 'open' ? 'text-red-500' : 'text-slate-400'}`}>
            OPEN
          </div>
          <div className="text-xs text-slate-500 text-center mt-1">Fail Fast</div>
          {currentState === 'open' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          )}
        </div>
        
        {/* Arrow to HALF_OPEN */}
        <div className="flex flex-col items-center">
          <ArrowRight className="w-8 h-8 text-slate-500" />
          <span className="text-xs text-slate-500">timeout</span>
        </div>
        
        {/* HALF_OPEN State */}
        <div className={`
          relative p-6 rounded-xl border-2 transition-all duration-500
          ${currentState === 'halfopen' 
            ? 'border-amber-500 bg-amber-500/10 scale-110' 
            : 'border-slate-600 bg-slate-800'}
        `}>
          <RefreshCw className={`w-16 h-16 mx-auto mb-2 ${currentState === 'halfopen' ? 'text-amber-500' : 'text-slate-500'}`} />
          <div className={`text-center font-bold ${currentState === 'halfopen' ? 'text-amber-500' : 'text-slate-400'}`}>
            HALF_OPEN
          </div>
          <div className="text-xs text-slate-500 text-center mt-1">Testing</div>
          {currentState === 'halfopen' && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">?</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Failure Counter */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className={`
              w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold
              ${i < failureCount 
                ? 'bg-red-500 border-red-500 text-white' 
                : 'border-slate-600 text-slate-500'}
            `}
          >
            {i + 1}
          </div>
        ))}
      </div>
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== DISTRIBUTED LOCK VISUALIZER ====================
export function DistributedLockVisualizer({ data, step }) {
  const { animationSteps = [] } = data;
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { action = null, highlight = [], showTTL = false } = currentStep;
  
  const servers = [
    { id: 'A', name: 'Server A', color: 'bg-blue-500' },
    { id: 'B', name: 'Server B', color: 'bg-purple-500' },
    { id: 'C', name: 'Server C', color: 'bg-orange-500' }
  ];
  
  const lockHolder = action === 'acquire' ? highlight[0] : action === 'release' ? null : (highlight.includes('A') ? 'A' : null);
  
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-200 mb-2">Distributed Lock (Redis)</h4>
        <p className="text-sm text-slate-400">SET NX with TTL for deadlock prevention</p>
      </div>
      
      {/* Lock Resource */}
      <div className="flex items-center gap-8">
        {servers.map((server) => (
          <div key={server.id} className="flex flex-col items-center">
            {/* Server */}
            <div 
              className={`
                w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
                ${highlight.includes(server.id) 
                  ? action === 'acquire' && lockHolder === server.id
                    ? 'border-emerald-500 bg-emerald-500/20 scale-105'
                    : action === 'try' 
                      ? 'border-amber-500 bg-amber-500/20'
                      : 'border-slate-500 bg-slate-700'
                  : 'border-slate-600 bg-slate-800'}
              `}
            >
              <Database className={`w-8 h-8 ${highlight.includes(server.id) ? 'text-white' : 'text-slate-500'}`} />
              <span className={`text-sm font-bold mt-1 ${highlight.includes(server.id) ? 'text-white' : 'text-slate-400'}`}>
                {server.name}
              </span>
            </div>
            
            {/* Lock Status */}
            {lockHolder === server.id ? (
              <div className="mt-2 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" />
                LOCKED
              </div>
            ) : highlight.includes(server.id) && action === 'try' ? (
              <div className="mt-2 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center gap-1">
                <X className="w-3 h-3" />
                WAITING
              </div>
            ) : (
              <div className="mt-2 px-3 py-1 rounded-full bg-slate-700 text-slate-400 text-xs font-bold flex items-center gap-1">
                <Unlock className="w-3 h-3" />
                IDLE
              </div>
            )}
            
            {/* Request Indicator */}
            {highlight.includes(server.id) && action === 'acquire' && lockHolder !== server.id && (
              <div className="absolute mt-24">
                <ArrowDown className="w-6 h-6 text-amber-500 animate-bounce" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Shared Resource */}
      <div className={`
        w-48 h-16 rounded-xl border-2 flex items-center justify-center gap-2 transition-all duration-500
        ${lockHolder 
          ? 'border-emerald-500 bg-emerald-500/10' 
          : 'border-slate-600 bg-slate-800'}
      `}>
        <Database className={`w-6 h-6 ${lockHolder ? 'text-emerald-500' : 'text-slate-500'}`} />
        <span className={`font-bold ${lockHolder ? 'text-emerald-500' : 'text-slate-400'}`}>
          Shared Resource
        </span>
        {lockHolder && (
          <Badge className="bg-emerald-500">{lockHolder}</Badge>
        )}
      </div>
      
      {/* TTL Indicator */}
      {showTTL && (
        <div className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500">
          <span className="text-xs text-amber-400">TTL: 30s</span>
          <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-amber-500 animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      )}
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== LOAD BALANCER VISUALIZER ====================
export function LoadBalancerVisualizer({ data, step }) {
  const { animationSteps = [] } = data;
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { action = null, highlight = [] } = currentStep;
  
  const servers = [
    { id: 's1', name: 'Server 1', requests: 1, healthy: action !== 'healthFail' || !highlight.includes('s1') },
    { id: 's2', name: 'Server 2', requests: 2, healthy: action !== 'healthFail' || !highlight.includes('s2') },
    { id: 's3', name: 'Server 3', requests: 0, healthy: true }
  ];
  
  const activeServer = highlight.includes('s1') ? 's1' : highlight.includes('s2') ? 's2' : highlight.includes('s3') ? 's3' : null;
  
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-200 mb-2">Load Balancer (Round Robin)</h4>
        <p className="text-sm text-slate-400">Active Servers: {servers.filter(s => s.healthy).length}</p>
      </div>
      
      {/* Load Balancer */}
      <div className={`
        w-32 h-32 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
        ${highlight.includes('lb') && action === 'remove' 
          ? 'border-amber-500 bg-amber-500/10' 
          : 'border-teal-500 bg-teal-500/10'}
      `}>
        <Globe className="w-12 h-12 text-teal-500" />
        <span className="text-sm font-bold text-teal-500 mt-1">Load Balancer</span>
      </div>
      
      {/* Arrows */}
      <div className="flex gap-4">
        <div className="w-px h-8 bg-slate-600" />
      </div>
      
      {/* Servers */}
      <div className="flex gap-6">
        {servers.map((server) => (
          <div 
            key={server.id}
            className={`
              relative w-28 h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
              ${!server.healthy 
                ? 'border-red-500 bg-red-500/10 scale-95' 
                : activeServer === server.id 
                  ? 'border-emerald-500 bg-emerald-500/20 scale-110'
                  : 'border-slate-600 bg-slate-800'}
            `}
          >
            {/* Health indicator */}
            <div className={`
              absolute top-2 right-2 w-3 h-3 rounded-full
              ${server.healthy ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}
            `} />
            
            <Database className={`w-8 h-8 ${server.healthy ? 'text-white' : 'text-red-500'}`} />
            <span className={`text-sm font-bold mt-1 ${server.healthy ? 'text-white' : 'text-red-500'}`}>
              {server.name}
            </span>
            
            {/* Request count */}
            <div className={`
              mt-2 px-2 py-1 rounded-full text-xs font-bold
              ${server.requests > 0 ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-400'}
            `}>
              {server.requests} reqs
            </div>
            
            {/* Active request indicator */}
            {activeServer === server.id && server.healthy && (
              <div className="absolute -top-3">
                <div className="px-2 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold animate-pulse">
                  Processing
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Request Flow */}
      {action === 'route' && (
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-full bg-teal-500/20 border border-teal-500 text-teal-400 text-sm font-bold">
            Request {activeServer?.replace('s', '')}
          </div>
          <ArrowRight className="w-6 h-6 text-teal-500" />
        </div>
      )}
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== CACHE SHARDING VISUALIZER ====================
export function CacheShardingVisualizer({ data, step }) {
  const { animationSteps = [] } = data;
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { action = null, highlight = [], showRing = false, showVNodes = false } = currentStep;
  
  // Hash ring with 4 shards
  const shards = [
    { id: 0, range: '0-89', keys: ['user:1', 'user:5'] },
    { id: 1, range: '90-179', keys: ['user:2', 'user:6'] },
    { id: 2, range: '180-239', keys: ['user:3'] },
    { id: 3, range: '240-255', keys: ['user:4'] }
  ];
  
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-200 mb-2">Consistent Hashing</h4>
        <p className="text-sm text-slate-400">4 Shards | Hash Function: key % 256</p>
      </div>
      
      {/* Hash Ring Visualization */}
      {showRing && (
        <div className="relative w-64 h-64">
          <svg width="256" height="256" className="mx-auto">
            {/* Ring */}
            <circle 
              cx="128" cy="128" r="100" 
              fill="none" 
              stroke="#475569" 
              strokeWidth="20"
              className="transition-all duration-500"
            />
            
            {/* Shard positions on ring */}
            {shards.map((shard, i) => {
              const angle = (i * 90 - 90) * (Math.PI / 180);
              const x = 128 + 100 * Math.cos(angle);
              const y = 128 + 100 * Math.sin(angle);
              return (
                <g key={shard.id}>
                  <circle 
                    cx={x} cy={y} r="20" 
                    fill={highlight.includes('all') || highlight.includes(shard.id) ? '#10B981' : '#475569'}
                    className="transition-all duration-300"
                  />
                  <text 
                    x={x} y={y} 
                    textAnchor="middle" dy="4" 
                    fill="white" 
                    fontSize="12" 
                    fontWeight="bold"
                  >
                    S{shard.id}
                  </text>
                </g>
              );
            })}
          </svg>
          
          {/* Center - Hash calculation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center">
              <span className="text-xs text-slate-400">
                {action === 'hash' ? 'hash()' : 'Ring'}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Shard Cards */}
      <div className="grid grid-cols-4 gap-4">
        {shards.map((shard) => (
          <div 
            key={shard.id}
            className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${highlight.includes(shard.id) && action === 'addShard'
                ? 'border-emerald-500 bg-emerald-500/10'
                : highlight.includes(shard.id) && action === 'failShard'
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-slate-600 bg-slate-800'}
            `}
          >
            <div className="text-center font-bold text-white mb-2">Shard {shard.id}</div>
            <div className="text-xs text-slate-400 text-center mb-2">Range: {shard.range}</div>
            <div className="space-y-1">
              {shard.keys.map((key, i) => (
                <div key={i} className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300 truncate">
                  {key}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Virtual Nodes */}
      {showVNodes && (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-slate-400">Virtual Nodes:</span>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-6 h-6 rounded bg-purple-500/50 border border-purple-500" />
          ))}
          <span className="text-xs text-slate-400 ml-2">× 2</span>
        </div>
      )}
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== MESSAGE QUEUE VISUALIZER ====================
export function MessageQueueVisualizer({ data, step }) {
  const { animationSteps = [] } = data;
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { action = null, highlight = [], showMessage = false } = currentStep;
  
  const messages = ['Order #1234', 'Payment Confirm', 'User Update'];
  const queue = action === 'publish' || action === 'consume' ? [...messages].slice(0, 2) : messages;
  
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-slate-200 mb-2">Message Queue (Pub/Sub)</h4>
        <p className="text-sm text-slate-400">Point-to-Point + Publish/Subscribe</p>
      </div>
      
      <div className="flex items-center gap-12">
        {/* Producer */}
        <div className={`
          w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
          ${highlight.includes('producer') 
            ? 'border-blue-500 bg-blue-500/20 scale-105' 
            : 'border-slate-600 bg-slate-800'}
        `}>
          <Network className={`w-10 h-10 ${highlight.includes('producer') ? 'text-blue-500' : 'text-slate-500'}`} />
          <span className={`text-sm font-bold mt-1 ${highlight.includes('producer') ? 'text-blue-500' : 'text-slate-400'}`}>
            Producer
          </span>
          {action === 'publish' && (
            <div className="absolute mt-16">
              <ArrowDown className="w-6 h-6 text-blue-500 animate-bounce" />
            </div>
          )}
        </div>
        
        {/* Message Queue */}
        <div className="flex flex-col items-center">
          <div className={`
            w-40 h-48 rounded-xl border-2 flex flex-col transition-all duration-500 overflow-hidden
            ${highlight.includes('queue') 
              ? 'border-teal-500 bg-teal-500/10' 
              : 'border-slate-600 bg-slate-800'}
          `}>
            <div className="px-3 py-2 bg-slate-700 border-b border-slate-600">
              <span className="text-xs font-bold text-slate-300">Message Queue</span>
            </div>
            <div className="flex-1 p-2 space-y-2 overflow-hidden">
              {queue.map((msg, i) => (
                <div 
                  key={i}
                  className={`
                    px-3 py-2 rounded-lg text-xs font-mono truncate transition-all duration-300
                    ${i === 0 && action === 'consume' 
                      ? 'bg-amber-500/50 text-white animate-pulse' 
                      : 'bg-teal-900/50 text-teal-300'}
                  `}
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
          
          {/* Queue arrows */}
          {action === 'publish' && (
            <ArrowDown className="w-6 h-6 text-blue-500 mt-2" />
          )}
        </div>
        
        {/* Consumers */}
        <div className="flex gap-4">
          {/* Consumer 1 */}
          <div className={`
            w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
            ${highlight.includes('consumer1') 
              ? action === 'consume'
                ? 'border-emerald-500 bg-emerald-500/20 scale-105'
                : action === 'ack'
                  ? 'border-teal-500 bg-teal-500/20'
                  : 'border-slate-600 bg-slate-800'
              : 'border-slate-600 bg-slate-800'}
          `}>
            <Database className={`w-8 h-8 ${highlight.includes('consumer1') ? 'text-white' : 'text-slate-500'}`} />
            <span className={`text-xs font-bold mt-1 ${highlight.includes('consumer1') ? 'text-white' : 'text-slate-400'}`}>
              Consumer 1
            </span>
            {highlight.includes('consumer1') && action === 'ack' && (
              <div className="absolute mt-16">
                <Check className="w-4 h-4 text-teal-500" />
              </div>
            )}
          </div>
          
          {/* Consumer 2 */}
          <div className={`
            w-24 h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-500
            ${highlight.includes('consumer2') && action === 'subscribe'
              ? 'border-purple-500 bg-purple-500/20 scale-105'
              : 'border-slate-600 bg-slate-800'}
          `}>
            <Database className={`w-8 h-8 ${highlight.includes('consumer2') && action === 'subscribe' ? 'text-purple-500' : 'text-slate-500'}`} />
            <span className={`text-xs font-bold mt-1 ${highlight.includes('consumer2') && action === 'subscribe' ? 'text-purple-500' : 'text-slate-400'}`}>
              Consumer 2
            </span>
            {action === 'subscribe' && (
              <div className="absolute mt-16">
                <Mail className="w-4 h-4 text-purple-500" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-slate-400">Producer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-teal-500" />
          <span className="text-slate-400">Queue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span className="text-slate-400">Consumer</span>
        </div>
      </div>
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== CONTROLLER ====================
export default function DistributedVisualizerController({ type, data, step, isPlaying }) {
  switch (type) {
    case 'ratelimiter':
      return <RateLimiterVisualizer data={data} step={step} />;
    case 'circuitbreaker':
      return <CircuitBreakerVisualizer data={data} step={step} />;
    case 'distributedlock':
      return <DistributedLockVisualizer data={data} step={step} />;
    case 'loadbalancer':
      return <LoadBalancerVisualizer data={data} step={step} />;
    case 'cachingsharding':
      return <CacheShardingVisualizer data={data} step={step} />;
    case 'messagedqueue':
      return <MessageQueueVisualizer data={data} step={step} />;
    default:
      return <RateLimiterVisualizer data={data} step={step} />;
  }
}
