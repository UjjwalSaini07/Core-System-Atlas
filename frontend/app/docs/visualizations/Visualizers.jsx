'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, ChevronRight, ChevronDown, ArrowRight, ArrowDown, RotateCcw, StepForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

// Import Sorting Visualizer
import SortingVisualizerController from './SortingVisualizer';

// ==================== ARRAY VISUALIZER ====================
export function ArrayVisualizer({ data, step, isPlaying, speed = 1000 }) {
  const { values, indices = true } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [action, setAction] = useState(null);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        if (currentStep.highlight) {
          setActiveIndex(currentStep.highlight[0]);
        }
      }
    }
  }, [step, data]);
  
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex items-end gap-1">
        {values.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`
                w-14 h-16 rounded-lg flex items-center justify-center text-white font-mono text-lg font-bold transition-all duration-500
                ${highlighted.includes(index) 
                  ? action === 'access' ? 'bg-emerald-500 scale-110 shadow-lg ring-4 ring-emerald-300' 
                  : action === 'search' ? 'bg-amber-500 scale-105 ring-4 ring-amber-300'
                  : action === 'insert' ? 'bg-blue-500 scale-110 ring-4 ring-blue-300'
                  : action === 'delete' ? 'bg-red-500 scale-90 ring-4 ring-red-300'
                  : 'bg-slate-700'
                  : 'bg-slate-600 opacity-60'}
              `}
            >
              {value}
            </div>
            {indices && (
              <span className={`text-xs mt-2 font-mono ${highlighted.includes(index) ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}>
                [{index}]
              </span>
            )}
          </div>
        ))}
      </div>
      
      {action && (
        <Badge variant="outline" className="text-sm px-4 py-2">
          Action: {action.toUpperCase()}
        </Badge>
      )}
    </div>
  );
}

// ==================== STACK VISUALIZER ====================
export function StackVisualizer({ data, step, isPlaying }) {
  const { values, direction = 'vertical' } = data;
  const [stack, setStack] = useState([...values]);
  const [topIndex, setTopIndex] = useState(values.length - 1);
  const [action, setAction] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setAction(currentStep.action || null);
        setCurrentValue(currentStep.value || null);
      }
    }
  }, [step, data]);
  
  return (
    <div className="flex items-center gap-8 p-6">
      <div className="flex flex-col-reverse gap-1 min-w-[100px]">
        {stack.map((value, index) => (
          <div
            key={index}
            className={`
              w-24 h-10 rounded-lg flex items-center justify-center text-white font-mono transition-all duration-500
              ${index === topIndex 
                ? action === 'push' ? 'bg-emerald-500 scale-105 shadow-lg ring-4 ring-emerald-300' 
                  : action === 'pop' ? 'bg-amber-500 scale-95 ring-4 ring-amber-300'
                  : action === 'peek' ? 'bg-blue-500 scale-105 ring-4 ring-blue-300'
                  : 'bg-teal-600 shadow-md'
                : 'bg-slate-600 opacity-60'}
            `}
          >
            {value}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="text-xs text-amber-500 font-medium">TOP</div>
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-amber-500" />
        {action && (
          <Badge variant="outline" className="mt-2">{action.toUpperCase()}</Badge>
        )}
      </div>
      
      {currentValue && action === 'push' && (
        <div className="flex flex-col items-center">
          <div className="w-24 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-mono animate-bounce">
            {currentValue}
          </div>
          <span className="text-xs text-emerald-500 mt-1">Incoming</span>
        </div>
      )}
    </div>
  );
}

// ==================== QUEUE VISUALIZER ====================
export function QueueVisualizer({ data, step, isPlaying }) {
  const { values, front = 0 } = data;
  const [queue, setQueue] = useState([...values]);
  const [frontIndex, setFrontIndex] = useState(front);
  const [action, setAction] = useState(null);
  const [currentValue, setCurrentValue] = useState(null);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setAction(currentStep.action || null);
        setCurrentValue(currentStep.value || null);
      }
    }
  }, [step, data]);
  
  return (
    <div className="flex items-center gap-4 p-6">
      <div className="flex items-center gap-1">
        {queue.map((value, index) => (
          <div
            key={index}
            className={`
              w-16 h-12 rounded-lg flex items-center justify-center text-white font-mono transition-all duration-500
              ${index === frontIndex 
                ? action === 'dequeue' ? 'bg-amber-500 scale-95 ring-4 ring-amber-300' 
                  : action === 'peek' ? 'bg-blue-500 scale-105 ring-4 ring-blue-300'
                  : 'bg-teal-600 shadow-md'
                : 'bg-slate-600 opacity-60'}
              ${action === 'enqueue' && index === queue.length - 1 ? 'bg-emerald-500 scale-105 ring-4 ring-emerald-300' : ''}
            `}
          >
            {value}
          </div>
        ))}
      </div>
      
      <div className="flex flex-col gap-2 ml-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-500 font-medium">FRONT</span>
          <ArrowRight className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-500 font-medium">REAR</span>
          <ArrowRight className="w-4 h-4 text-red-500" />
        </div>
      </div>
      
      {currentValue && action === 'enqueue' && (
        <div className="flex flex-col items-center">
          <div className="w-16 h-12 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-mono animate-bounce">
            {currentValue}
          </div>
          <span className="text-xs text-emerald-500 mt-1">Enqueue</span>
        </div>
      )}
      
      {action && (
        <Badge variant="outline" className="ml-4">{action.toUpperCase()}</Badge>
      )}
    </div>
  );
}

// ==================== LINKED LIST VISUALIZER ====================
export function LinkedListVisualizer({ data, step, isPlaying }) {
  const { values, nextPointers = true } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [action, setAction] = useState(null);
  const [showPointer, setShowPointer] = useState(false);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        setShowPointer(currentStep.showPointer || false);
      }
    }
  }, [step, data]);
  
  return (
    <div className="flex items-center gap-2 p-6">
      {values.map((value, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`
                w-14 h-14 rounded-lg flex items-center justify-center text-white font-mono font-bold transition-all duration-500
                ${highlighted.includes(index) 
                  ? action === 'traverse' ? 'bg-amber-500 scale-105' 
                    : action === 'insertHead' ? 'bg-emerald-500 scale-110 ring-4 ring-emerald-300'
                    : action === 'insertTail' ? 'bg-blue-500 scale-110 ring-4 ring-blue-300'
                    : action === 'deleteHead' ? 'bg-red-500 scale-90 ring-4 ring-red-300'
                    : 'bg-teal-600'
                  : 'bg-slate-600 opacity-60'}
              `}
            >
              {value}
            </div>
            <span className="text-xs text-slate-400 mt-1">node{index}</span>
          </div>
          {index < values.length - 1 && (
            <div className="flex flex-col items-center mx-1">
              {showPointer && (
                <span className="text-xs text-blue-400 mb-1">next</span>
              )}
              <div className="flex items-center">
                <div className="w-8 h-0.5 bg-slate-500" />
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-slate-500 border-b-[6px] border-b-transparent" />
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="ml-4 flex flex-col items-center">
        <div className="text-xs text-slate-400">HEAD</div>
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
      </div>
      
      {action && (
        <Badge variant="outline" className="ml-4">{action.toUpperCase()}</Badge>
      )}
    </div>
  );
}

// ==================== HASH TABLE VISUALIZER ====================
export function HashTableVisualizer({ data, step, isPlaying }) {
  const { buckets, entries } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [action, setAction] = useState(null);
  const [showHash, setShowHash] = useState(false);
  const [showCollision, setShowCollision] = useState(false);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        setShowHash(currentStep.showHash || false);
        setShowCollision(currentStep.showCollision || false);
      }
    }
  }, [step, data]);
  
  // Create bucket display
  const bucketData = Array(buckets).fill(null).map((_, i) => {
    const bucketEntries = entries.filter((_, idx) => idx % buckets === i);
    return bucketEntries;
  });
  
  return (
    <div className="flex gap-8 p-6">
      <div className="flex flex-col gap-2">
        {bucketData.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`
              w-12 h-10 rounded flex items-center justify-center text-xs font-mono font-bold transition-all duration-500
              ${highlighted.includes(idx) ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'}
            `}>
              {idx}
            </div>
            <div className="w-px h-8 bg-slate-600" />
            <div className="flex gap-1">
              {entry.length === 0 ? (
                <div className="w-20 h-8 rounded border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <span className="text-xs text-slate-500">empty</span>
                </div>
              ) : (
                entry.map((e, eidx) => (
                  <div
                    key={eidx}
                    className={`
                      px-3 py-1 rounded text-xs font-mono transition-all duration-500
                      ${highlighted.includes(idx) && (action === 'insert' || action === 'lookup')
                        ? 'bg-emerald-500 text-white scale-105' 
                        : 'bg-blue-600 text-white'}
                    `}
                  >
                    {e.k}:{e.v}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      
      {showHash && (
        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-slate-400 mb-2">Hash Function</div>
          <code className="text-xs bg-slate-800 px-3 py-2 rounded text-emerald-400">
            hash(key) % {buckets}
          </code>
        </div>
      )}
      
      {action && (
        <Badge variant="outline">{action.toUpperCase()}</Badge>
      )}
    </div>
  );
}

// ==================== HEAP VISUALIZER ====================
export function HeapVisualizer({ data, step, isPlaying }) {
  const { values, min = true, treeStructure = true } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [action, setAction] = useState(null);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
      }
    }
  }, [step, data]);
  
  // Binary tree layout for heap
  const levels = Math.ceil(Math.log2(values.length + 1));
  
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex flex-col items-center">
        {/* Level 0 */}
        <div className="flex gap-4">
          <HeapNode 
            value={values[0]} 
            highlighted={highlighted.includes(0)}
            action={action}
            index={0}
          />
        </div>
        
        {/* Edges */}
        {values.length > 1 && (
          <div className="flex gap-16 relative">
            <div className="absolute top-0 left-1/4 w-1 h-4 bg-slate-500 transform -translate-x-1/2" />
            <div className="absolute top-0 right-1/4 w-1 h-4 bg-slate-500 transform translate-x-1/2" />
          </div>
        )}
        
        {/* Level 1 */}
        {values.length > 1 && (
          <div className="flex gap-8 mt-4">
            <HeapNode 
              value={values[1]} 
              highlighted={highlighted.includes(1)}
              action={action}
              index={1}
            />
            <HeapNode 
              value={values[2]} 
              highlighted={highlighted.includes(2)}
              action={action}
              index={2}
            />
          </div>
        )}
        
        {/* Level 2 */}
        {values.length > 3 && (
          <div className="flex gap-4 mt-4">
            <HeapNode 
              value={values[3]} 
              highlighted={highlighted.includes(3)}
              action={action}
              index={3}
            />
            <HeapNode 
              value={values[4]} 
              highlighted={highlighted.includes(4)}
              action={action}
              index={4}
            />
            <HeapNode 
              value={values[5]} 
              highlighted={highlighted.includes(5)}
              action={action}
              index={5}
            />
            <HeapNode 
              value={values[6]} 
              highlighted={highlighted.includes(6)}
              action={action}
              index={6}
            />
          </div>
        )}
      </div>
      
      <Badge variant="outline" className="mt-2 text-white">
        {min ? 'Min Heap (parent ≤ children)' : 'Max Heap (parent ≥ children)'}
      </Badge>
    </div>
  );
}

function HeapNode({ value, highlighted, action, index }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-12 h-12 rounded-full flex items-center justify-center text-white font-mono font-bold transition-all duration-500
          ${highlighted 
            ? action === 'bubbleUp' ? 'bg-emerald-500 scale-110 ring-4 ring-emerald-300' 
              : action === 'bubbleDown' ? 'bg-amber-500 scale-110 ring-4 ring-amber-300'
              : 'bg-teal-600 shadow-lg'
            : 'bg-slate-600'}
        `}
      >
        {value}
      </div>
      <span className="text-xs text-slate-400 mt-1">[{index}]</span>
    </div>
  );
}

// ==================== BST VISUALIZER ====================
export function BSTVisualizer({ data, step, isPlaying }) {
  const { root, structure, balanced = true } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [action, setAction] = useState(null);
  const [showProperty, setShowProperty] = useState(false);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        setShowProperty(currentStep.showProperty || false);
      }
    }
  }, [step, data]);
  
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Root */}
      <BSTNode 
        value={root} 
        highlighted={highlighted.includes('root') || highlighted.includes(root)}
        action={action}
        label="root"
      />
      
      {/* Edges */}
      <div className="flex gap-32 relative">
        <div className="absolute top-0 left-8 w-0.5 h-4 bg-slate-500" />
        <div className="absolute top-0 right-8 w-0.5 h-4 bg-slate-500" />
      </div>
      
      {/* Level 1 */}
      <div className="flex gap-16">
        <BSTNode 
          value={structure.left} 
          highlighted={highlighted.includes('left') || highlighted.includes(structure.left)}
          action={action}
        />
        <BSTNode 
          value={structure.right} 
          highlighted={highlighted.includes('right') || highlighted.includes(structure.right)}
          action={action}
        />
      </div>
      
      {/* Edges */}
      <div className="flex gap-8 relative">
        <div className="absolute top-0 left-6 w-0.5 h-3 bg-slate-500" />
        <div className="absolute top-0 left-[74px] w-0.5 h-3 bg-slate-500" />
        <div className="absolute top-0 right-[74px] w-0.5 h-3 bg-slate-500" />
        <div className="absolute top-0 right-6 w-0.5 h-3 bg-slate-500" />
      </div>
      
      {/* Level 2 */}
      <div className="flex gap-4">
        <BSTNode 
          value={structure.leftLeft} 
          highlighted={highlighted.includes('leftLeft') || highlighted.includes(structure.leftLeft)}
          action={action}
        />
        <BSTNode 
          value={structure.leftRight} 
          highlighted={highlighted.includes('leftRight') || highlighted.includes(structure.leftRight)}
          action={action}
        />
        <BSTNode 
          value={structure.rightLeft} 
          highlighted={highlighted.includes('rightLeft') || highlighted.includes(structure.rightLeft)}
          action={action}
        />
        <BSTNode 
          value={structure.rightRight} 
          highlighted={highlighted.includes('rightRight') || highlighted.includes(structure.rightRight)}
          action={action}
        />
      </div>
      
      {showProperty && (
        <Badge variant="secondary" className="mt-2">
          BST Property: left &lt; parent &lt; right
        </Badge>
      )}
    </div>
  );
}

function BSTNode({ value, highlighted, action, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center text-white font-mono font-bold transition-all duration-500
          ${highlighted 
            ? action === 'search' ? 'bg-amber-500 scale-110 ring-4 ring-amber-300' 
              : action === 'insert' ? 'bg-emerald-500 scale-110 ring-4 ring-emerald-300'
              : action === 'delete' ? 'bg-red-500 scale-90 ring-4 ring-red-300'
              : action === 'traverse' ? 'bg-blue-500 scale-105 ring-4 ring-blue-300'
              : 'bg-teal-600 shadow-lg'
            : 'bg-slate-600'}
        `}
      >
        {value}
      </div>
      {label && <span className="text-xs text-slate-400 mt-1">{label}</span>}
    </div>
  );
}

// ==================== GRAPH VISUALIZER ====================
export function GraphVisualizer({ data, step, isPlaying }) {
  const { nodes, edges, directed = false, weighted = false } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [visited, setVisited] = useState([]);
  const [action, setAction] = useState(null);
  const [path, setPath] = useState([]);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        setPath(currentStep.path || []);
      }
    }
  }, [step, data]);
  
  // Node positions (simplified layout)
  const nodePositions = {
    A: { x: 80, y: 50 },
    B: { x: 180, y: 100 },
    C: { x: 280, y: 50 },
    D: { x: 150, y: 150 },
    E: { x: 250, y: 150 },
    F: { x: 350, y: 150 }
  };
  
  const nodeLabels = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, nodes);
  
  return (
    <svg width="400" height="200" viewBox="0 0 400 200" className="mx-auto">
      {/* Edges */}
      {directed ? (
        // Directed edges
        <>
          <line x1="80" y1="50" x2="180" y2="100" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="180" y1="100" x2="280" y2="50" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="80" y1="100" x2="150" y2="150" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="180" y1="100" x2="250" y2="150" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="150" y1="150" x2="250" y2="150" stroke="#64748B" strokeWidth="2" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
            </marker>
          </defs>
        </>
      ) : (
        // Undirected edges
        <>
          <line x1="80" y1="50" x2="180" y2="100" stroke="#64748B" strokeWidth="2" />
          <line x1="180" y1="100" x2="280" y2="50" stroke="#64748B" strokeWidth="2" />
          <line x1="80" y1="100" x2="150" y2="150" stroke="#64748B" strokeWidth="2" />
          <line x1="180" y1="100" x2="250" y2="150" stroke="#64748B" strokeWidth="2" />
          <line x1="150" y1="150" x2="250" y2="150" stroke="#64748B" strokeWidth="2" />
          <line x1="80" y1="50" x2="80" y2="100" stroke="#64748B" strokeWidth="2" />
        </>
      )}
      
      {/* Highlighted edges */}
      {path.length > 1 && path.map((node, idx) => {
        if (idx === path.length - 1) return null;
        const next = path[idx + 1];
        const pos1 = nodePositions[node];
        const pos2 = nodePositions[next];
        return (
          <line
            key={idx}
            x1={pos1?.x} y1={pos1?.y} x2={pos2?.x} y2={pos2?.y}
            stroke="#10B981"
            strokeWidth="4"
            className="animate-pulse"
          />
        );
      })}
      
      {/* Nodes */}
      {nodeLabels.map((label, idx) => {
        const pos = nodePositions[label];
        const isHighlighted = highlighted.includes(label) || highlighted.includes(idx);
        const isVisited = visited.includes(label);
        const isInPath = path.includes(label);
        
        return (
          <g key={label}>
            <circle
              cx={pos?.x} cy={pos?.y} r="20"
              fill={isInPath ? '#10B981' : isHighlighted ? (action === 'bfs' || action === 'dfs' ? '#F59E0B' : '#0891B2') : '#475569'}
              className="transition-all duration-500"
              style={{ 
                filter: isHighlighted ? 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.8))' : 'none',
                opacity: highlighted.length > 0 && !isHighlighted && !isInPath ? 0.4 : 1
              }}
            />
            <text
              x={pos?.x} y={pos?.y}
              textAnchor="middle" dy="4"
              fill="white" fontSize="12" fontWeight="bold"
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ==================== TRIE VISUALIZER ====================
export function TrieVisualizer({ data, step, isPlaying }) {
  const { words, root = true } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [action, setAction] = useState(null);
  const [showStructure, setShowStructure] = useState(false);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        setShowStructure(currentStep.showStructure || false);
      }
    }
  }, [step, data]);
  
  return (
    <svg width="500" height="200" viewBox="0 0 500 200" className="mx-auto">
      {/* Root */}
      <circle cx="250" cy="30" r="15" fill="#475569" />
      <text x="250" y="34" textAnchor="middle" fill="white" fontSize="10">root</text>
      
      {/* Edges to C, D */}
      <line x1="250" y1="45" x2="150" y2="80" stroke="#64748B" strokeWidth="1.5" />
      <line x1="250" y1="45" x2="350" y2="80" stroke="#64748B" strokeWidth="1.5" />
      
      {/* C node */}
      <g>
        <circle cx="150" cy="80" r="15" fill={highlighted.includes('c') ? '#F59E0B' : '#475569'} />
        <text x="150" y="84" textAnchor="middle" fill="white" fontSize="10">c</text>
        <text x="165" y="83" fontSize="8" fill="#64748B">a</text>
        
        {/* C → A edge */}
        <line x1="150" y1="95" x2="120" y2="130" stroke="#64748B" strokeWidth="1.5" />
        
        {/* A node under C */}
        <circle cx="120" cy="130" r="15" fill={highlighted.includes('a') ? '#F59E0B' : '#475569'} />
        <text x="120" y="134" textAnchor="middle" fill="white" fontSize="10">a</text>
        
        {/* A → T edge */}
        <line x1="120" y1="145" x2="100" y2="170" stroke="#64748B" strokeWidth="1.5" />
        <text x="125" y="160" fontSize="8" fill="#64748B">t/r</text>
        
        {/* T and R nodes */}
        <circle cx="100" cy="170" r="12" fill={highlighted.includes('t') ? '#10B981' : (highlighted.includes('root') ? '#475569' : '#475569')} style={{ opacity: highlighted.length > 0 && !highlighted.includes('t') ? 0.5 : 1 }} />
        <circle cx="140" cy="170" r="12" fill={highlighted.includes('r') ? '#10B981' : '#475569'} style={{ opacity: highlighted.length > 0 && !highlighted.includes('r') ? 0.5 : 1 }} />
        <text x="100" y="173" textAnchor="middle" fill="white" fontSize="8">t*</text>
        <text x="140" y="173" textAnchor="middle" fill="white" fontSize="8">r</text>
      </g>
      
      {/* D node */}
      <g>
        <circle cx="350" cy="80" r="15" fill={highlighted.includes('d') ? '#F59E0B' : '#475569'} />
        <text x="350" y="84" textAnchor="middle" fill="white" fontSize="10">d</text>
        <text x="365" y="83" fontSize="8" fill="#64748B">o</text>
        
        {/* D → O edge */}
        <line x1="350" y1="95" x2="350" y2="130" stroke="#64748B" strokeWidth="1.5" />
        
        {/* O node */}
        <circle cx="350" cy="130" r="15" fill={highlighted.includes('o') ? '#F59E0B' : '#475569'} />
        <text x="350" y="134" textAnchor="middle" fill="white" fontSize="10">o</text>
        
        {/* O → T edge */}
        <line x1="350" y1="145" x2="350" y2="170" stroke="#64748B" strokeWidth="1.5" />
        <text x="358" y="160" fontSize="8" fill="#64748B">t/g</text>
        
        {/* T and G nodes */}
        <circle cx="330" cy="170" r="12" fill={highlighted.includes('do_t') ? '#10B981' : '#475569'} style={{ opacity: highlighted.length > 0 && !highlighted.includes('do_t') ? 0.5 : 1 }} />
        <circle cx="370" cy="170" r="12" fill={highlighted.includes('do_g') ? '#10B981' : '#475569'} style={{ opacity: highlighted.length > 0 && !highlighted.includes('do_g') ? 0.5 : 1 }} />
        <text x="330" y="173" textAnchor="middle" fill="white" fontSize="8">t</text>
        <text x="370" y="173" textAnchor="middle" fill="white" fontSize="8">g</text>
      </g>
      
      {/* Apple under A from root */}
      <line x1="250" y1="45" x2="50" y2="130" stroke="#64748B" strokeWidth="1.5" />
      <text x="145" y="100" fontSize="8" fill="#64748B">a</text>
      
      {/* A → P → P → L → E path for "apple" */}
      <circle cx="50" cy="130" r="15" fill="#475569" />
      <text x="50" y="134" textAnchor="middle" fill="white" fontSize="10">a</text>
      
      {/* Apple continues... */}
    </svg>
  );
}

// ==================== UNION FIND VISUALIZER ====================
export function UnionFindVisualizer({ data, step, isPlaying }) {
  const { sets, operations, connected, parents, ranks } = data;
  const [highlighted, setHighlighted] = useState([]);
  const [action, setAction] = useState(null);
  const [showParents, setShowParents] = useState(false);
  
  useEffect(() => {
    if (step !== undefined) {
      const currentStep = data.animationSteps?.[step];
      if (currentStep) {
        setHighlighted(currentStep.highlight || []);
        setAction(currentStep.action || null);
        setShowParents(currentStep.showParents || false);
      }
    }
  }, [step, data]);
  
  const defaultParents = [0, 1, 2, 3, 4];
  const displayParents = parents || defaultParents;
  
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="flex gap-4">
        {Array(sets || 5).fill(0).map((_, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className={`
                w-16 h-16 rounded-full flex items-center justify-center text-white font-mono font-bold transition-all duration-500
                ${highlighted.includes(idx) 
                  ? action === 'union' ? 'bg-emerald-500 scale-110 ring-4 ring-emerald-300'
                    : action === 'find' ? 'bg-blue-500 scale-105 ring-4 ring-blue-300'
                    : action === 'connected' ? 'bg-amber-500 scale-105 ring-4 ring-amber-300'
                    : 'bg-teal-600'
                  : 'bg-slate-600'}
              `}
            >
              {idx}
            </div>
            {showParents && (
              <div className="mt-2 text-xs text-slate-400">
                parent: {displayParents[idx]}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Sets visualization */}
      <div className="flex gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-400">Set 1: {highlighted.includes(0) && highlighted.includes(1) ? '{0, 1}' : '{0}'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500" />
          <span className="text-sm text-slate-400">Set 2: {highlighted.includes(2) && highlighted.includes(3) ? '{2, 3}' : '{2}'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-500" />
          <span className="text-sm text-slate-400">Set 3: {highlighted.includes(4) ? '{4}' : '{3}'}</span>
        </div>
      </div>
      
      {action && (
        <Badge variant="outline">{action.toUpperCase()}</Badge>
      )}
    </div>
  );
}

// ==================== VISUALIZER CONTROLLER ====================
export default function VisualizerController({ type, data, autoPlay = false }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  
  const steps = data.animationSteps || [];
  
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, speed, steps.length]);
  
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleNext = () => {
    setCurrentStep(prev => (prev + 1) % steps.length);
  };
  const handlePrev = () => {
    setCurrentStep(prev => (prev - 1 + steps.length) % steps.length);
  };
  
  const currentStepData = steps[currentStep];
  
  const renderVisualizer = () => {
    switch (type) {
      case 'array':
        return <ArrayVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'stack':
        return <StackVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'queue':
        return <QueueVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'linkedlist':
        return <LinkedListVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'hashtable':
        return <HashTableVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'heap':
        return <HeapVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'bst':
        return <BSTVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'graph':
        return <GraphVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'trie':
        return <TrieVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'unionfind':
        return <UnionFindVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
      case 'sorting':
      case 'bubblesort':
      case 'selectionsort':
      case 'insertionsort':
      case 'mergesort':
      case 'quicksort':
      case 'heapsort':
        return <SortingVisualizerController type={type} data={data} step={currentStep} isPlaying={isPlaying} />;
      default:
        return <ArrayVisualizer data={data} step={currentStep} isPlaying={isPlaying} />;
    }
  };
  
  return (
    <Card className="border-slate-200 bg-slate-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-300 flex items-center justify-between">
          <span>Interactive Visualization</span>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleReset}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrev}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePlayPause}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderVisualizer()}
        
        {currentStepData && (
          <div className="mt-4 p-3 rounded-lg bg-slate-800">
            <p className="text-sm text-slate-300">
              <span className="text-emerald-400 font-medium">Step {currentStep + 1}:</span> {currentStepData.description}
            </p>
          </div>
        )}
        
        {steps.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Progress</span>
              <span>{currentStep + 1} / {steps.length}</span>
            </div>
            <Progress 
              value={(currentStep + 1) / steps.length * 100} 
              className="h-2 bg-slate-700"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
