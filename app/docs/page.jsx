'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Code, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const DOCSECTIONS = [
  { id: 'graph', name: 'Graph' },
  { id: 'heap', name: 'Heap' },
  { id: 'segment', name: 'Segment Tree' },
  { id: 'unionfind', name: 'Union-Find' },
  { id: 'bit', name: 'Binary Indexed Tree' },
  { id: 'ratelimiter', name: 'Rate Limiter' },
  { id: 'circuitbreaker', name: 'Circuit Breaker' }
];

const CODEEXAMPLES = {
  graph: `// Graph Implementation
class Graph {
  constructor(isDirected = false) {
    this.nodes = new Map();
    this.isDirected = isDirected;
  }
  
  addNode(value) {
    this.nodes.set(value, []);
  }
  
  addEdge(source, target, weight = 1) {
    this.nodes.get(source)?.push({ target, weight });
    if (!this.isDirected) {
      this.nodes.get(target)?.push({ source, weight });
    }
  }
  
  bfs(start) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const node = queue.shift();
      for (const neighbor of this.nodes.get(node)) {
        if (!visited.has(neighbor.target)) {
          visited.add(neighbor.target);
          queue.push(neighbor.target);
        }
      }
    }
    return visited;
  }
}`,
  heap: `// Min Heap Implementation
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  insert(value) {
    this.heap.push(value);
    this._bubbleUp(this.heap.length - 1);
  }
  
  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return min;
  }
  
  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.heap[index] >= this.heap[parent]) break;
      [this.heap[index], this.heap[parent]] = 
        [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }
}`,
  ratelimiter: `// Token Bucket Rate Limiter
class TokenBucket {
  constructor(options = {}) {
    this.capacity = options.capacity || 100;
    this.refillRate = options.refillRate || 10;
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }
  
  tryConsume(tokens = 1) {
    const elapsed = (Date.now() - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, 
      this.tokens + elapsed * this.refillRate);
    this.lastRefill = Date.now();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}`,
  circuitbreaker: `// Circuit Breaker Pattern
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 30000;
    this.state = 'CLOSED';
    this.failures = 0;
  }
  
  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is open');
    }
    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure(error);
      throw error;
    }
  }
  
  _onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
    }
  }
  
  _onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}`
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('graph');
  const [copied, setCopied] = useState(null);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied('code');
    setTimeout(() => setCopied(null), 2000);
  };

  const section = DOCSECTIONS.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Documentation</h1>
              <p className="text-sm text-muted-foreground">
                API reference & code examples
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {DOCSECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === sec.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    {sec.name}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  {section?.name} Documentation
                </CardTitle>
                <CardDescription>
                  API reference and usage examples
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="api">API</TabsTrigger>
                    <TabsTrigger value="example">Example</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <h3 className="text-lg font-semibold mb-2">{section?.name}</h3>
                      <p className="text-muted-foreground">
                        {getSectionOverview(activeSection)}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="api" className="mt-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {getAPIMethods(activeSection)}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="example" className="mt-4">
                    <div className="relative">
                      <div className="absolute top-3 right-3">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyCode(CODEEXAMPLES[activeSection] || CODEEXAMPLES.graph)}
                        >
                          {copied === 'code' ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <ScrollArea className="h-80">
                        <pre className="text-sm p-4 rounded-lg bg-muted overflow-x-auto">
                          <code className="text-sm">
                            {CODEEXAMPLES[activeSection] || CODEEXAMPLES.graph}
                          </code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function getSectionOverview(id) {
  const overviews = {
    graph: 'A graph is a non-linear data structure consisting of nodes (vertices) and edges. Used for representing networks, social relationships, GPS routes, and more.',
    heap: 'A heap is a complete binary tree that satisfies the heap property. Used for priority queues, heap sort, and finding kth largest/smallest elements.',
    segment: 'A segment tree is a tree data structure for storing intervals. Enables efficient range queries and updates in O(log n) time.',
    unionfind: 'A union-find (disjoint set) data structure keeps track of a partition of elements into disjoint sets. Used for Kruskal\'s MST and network connectivity.',
    bit: 'A Binary Indexed Tree (Fenwick Tree) stores prefix sums and enables efficient point updates and prefix sum queries in O(log n) time.',
    ratelimiter: 'Rate limiting controls the number of requests a client can make to an API within a specified time window. Essential for preventing abuse.',
    circuitbreaker: 'The circuit breaker pattern prevents cascade failures in distributed systems by failing fast when a service is unhealthy.'
  };
  return overviews[id] || overviews.graph;
}

function getAPIMethods(id) {
  const methods = {
    graph: [
      { name: 'addNode(value)', desc: 'Add a new node to the graph' },
      { name: 'addEdge(u, v, weight)', desc: 'Add an edge between nodes' },
      { name: 'bfs(start)', desc: 'Breadth-first search from start node' },
      { name: 'dfs(start)', desc: 'Depth-first search from start node' },
      { name: 'dijkstra(start, end)', desc: 'Shortest path between nodes' }
    ],
    heap: [
      { name: 'insert(value)', desc: 'Insert a value into the heap' },
      { name: 'extractMin()', desc: 'Remove and return minimum value' },
      { name: 'peek()', desc: 'Return minimum without removal' },
      { name: 'size', desc: 'Get number of elements' }
    ],
    ratelimiter: [
      { name: 'tryConsume(tokens)', desc: 'Try to consume tokens' },
      { name: 'getState()', desc: 'Get current limiter state' },
      { name: 'reset()', desc: 'Reset the rate limiter' }
    ],
    circuitbreaker: [
      { name: 'execute(fn)', desc: 'Execute function with protection' },
      { name: 'open()', desc: 'Manually open circuit' },
      { name: 'close()', desc: 'Manually close circuit' },
      { name: 'getState()', desc: 'Get current state' }
    ]
  };

  const list = methods[id] || methods.graph;

  return (
    <div className="space-y-2">
      {list.map((method, i) => (
        <div key={i} className="p-3 rounded-lg bg-muted">
          <code className="text-sm text-primary">{method.name}</code>
          <p className="text-sm text-muted-foreground mt-1">{method.desc}</p>
        </div>
      ))}
    </div>
  );
}
