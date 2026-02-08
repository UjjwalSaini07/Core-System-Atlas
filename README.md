# Core System Atlas

**Core System Atlas is a comprehensive full-stack application built to explore modern system design principles, core data structures, and algorithms. It features interactive visualizations, real-time monitoring, and production-inspired services such as rate limiting and circuit breakers. Designed for learning and demonstration, it bridges theoretical computer science with practical, scalable system architecture.**

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Quick Start](#quick-start)
6. [Pages & Routes](#pages--routes)
7. [Data Structures](#data-structures)
8. [System Services](#system-services)
9. [Architecture](#architecture)
10. [API Reference](#api-reference)
11. [Complexity Analysis](#complexity-analysis)
12. [Design Patterns](#design-patterns)
13. [Code Style](#code-style)
14. [Contributing](#contributing)
15. [License](#license)


## Overview

Core System Atlas is an educational and demonstrative full-stack application that showcases:

- 🎓 **Interactive Visualizations** - Learn algorithms through step-by-step animations
- 📊 **Real-time Monitoring** - Track system metrics live
- 🏗️ **System Design Patterns** - Production-ready implementations
- ⚡ **Performance Analytics** - Throughput, latency, and resource tracking
- 🔧 **Production Patterns** - Rate limiting, circuit breakers, distributed locks


## Features

### 🎨 Interactive Visualizations

| Category | Algorithms | Complexity |
|----------|------------|------------|
| **Graph** | BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort | O(V + E) to O(VE) |
| **Heap** | Min/Max Heap, Heapify, Heap Sort | O(log n) |
| **Segment Tree** | Range queries, updates, prefix sums | O(log n) |
| **Union-Find** | Disjoint sets, Kruskal's MST | O(α(n)) |
| **Binary Indexed Tree** | Prefix sums, order statistics | O(log n) |

### 🔧 System Services

| Service | Purpose | Key Features |
|---------|---------|--------------|
| **Rate Limiter** | API throttling | Token bucket, sliding window |
| **Circuit Breaker** | Fault tolerance | Closed/Open/Half-Open states |
| **Distributed Lock** | Synchronization | Mutex, resource locking |
| **File Storage** | File management | Upload, download, list |
| **Search Engine** | Full-text search | Inverted index, ranking |

### 📊 Monitoring & Analytics

- Real-time system metrics (CPU, Memory, Requests, Latency)
- Service health monitoring with status indicators
- Interactive performance charts
- Error rate tracking and alerts


## Tech Stack

### Frontend
- **Next.js 14** - App Router, Server Components
- **React 18** - Hooks, Concurrent features
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components
- **Lucide Icons** - Consistent iconography
- **Recharts** - Composable charting

### Backend
- **Node.js 20** - JavaScript runtime
- **Express** - Server framework
- **Custom DSA** - Educational implementations

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pnpm** - Fast package manager


## Project Structure

```
Core-System-Atlas/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 analytics/          # Analytics page
│   ├── 📁 docs/              # Docs page
│   ├── 📁 monitoring/         # Monitoring page
│   ├── 📁 systems/           # Systems page
│   └── 📁 visualize/         # Visualizer page
├── 📁 backend/
│   ├── 📁 dsa/               # Data structures
│   └── 📁 services/          # Services
├── 📁 components/            # React components
├── 📁 docs/                  # This documentation
├── 📁 hooks/                 # Custom hooks
├── 📁 lib/                   # Utilities
└── 📁 styles/                # Styles
```


## Quick Start

### Prerequisites

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.0.0+ | Runtime |
| pnpm | 8.0+ | Package manager |
| Docker | 20.0+ | Containerization |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/UjjwalSaini07/Core-System-Atlas.git
```
```bash
cd Core-System-Atlas
```
```bash
# 2. Install dependencies
pnpm install
```
```bash
# 3. Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```
```bash
# View logs
docker-compose logs -f
```
```bash
# Stop services
docker-compose down
```


## Pages & Routes

| Route | Path | Description |
|-------|------|-------------|
| **Dashboard** | `/` | Main overview with system stats |
| **Visualizer** | `/visualize` | Interactive algorithm animations |
| **Analytics** | `/analytics` | Performance charts & metrics |
| **Systems** | `/systems` | Component status & config |
| **Monitoring** | `/monitoring` | Real-time monitoring |
| **Documentation** | `/docs` | API docs & guides |


## Data Structures

### Graph
```javascript
const graph = new Graph(isDirected);
graph.addNode('A');
graph.addEdge('A', 'B', 5);
const visited = graph.bfs('A');
const path = graph.dijkstra('A', 'Z');
```

| Operation | Time Complexity |
|-----------|-----------------|
| addNode | O(1) |
| addEdge | O(1) |
| bfs/dfs | O(V + E) |
| dijkstra | O((V + E) log V) |
| topologicalSort | O(V + E) |

### Heap
```javascript
const heap = new MinHeap();
heap.insert(10);
heap.insert(5);
const min = heap.extractMin(); // 5
```

| Operation | Time Complexity |
|-----------|-----------------|
| insert | O(log n) |
| extractMin | O(log n) |
| peek | O(1) |
| size | O(1) |

### Segment Tree
```javascript
const seg = new SegmentTree([1, 3, 5, 7]);
seg.update(2, 10);
const sum = seg.query(0, 3);
```

| Operation | Time Complexity |
|-----------|-----------------|
| build | O(n) |
| update | O(log n) |
| query | O(log n) |

### Union-Find
```javascript
const uf = new UnionFind(10);
uf.union(3, 5);
uf.connected(3, 5); // true
```

| Operation | Time Complexity |
|-----------|-----------------|
| find | O(α(n)) |
| union | O(α(n)) |
| connected | O(α(n)) |

### Binary Indexed Tree
```javascript
const bit = new BinaryIndexedTree([1, 2, 3]);
bit.update(1, 5);
const sum = bit.prefixSum(2);
```

| Operation | Time Complexity |
|-----------|-----------------|
| update | O(log n) |
| prefixSum | O(log n) |
| rangeQuery | O(log n) |

---

## System Services

### Rate Limiter (Token Bucket)

```javascript
const limiter = new TokenBucket({ capacity: 100, refillRate: 10 });
const allowed = limiter.tryConsume(5);
```

**States:**
- `tokens` - Current tokens available
- `capacity` - Maximum tokens
- `refillRate` - Tokens per second

### Circuit Breaker

```javascript
const breaker = new CircuitBreaker({ failureThreshold: 5, timeout: 30000 });
const result = await breaker.execute(async () => fetch('/api'));
```

**States:**
- `CLOSED` - Normal operation
- `OPEN` - Blocking requests
- `HALF_OPEN` - Testing recovery

### Distributed Lock

```javascript
const lock = new DistributedLock({ ttl: 30000 });
const acquired = await lock.acquire('resource-key');
await lock.release('resource-key');
```


## Architecture

### High-Level Architecture
--- Loading...

### Frontend Architecture

```
app/
├── layout.jsx          # Root layout, providers
├── page.jsx            # Dashboard
├── globals.css         # Tailwind + CSS variables
├── [page]/             # Route segments
│   ├── page.jsx       # Page component
│   └── layout.jsx      # Nested layout
└── ui/                 # Shared components
```

### State Management

1. **React Hooks** - Local component state
2. **Context API** - Global theming
3. **Custom Hooks** - Reusable logic


## API Reference

### Component API

```jsx
<SystemStats
  data={{ cpu, memory, requests }}
  loading={false}
/>

<Analytics
  data={metrics}
  type="line"
  height={300}
/>

<SearchBar
  onSearch={(query) => handleSearch(query)}
  placeholder="Search..."
/>
```

### Hooks

```javascript
const isMobile = useMobile();
const { toast } = useToast();
```

### Guidelines

- Follow the [Code Style Guide](docs/STYLE.md)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Designed and developed with a focus on clean architecture, performance, and developer experience.

<div align="center">

**Ujjwal Saini**  
_Full-Stack Developer_

🌐 [ujjwalsaini.dev](https://www.ujjwalsaini.dev/) · 🐙 [GitHub](https://github.com/UjjwalSaini07)

</div>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>
