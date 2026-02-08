'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Zap, Shield, Globe, Activity, Play, Pause, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SYSTEMCOMPONENTS = [
  { id: 'ratelimiter', name: 'Rate Limiter', icon: Zap },
  { id: 'circuitbreaker', name: 'Circuit Breaker', icon: Shield },
  { id: 'loadbalancer', name: 'Load Balancer', icon: Globe }
];

export default function SystemsPage() {
  const [activeComponent, setActiveComponent] = useState('ratelimiter');
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = useCallback((type, message) => {
    const timestamp = new Date().toISOString();
    setLogs(prev => [...prev.slice(-30), { type, message, timestamp }]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4 text-blue-600" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-blue-900">System Components</h1>
              <p className="text-sm text-blue-600/70">Distributed systems patterns</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={isRunning ? 'default' : 'secondary'} className={isRunning ? 'bg-green-500' : ''}>
              <span className={`w-2 h-2 rounded-full mr-2 ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              {isRunning ? 'Running' : 'Idle'}
            </Badge>
            <Button
              variant={isRunning ? 'secondary' : 'default'}
              onClick={() => setIsRunning(!isRunning)}
              className={!isRunning ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Stop</> : <><Play className="w-4 h-4 mr-2" /> Start Demo</>}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3 space-y-4">
            <Card className="border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-900">Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {SYSTEMCOMPONENTS.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => setActiveComponent(comp.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeComponent === comp.id ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-50 text-blue-700'
                    }`}
                  >
                    <comp.icon className="w-4 h-4" />
                    {comp.name}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4 border-blue-200 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                  <Activity className="w-4 h-4" />
                  Live Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 overflow-y-auto space-y-1 text-xs font-mono bg-blue-50 rounded-lg p-3">
                  {logs.map((log, i) => (
                    <div key={i} className={log.type === 'success' ? 'text-green-600' : log.type === 'error' ? 'text-red-600' : 'text-blue-600'}>
                      <span className="opacity-50">{new Date(log.timestamp).toLocaleTimeString()}</span> {log.message}
                    </div>
                  ))}
                  {logs.length === 0 && <p className="text-blue-400 text-center py-4">No logs yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="col-span-9">
            {activeComponent === 'ratelimiter' && <RateLimiterDemo isRunning={isRunning} addLog={addLog} />}
            {activeComponent === 'circuitbreaker' && <CircuitBreakerDemo isRunning={isRunning} addLog={addLog} />}
            {activeComponent === 'loadbalancer' && <LoadBalancerDemo isRunning={isRunning} addLog={addLog} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function RateLimiterDemo({ isRunning, addLog }) {
  const [config, setConfig] = useState({ capacity: 10, refillRate: 2 });
  const [tokens, setTokens] = useState(10);
  const [requests, setRequests] = useState({ allowed: 0, denied: 0 });

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTokens(prev => Math.min(config.capacity, prev + config.refillRate * 0.1));
    }, 100);
    return () => clearInterval(interval);
  }, [isRunning, config]);

  const handleRequest = () => {
    if (tokens >= 1) {
      setTokens(prev => prev - 1);
      setRequests(prev => ({ ...prev, allowed: prev.allowed + 1 }));
      addLog('success', 'Request allowed');
    } else {
      setRequests(prev => ({ ...prev, denied: prev.denied + 1 }));
      addLog('error', 'Request denied');
    }
  };

  return (
    <Card className="border-blue-200 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Zap className="w-5 h-5 text-blue-600" />
          Token Bucket Rate Limiter
        </CardTitle>
        <CardDescription className="text-blue-600/70">Controls request rate using token bucket algorithm</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm text-blue-700 font-medium">Available Tokens</label>
              <div className="flex items-center gap-3 mt-2">
                <Progress value={(tokens / config.capacity) * 100} className="flex-1 h-3" />
                <span className="text-sm font-bold text-blue-700 w-24">{tokens.toFixed(1)} / {config.capacity}</span>
              </div>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: config.capacity }).map((_, i) => (
                  <div key={i} className={`w-3 h-5 rounded-sm ${i < Math.floor(tokens) ? 'bg-blue-500' : 'bg-blue-200'}`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-2xl font-bold text-green-600">{requests.allowed}</p>
                <p className="text-xs text-green-700">Allowed</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-2xl font-bold text-red-600">{requests.denied}</p>
                <p className="text-xs text-red-700">Denied</p>
              </div>
            </div>
            <Button onClick={handleRequest} disabled={!isRunning || tokens < 1} className="w-full bg-blue-600 hover:bg-blue-700">Send Request</Button>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">Configuration</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Bucket Capacity</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">{config.capacity} tokens</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Refill Rate</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-300">{config.refillRate}/sec</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CircuitBreakerDemo({ isRunning, addLog }) {
  const [state, setState] = useState('CLOSED');
  const [failures, setFailures] = useState(0);
  const [stats, setStats] = useState({ requests: 0, successes: 0, rejected: 0 });

  const simulateRequest = () => {
    setStats(prev => ({ ...prev, requests: prev.requests + 1 }));
    if (state === 'OPEN') {
      setStats(prev => ({ ...prev, rejected: prev.rejected + 1 }));
      addLog('error', 'Rejected - circuit OPEN');
      return;
    }
    if (Math.random() < 0.3) {
      const newFailures = failures + 1;
      setFailures(newFailures);
      setStats(prev => ({ ...prev, failures: prev.failures + 1 }));
      addLog('error', 'Request failed');
      if (newFailures >= 5) { setState('OPEN'); addLog('warning', 'Circuit OPENED'); }
    } else {
      setStats(prev => ({ ...prev, successes: prev.successes + 1 }));
      addLog('success', 'Request succeeded');
    }
  };

  const reset = () => { setState('CLOSED'); setFailures(0); setStats({ requests: 0, successes: 0, rejected: 0 }); addLog('success', 'Reset'); };

  return (
    <Card className="border-blue-200 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Shield className="w-5 h-5 text-blue-600" />
          Circuit Breaker Pattern
        </CardTitle>
        <CardDescription className="text-blue-600/70">Prevents cascade failures in distributed systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className={`p-6 rounded-2xl border-2 ${state === 'CLOSED' ? 'border-green-500 bg-green-50' : state === 'OPEN' ? 'border-red-500 bg-red-50' : 'border-amber-500 bg-amber-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-blue-900">Circuit State</span>
                <Badge className={state === 'CLOSED' ? 'bg-green-500' : state === 'OPEN' ? 'bg-red-500' : 'bg-amber-500'}>{state}</Badge>
              </div>
              <div className="flex justify-center my-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center ${state === 'CLOSED' ? 'bg-green-500' : state === 'OPEN' ? 'bg-red-500' : 'bg-amber-500'}`}>
                  {state === 'CLOSED' && <Shield className="w-12 h-12 text-white" />}
                  {state === 'OPEN' && <div className="w-3 h-3 rounded-full bg-white animate-ping" />}
                  {state === 'HALF_OPEN' && <Activity className="w-12 h-12 text-white animate-pulse" />}
                </div>
              </div>
              <p className="text-sm text-blue-700 text-center">{state === 'CLOSED' ? 'Normal operation' : state === 'OPEN' ? 'Blocking requests' : 'Testing recovery'}</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xl font-bold text-blue-600">{failures}</p>
                <p className="text-xs text-blue-700">Failures</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <p className="text-xl font-bold text-green-600">{stats.successes}</p>
                <p className="text-xs text-green-700">Successes</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-xs text-red-700">Rejected</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={simulateRequest} disabled={!isRunning} className="flex-1 bg-blue-600 hover:bg-blue-700">Simulate Request</Button>
              <Button variant="outline" onClick={reset} className="border-blue-300 text-blue-700"><RefreshCw className="w-4 h-4 mr-2" />Reset</Button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">State Machine</h4>
              <div className="flex items-center gap-2 text-sm">
                <div className={`px-3 py-1 rounded ${state === 'CLOSED' ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700'}`}>CLOSED</div>
                <span className="text-blue-400">→</span>
                <div className={`px-3 py-1 rounded ${state === 'OPEN' ? 'bg-red-500 text-white' : 'bg-blue-100 text-blue-700'}`}>OPEN</div>
                <span className="text-blue-400">→</span>
                <div className={`px-3 py-1 rounded ${state === 'HALF_OPEN' ? 'bg-amber-500 text-white' : 'bg-blue-100 text-blue-700'}`}>HALF_OPEN</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadBalancerDemo({ isRunning, addLog }) {
  const [servers, setServers] = useState([
    { id: 1, name: 'Server-1', requests: 45, cpu: 35 },
    { id: 2, name: 'Server-2', requests: 38, cpu: 42 },
    { id: 3, name: 'Server-3', requests: 52, cpu: 68 }
  ]);

  const simulateRequest = () => {
    const nextServer = servers.reduce((a, b) => a.cpu < b.cpu ? a : b);
    setServers(prev => prev.map(s => s.id === nextServer.id ? { ...s, requests: s.requests + 1, cpu: Math.min(100, s.cpu + 5) } : { ...s, cpu: Math.max(10, s.cpu - 2) }));
    addLog('success', `Routed to ${nextServer.name}`);
  };

  return (
    <Card className="border-blue-200 bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Globe className="w-5 h-5 text-blue-600" />
          Load Balancer
        </CardTitle>
        <CardDescription className="text-blue-600/70">Distributes traffic across multiple servers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {servers.map((server) => (
              <div key={server.id} className={`p-4 rounded-xl border-2 ${server.cpu > 80 ? 'border-red-400 bg-red-50' : 'border-blue-300 bg-blue-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-blue-900">{server.name}</span>
                  <Badge className={server.cpu > 80 ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}>healthy</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-700">CPU</span>
                    <span className="font-medium text-blue-900">{server.cpu.toFixed(0)}%</span>
                  </div>
                  <Progress value={server.cpu} className={`h-2 ${server.cpu > 80 ? 'bg-red-200' : 'bg-blue-200'}`} />
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-blue-700">Requests</span>
                    <span className="font-medium text-blue-900">{server.requests}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={simulateRequest} disabled={!isRunning} className="w-full bg-blue-600 hover:bg-blue-700">Route Request</Button>
        </div>
      </CardContent>
    </Card>
  );
}
