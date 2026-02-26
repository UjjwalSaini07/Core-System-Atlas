'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowDown, ArrowUp, ArrowLeft, RotateCcw, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// ==================== SORTING VISUALIZER ====================
export function SortingVisualizer({ data, step, isPlaying, speed = 1000 }) {
  const { values, algorithm = 'bubble', highlight = [], sorted = [], swapping = [], comparing = [], action = null, pivot = null, minIndex = null, shifting = [], leftArr = [], rightArr = [], mergedArr = [] } = data;
  
  // Get current step data from animationSteps
  const [currentHighlight, setCurrentHighlight] = useState([]);
  const [currentSorted, setCurrentSorted] = useState([]);
  const [currentSwapping, setCurrentSwapping] = useState([]);
  const [currentComparing, setCurrentComparing] = useState([]);
  const [currentAction, setCurrentAction] = useState(null);
  const [currentPivot, setCurrentPivot] = useState(null);
  const [currentMin, setCurrentMin] = useState(null);
  const [currentKey, setCurrentKey] = useState(null);
  const [currentMerge, setCurrentMerge] = useState({ left: [], right: [], merged: [] });
  const [currentShifting, setCurrentShifting] = useState([]);
  
  useEffect(() => {
    if (step !== undefined && data.animationSteps) {
      const currentStep = data.animationSteps[step];
      if (currentStep) {
        setCurrentHighlight(currentStep.highlight || []);
        setCurrentSorted(currentStep.sorted || []);
        setCurrentSwapping(currentStep.swapping || []);
        setCurrentComparing(currentStep.comparing || []);
        setCurrentAction(currentStep.action || null);
        setCurrentPivot(currentStep.pivot || null);
        setCurrentMin(currentStep.minIndex || null);
        setCurrentKey(currentStep.keyValue !== undefined ? currentStep.keyValue : null);
        setCurrentMerge(currentStep.mergeState || { left: [], right: [], merged: [] });
        setCurrentShifting(currentStep.shifting || []);
        
        // Also handle leftArr, rightArr, mergedArr directly from step
        if (currentStep.leftArr) {
          setCurrentMerge(prev => ({ ...prev, left: currentStep.leftArr }));
        }
        if (currentStep.rightArr) {
          setCurrentMerge(prev => ({ ...prev, right: currentStep.rightArr }));
        }
        if (currentStep.mergedArr) {
          setCurrentMerge(prev => ({ ...prev, merged: currentStep.mergedArr }));
        }
      }
    }
  }, [step, data]);
  
  // Use step-based state or prop state
  const displayHighlight = highlight.length > 0 ? highlight : currentHighlight;
  const displaySorted = sorted.length > 0 ? sorted : currentSorted;
  const displaySwapping = swapping.length > 0 ? swapping : currentSwapping;
  const displayComparing = comparing.length > 0 ? comparing : currentComparing;
  const displayAction = action || currentAction;
  const displayPivot = pivot !== null ? pivot : currentPivot;
  const displayMin = minIndex !== null ? minIndex : currentMin;
  const displayKey = currentKey;
  const displayShifting = shifting.length > 0 ? shifting : currentShifting;
  const displayMerge = currentMerge;
  
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Array Visualization */}
      <div className="flex items-end justify-center gap-1 min-h-[200px]">
        {values.map((value, index) => {
          const isComparing = displayComparing.includes(index);
          const isSwapping = displaySwapping.includes(index);
          const isSorted = displaySorted.includes(index);
          const isHighlighted = displayHighlight.includes(index);
          const isPivot = displayPivot === index;
          const isMin = displayMin === index;
          const isKey = displayKey !== null && displayKey.index === index;
          
          let bgColor = 'bg-slate-600';
          let scale = 'scale-100';
          let shadow = '';
          let ring = '';
          
          if (isSorted) {
            bgColor = 'bg-emerald-500';
          } else if (isSwapping) {
            bgColor = 'bg-red-500';
            scale = 'scale-110';
            shadow = 'shadow-lg';
            ring = 'ring-4 ring-red-300';
          } else if (displayShifting.includes(index)) {
            bgColor = 'bg-orange-500';
            scale = 'scale-105';
            ring = 'ring-4 ring-orange-300';
          } else if (isPivot) {
            bgColor = 'bg-purple-500';
            scale = 'scale-105';
            ring = 'ring-4 ring-purple-300';
          } else if (isComparing) {
            bgColor = 'bg-amber-500';
            scale = 'scale-105';
            ring = 'ring-4 ring-amber-300';
          } else if (isMin) {
            bgColor = 'bg-blue-500';
            scale = 'scale-110';
            ring = 'ring-4 ring-blue-300';
          } else if (isKey) {
            bgColor = 'bg-cyan-500';
            scale = 'scale-105';
            ring = 'ring-4 ring-cyan-300';
          } else if (isHighlighted) {
            bgColor = 'bg-teal-500';
          }
          
          return (
            <div key={index} className="flex flex-col items-center">
              {/* Value indicator for key element */}
              {isKey && (
                <div className="mb-1 text-xs text-cyan-400 font-medium flex items-center gap-1">
                  <ArrowDown className="w-3 h-3" />
                  key: {displayKey?.value}
                </div>
              )}
              
              <div
                className={`
                  w-12 rounded-lg flex items-center justify-center text-white font-mono text-lg font-bold 
                  transition-all duration-300 ${bgColor} ${scale} ${shadow} ${ring}
                `}
                style={{
                  height: `${Math.max(40, value * 4)}px`,
                }}
              >
                {value}
              </div>
              
              <span className={`
                text-xs mt-2 font-mono
                ${isSorted ? 'text-emerald-500 font-bold' : 
                  isSwapping ? 'text-red-500 font-bold' : 
                  isComparing ? 'text-amber-500 font-bold' : 
                  isPivot ? 'text-purple-500 font-bold' :
                  isMin ? 'text-blue-500 font-bold' :
                  'text-slate-400'}
              `}>
                [{index}]
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Action Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-xs text-slate-400">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-xs text-slate-400">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-xs text-slate-400">Sorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-purple-500" />
          <span className="text-xs text-slate-400">Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500" />
          <span className="text-xs text-slate-400">Min/Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-cyan-500" />
          <span className="text-xs text-slate-400">Key Element</span>
        </div>
        {displayShifting.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-500" />
            <span className="text-xs text-slate-400">Shifting</span>
          </div>
        )}
        {displayMerge.left.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500" />
            <span className="text-xs text-slate-400">Left Subarray</span>
          </div>
        )}
        {displayMerge.right.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500" />
            <span className="text-xs text-slate-400">Right Subarray</span>
          </div>
        )}
      </div>
      
      {displayMerge.left.length > 0 && (
        <div className="flex gap-8 mt-4 p-4 rounded-xl bg-slate-800 border border-slate-700">
          {/* Left subarray */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-amber-400 font-medium mb-2">Left</span>
            <div className="flex gap-1">
              {displayMerge.left.map((value, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white font-mono text-sm font-bold"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right subarray */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-blue-400 font-medium mb-2">Right</span>
            <div className="flex gap-1">
              {displayMerge.right.map((value, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-mono text-sm font-bold"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex items-center">
            <ArrowRight className="w-6 h-6 text-slate-500" />
          </div>
          
          {/* Merged result */}
          {displayMerge.merged.length > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-emerald-400 font-medium mb-2">Merged</span>
              <div className="flex gap-1">
                {displayMerge.merged.map((value, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white font-mono text-sm font-bold"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Algorithm Info */}
      {displayAction && (
        <Badge variant="outline" className="text-sm px-4 py-2 bg-slate-800 text-slate-200 border-slate-600">
          {getAlgorithmActionLabel(displayAction)}
        </Badge>
      )}
    </div>
  );
}

function getAlgorithmActionLabel(action) {
  const labels = {
    compare: '🔍 Comparing elements',
    swap: '🔄 Swapping elements',
    sorted: '✅ Element in final position',
    pivot: '🎯 Pivot selected',
    findMin: '🔎 Finding minimum',
    key: '🔑 Current key element',
    shift: '➡️ Shifting elements',
    insert: '📥 Inserting element',
    divide: '✂️ Dividing array',
    merge: '🔀 Merging subarrays',
    heapify: '🏗️ Heapifying',
    extract: '📤 Extracting max',
    partition: '📊 Partitioning'
  };
  return labels[action] || action.toUpperCase();
}

// ==================== MERGE SORT VISUALIZER ====================
export function MergeSortVisualizer({ data, step }) {
  const { values = [], animationSteps = [] } = data;
  
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { highlight = [], comparing = [], merging = [], sorted = [], leftArr = [], rightArr = [], mergedArr = [] } = currentStep;
  
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Main array */}
      <div className="flex items-end justify-center gap-1">
        {values.map((value, index) => {
          const isComparing = comparing.includes(index);
          const isMerging = merging.includes(index);
          const isSorted = sorted.includes(index);
          const isHighlighted = highlight.includes(index);
          
          let bgColor = 'bg-slate-600';
          let scale = 'scale-100';
          let ring = '';
          
          if (isSorted) {
            bgColor = 'bg-emerald-500';
          } else if (isMerging) {
            bgColor = 'bg-blue-500';
            scale = 'scale-105';
            ring = 'ring-4 ring-blue-300';
          } else if (isComparing) {
            bgColor = 'bg-amber-500';
            scale = 'scale-105';
            ring = 'ring-4 ring-amber-300';
          } else if (isHighlighted) {
            bgColor = 'bg-teal-500';
          }
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`
                  w-10 rounded-lg flex items-center justify-center text-white font-mono text-lg font-bold 
                  transition-all duration-300 ${bgColor} ${scale} ${ring}
                `}
                style={{
                  height: `${Math.max(30, value * 3.5)}px`,
                }}
              >
                {value}
              </div>
              <span className="text-xs mt-1 text-slate-400">[{index}]</span>
            </div>
          );
        })}
      </div>
      
      {/* Subarrays visualization during merge */}
      {(leftArr.length > 0 || rightArr.length > 0) && (
        <div className="flex gap-8 mt-4">
          {/* Left subarray */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-amber-400 mb-2">Left</span>
            <div className="flex gap-1">
              {leftArr.map((value, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white font-mono text-sm"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right subarray */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-blue-400 mb-2">Right</span>
            <div className="flex gap-1">
              {rightArr.map((value, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center text-white font-mono text-sm"
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          
          {/* Merged result */}
          {mergedArr.length > 0 && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-emerald-400 mb-2">Merged</span>
              <div className="flex gap-1">
                {mergedArr.map((value, idx) => (
                  <div
                    key={idx}
                    className="w-8 h-8 rounded bg-emerald-500 flex items-center justify-center text-white font-mono text-sm"
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          )}
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

// ==================== HEAP SORT VISUALIZER ====================
export function HeapSortVisualizer({ data, step }) {
  const { values = [], animationSteps = [] } = data;
  
  const [currentStep, setCurrentStep] = useState({});
  
  useEffect(() => {
    if (step !== undefined && animationSteps[step]) {
      setCurrentStep(animationSteps[step]);
    }
  }, [step, animationSteps]);
  
  const { highlight = [], swapping = [], heapifying = [], sorted = [], action = null } = currentStep;
  
  // Calculate tree positions
  const getTreePosition = (index) => {
    const level = Math.floor(Math.log2(index + 1));
    const positionInLevel = index - Math.pow(2, level) + 1;
    const maxInLevel = Math.pow(2, level);
    const spacing = 200 / (maxInLevel + 1);
    return {
      x: (positionInLevel + 1) * spacing,
      y: level * 60 + 40
    };
  };
  
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Tree representation */}
      <svg width="450" height="220" className="mx-auto">
        {/* Edges */}
        {values.map((_, index) => {
          const leftChild = 2 * index + 1;
          const rightChild = 2 * index + 2;
          const parent = getTreePosition(index);
          
          return (
            <g key={`edges-${index}`}>
              {leftChild < values.length && (
                <line
                  x1={parent.x} y1={parent.y}
                  x2={getTreePosition(leftChild).x} y2={getTreePosition(leftChild).y}
                  stroke={swapping.includes(index) || swapping.includes(leftChild) ? '#EF4444' : '#64748B'}
                  strokeWidth={swapping.includes(index) || swapping.includes(leftChild) ? 3 : 2}
                />
              )}
              {rightChild < values.length && (
                <line
                  x1={parent.x} y1={parent.y}
                  x2={getTreePosition(rightChild).x} y2={getTreePosition(rightChild).y}
                  stroke={swapping.includes(index) || swapping.includes(rightChild) ? '#EF4444' : '#64748B'}
                  strokeWidth={swapping.includes(index) || swapping.includes(rightChild) ? 3 : 2}
                />
              )}
            </g>
          );
        })}
        
        {/* Nodes */}
        {values.map((value, index) => {
          const pos = getTreePosition(index);
          const isSwapping = swapping.includes(index);
          const isHeapifying = heapifying.includes(index);
          const isSorted = sorted.includes(index);
          
          let fill = '#475569';
          if (isSorted) fill = '#10B981';
          else if (isSwapping) fill = '#EF4444';
          else if (isHeapifying) fill = '#F59E0B';
          
          return (
            <g key={index}>
              <circle
                cx={pos.x} cy={pos.y} r="20"
                fill={fill}
                className="transition-all duration-300"
                style={{
                  filter: isSwapping ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.8))' : 'none'
                }}
              />
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle" dy="4"
                fill="white" fontSize="12" fontWeight="bold"
              >
                {value}
              </text>
              <text
                x={pos.x} y={pos.y + 32}
                textAnchor="middle"
                fill="#94A3B8" fontSize="10"
              >
                [{index}]
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Array representation */}
      <div className="flex items-end justify-center gap-1 mt-2">
        {values.map((value, index) => {
          const isSorted = sorted.includes(index);
          const isSwapping = swapping.includes(index);
          const isHeapifying = heapifying.includes(index);
          
          let bgColor = 'bg-slate-600';
          if (isSorted) bgColor = 'bg-emerald-500';
          else if (isSwapping) bgColor = 'bg-red-500';
          else if (isHeapifying) bgColor = 'bg-amber-500';
          
          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 rounded flex items-center justify-center text-white font-mono text-lg font-bold transition-all ${bgColor}`}
                style={{
                  height: `${Math.max(25, value * 3)}px`,
                }}
              >
                {value}
              </div>
              <span className={`text-xs mt-1 ${isSorted ? 'text-emerald-500' : 'text-slate-400'}`}>
                [{index}]
              </span>
            </div>
          );
        })}
      </div>
      
      {currentStep.description && (
        <Badge variant="outline" className="bg-slate-800 text-slate-200">
          {currentStep.description}
        </Badge>
      )}
    </div>
  );
}

// ==================== CONTROLLER FOR ALL SORTING ====================
export default function SortingVisualizerController({ type, data, step, isPlaying }) {
  switch (type) {
    case 'mergesort':
      return <MergeSortVisualizer data={data} step={step} />;
    case 'heapsort':
      return <HeapSortVisualizer data={data} step={step} />;
    default:
      return <SortingVisualizer data={data} step={step} isPlaying={isPlaying} />;
  }
}
