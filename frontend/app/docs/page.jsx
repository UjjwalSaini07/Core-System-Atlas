'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Code, Copy, Check, Play, Pause, ChevronRight, Layers, Zap, Shield, Network, Database, Lock, Search, RefreshCw, Globe, Cpu, HardDrive, TrendingUp, Activity, Eye, Target, Lightbulb, AlertCircle, CheckCircle, Clock, Brain, TreeDeciduous, GitBranch, Hash, List, FileText, BarChart2, Box, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import VisualizerController from './visualizations/Visualizers';

// Import from organized data folder
import { DATA_STRUCTURES, ALGORITHMS, DISTRIBUTED_PATTERNS } from './data/structures';

// Import codes
import { CODE_EXAMPLES } from './codes/codes';

export default function DocsPage() {
  const [activeCategory, setActiveCategory] = useState('datastructures');
  const [selectedItem, setSelectedItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const categories = [
    { id: 'datastructures', name: 'Data Structures', icon: Database, count: Object.keys(DATA_STRUCTURES).length },
    { id: 'algorithms', name: 'Algorithms', icon: Code, count: Object.keys(ALGORITHMS).length },
    { id: 'distributed', name: 'Distributed Patterns', icon: Network, count: Object.keys(DISTRIBUTED_PATTERNS).length },
    { id: 'complexity', name: 'Complexity Cheat Sheet', icon: BarChart2, count: 7 }
  ];

  const allItems = { ...DATA_STRUCTURES, ...ALGORITHMS, ...DISTRIBUTED_PATTERNS };

  const copyCode = (codeId) => {
    const code = CODE_EXAMPLES[codeId];
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(codeId);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setAnimationStep(0);
    setIsPlaying(false);
  };

  // Auto-advance animation
  useEffect(() => {
    if (isPlaying && selectedItem) {
      const item = allItems[selectedItem];
      const steps = item.animationSteps?.length || 0;
      if (steps > 0) {
        const timer = setTimeout(() => {
          setAnimationStep(prev => (prev + 1) % steps);
        }, animationSpeed);
        return () => clearTimeout(timer);
      }
    }
  }, [isPlaying, animationStep, animationSpeed, selectedItem]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Core System Atlas Docs
              </h1>
              <p className="text-sm text-slate-500">
                Comprehensive guide to data structures, algorithms, and distributed systems
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-teal-300 text-teal-600 bg-teal-50">
              {categories.reduce((acc, cat) => acc + cat.count, 0)} Topics
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar - Categories */}
          <div className="col-span-3 space-y-4">
            <Card className="sticky top-24 border-slate-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-700">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        if (cat.id === 'complexity') {
                          setSelectedItem(null);
                        } else {
                          const items = cat.id === 'datastructures' ? DATA_STRUCTURES :
                                       cat.id === 'algorithms' ? ALGORITHMS :
                                       DISTRIBUTED_PATTERNS;
                          setSelectedItem(Object.keys(items)[0]);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all ${
                        activeCategory === cat.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {cat.name}
                      </div>
                      <Badge variant="secondary" className={`text-xs ${activeCategory === cat.id ? 'bg-teal-500 text-white' : 'bg-gray-500'}`}>
                        {cat.count}
                      </Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Items List */}
            {activeCategory !== 'complexity' && (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-slate-700">
                    {categories.find(c => c.id === activeCategory)?.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 max-h-96 overflow-y-auto">
                  {(() => {
                    const items = activeCategory === 'datastructures' ? DATA_STRUCTURES :
                                 activeCategory === 'algorithms' ? ALGORITHMS :
                                 DISTRIBUTED_PATTERNS;
                    return Object.entries(items).map(([key, value]) => {
                      const Icon = value.icon;
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedItem(key)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                            selectedItem === key
                              ? 'bg-teal-100 text-teal-700 border border-teal-200'
                              : 'hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="truncate">{value.name}</span>
                        </button>
                      );
                    });
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {activeCategory === 'complexity' ? (
              <ComplexityCheatSheet />
            ) : selectedItem ? (
              <ItemDetail 
                item={allItems[selectedItem]} 
                itemId={selectedItem}
                animationStep={animationStep}
                setAnimationStep={setAnimationStep}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
                handlePlayPause={handlePlayPause}
                handleReset={handleReset}
                copyCode={copyCode}
                copied={copied}
              />
            ) : (
              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center text-slate-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                    <p className="text-lg font-medium">Select a topic to learn</p>
                    <p className="text-sm">Choose from the sidebar to explore</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== ITEM DETAIL COMPONENT ====================
function ItemDetail({ 
  item, 
  itemId,
  animationStep, 
  setAnimationStep,
  isPlaying,
  setIsPlaying,
  animationSpeed,
  setAnimationSpeed,
  handlePlayPause,
  handleReset,
  copyCode,
  copied 
}) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showFullCode, setShowFullCode] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'visualization', name: 'Visualization', icon: Play },
    { id: 'code', name: 'Code', icon: Code },
    { id: 'complexity', name: 'Complexity', icon: BarChart2 }
  ];

  const code = CODE_EXAMPLES[itemId];

  const currentStepData = item.animationSteps?.[animationStep];

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg">
            {/* Dynamic icon based on icon name */}
            {getIconComponent(item.icon, "w-6 h-6 text-white")}
          </div>
          <div>
            <CardTitle className="text-xl text-slate-900">{item.name}</CardTitle>
            <Badge variant="outline" className="mt-1 border-teal-200 text-teal-600 bg-teal-50">{item.category}</Badge>
          </div>
        </div>
        <CardDescription className="text-slate-500 mt-2 text-base">{item.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 border border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Strengths & Weaknesses */}
            {item.strengths && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-semibold text-emerald-800">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {item.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h4 className="font-semibold text-amber-800">Weaknesses</h4>
                  </div>
                  <ul className="space-y-2">
                    {item.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Use Cases */}
            {item.useCases && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-600" />
                  Real-World Use Cases
                </h4>
                <div className="flex flex-wrap gap-2">
                  {item.useCases.map((use, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Steps / How It Works */}
            {item.steps && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  How It Works
                </h4>
                <div className="space-y-3">
                  {item.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-sm font-bold text-white">{i + 1}</span>
                      </div>
                      <p className="text-sm text-slate-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* When To Use / Not Use */}
            {item.whenToUse && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200">
                  <h4 className="font-semibold text-teal-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    When to Use
                  </h4>
                  <ul className="space-y-2">
                    {item.whenToUse.map((w, i) => (
                      <li key={i} className="text-sm text-teal-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    When NOT to Use
                  </h4>
                  <ul className="space-y-2">
                    {item.whenNotToUse?.map((w, i) => (
                      <li key={i} className="text-sm text-red-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Distributed Pattern Details */}
            {item.algorithms && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Algorithms & Strategies</h4>
                <div className="grid gap-3">
                  {item.algorithms.map((algo, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
                      <h5 className="font-medium text-slate-800">{algo.name}</h5>
                      <p className="text-sm text-slate-500 mt-1">{algo.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Circuit Breaker States */}
            {item.states && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Circuit States</h4>
                <div className="grid grid-cols-3 gap-3">
                  {item.states.map((state, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${
                      state.name === 'CLOSED' ? 'bg-emerald-50 border-emerald-200' :
                      state.name === 'OPEN' ? 'bg-red-50 border-red-200' :
                      'bg-amber-50 border-amber-200'
                    }`}>
                      <Badge className={`mb-2 ${
                        state.name === 'CLOSED' ? 'bg-emerald-500' :
                        state.name === 'OPEN' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`}>{state.name}</Badge>
                      <p className="text-sm text-slate-600">{state.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Formula */}
            {item.formula && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
                <h4 className="font-semibold text-indigo-800 mb-2">Formula</h4>
                <code className="text-lg font-mono text-indigo-700 bg-white px-4 py-2 rounded-lg border border-indigo-200">
                  {item.formula}
                </code>
              </div>
            )}
          </TabsContent>

          {/* Visualization Tab */}
          <TabsContent value="visualization" className="mt-6">
            {/* Animation Controls */}
            <div className="flex items-center justify-between mb-4 p-4 rounded-xl bg-slate-100 border border-slate-200">
              <div className="flex items-center gap-4">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleReset}
                  className="border-slate-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setAnimationStep(prev => Math.max(0, prev - 1));
                  }}
                  className="border-slate-300"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
                <Button
                  size="icon"
                  variant="default"
                  onClick={handlePlayPause}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    const steps = item.animationSteps?.length || 0;
                    setAnimationStep(prev => (prev + 1) % steps);
                  }}
                  className="border-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">Speed:</span>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={([value]) => setAnimationSpeed(value)}
                  min={200}
                  max={2000}
                  step={100}
                  className="w-32"
                />
              </div>
            </div>

            {/* Animation Step Info */}
            {currentStepData && (
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm opacity-80">Step {animationStep + 1} of {item.animationSteps?.length}</span>
                    <p className="font-medium mt-1">{currentStepData.description}</p>
                  </div>
                  <div className="w-24">
                    <Progress 
                      value={(animationStep + 1) / (item.animationSteps?.length || 1) * 100} 
                      className="h-2 bg-white/30" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Visualizer */}
            {item.visualization && (
              <VisualizerController
                type={item.visualization.type}
                data={item.visualization}
                autoPlay={isPlaying}
              />
            )}
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="mt-6">
            <div className="relative">
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge variant="outline" className="bg-slate-100">
                  {item.codeId || itemId}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => copyCode(item.codeId || itemId)}
                  className="h-8 w-8"
                >
                  {copied === (item.codeId || itemId) ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-500" />
                  )}
                </Button>
              </div>
              <ScrollArea className="h-[500px] rounded-xl border border-slate-200">
                <pre className="text-sm p-6 bg-gradient-to-br from-slate-900 to-slate-800 overflow-x-auto">
                  <code className="text-sm text-slate-100 font-mono leading-relaxed">
                    {code || '// Code example not available'}
                  </code>
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Complexity Tab */}
          <TabsContent value="complexity" className="mt-6">
            {/* Time Complexity */}
            {item.timeComplexity && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Time Complexity
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(item.timeComplexity).map(([op, time]) => (
                    <div key={op} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-sm font-medium text-slate-700 capitalize">{op}</span>
                      <Badge className={
                        time.includes('O(1)') ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                        time.includes('O(log') ? 'bg-teal-100 text-teal-700 border-teal-300' :
                        time.includes('O(n²)') || time.includes('O(2ⁿ') ? 'bg-amber-100 text-amber-700 border-amber-300' :
                        'bg-slate-100 text-slate-700 border-slate-300'
                      }>{time}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Space Complexity */}
            {item.spaceComplexity && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-teal-600" />
                  Space Complexity
                </h4>
                <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white">
                  {item.spaceComplexity}
                </Badge>
              </div>
            )}

            {/* Stability & In-Place */}
            {item.stable !== undefined && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Stable Sort</span>
                  {item.stable ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Yes</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-300">No</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">In-Place</span>
                  {item.inplace ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">Yes</Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-300">No</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {item.prerequisites && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">Prerequisites</h4>
                <div className="flex flex-wrap gap-2">
                  {item.prerequisites.map((p, i) => (
                    <Badge key={i} variant="outline" className="px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-300">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics for distributed patterns */}
            {item.metrics && (
              <div className="mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">Key Metrics</h4>
                <div className="grid grid-cols-3 gap-3">
                  {item.metrics.map((m, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 text-center">
                      <p className="text-sm font-medium text-teal-700">{m}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ==================== COMPLEXITY CHEAT SHEET ====================
function ComplexityCheatSheet() {
  const complexities = [
    { notation: 'O(1)', name: 'Constant', description: 'Always same time', color: 'emerald', examples: ['Array access', 'Hash table lookup', 'Push/Pop stack'], height: 8 },
    { notation: 'O(log n)', name: 'Logarithmic', description: 'Divides problem each step', color: 'teal', examples: ['Binary search', 'BST operations', 'Binary heap'], height: 24 },
    { notation: 'O(n)', name: 'Linear', description: 'Grows with input size', color: 'blue', examples: ['Linear search', 'Array traversal', 'Simple loop'], height: 48 },
    { notation: 'O(n log n)', name: 'Linearithmic', description: 'Efficient sorting', color: 'indigo', examples: ['Merge sort', 'Quick sort (avg)', 'Heap sort'], height: 64 },
    { notation: 'O(n²)', name: 'Quadratic', description: 'Nested loops', color: 'amber', examples: ['Bubble sort', 'Selection sort', 'Matrix ops'], height: 96 },
    { notation: 'O(2ⁿ)', name: 'Exponential', description: 'Doubles each step', color: 'orange', examples: ['Fibonacci (rec)', 'Subset generation', 'TSP (brute)'], height: 120 },
    { notation: 'O(n!)', name: 'Factorial', description: 'Grows extremely fast', color: 'red', examples: ['Permutations', 'TSP (all)', 'Brute force'], height: 144 }
  ];

  const colorClasses = {
    emerald: 'bg-emerald-500',
    teal: 'bg-teal-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    amber: 'bg-amber-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-teal-600" />
          Time Complexity Cheat Sheet
        </CardTitle>
        <CardDescription className="text-slate-500">
          Quick reference for common algorithm complexities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complexities.map((c) => (
            <div key={c.notation} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition-colors">
              <div className="w-24 py-2 px-4 rounded-lg text-center font-mono font-bold text-sm bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-sm">
                {c.notation}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-slate-800">{c.name}</h4>
                  <Badge variant="outline" className="text-xs">{c.description}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {c.examples.map((ex, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-teal-500">{ex}</Badge>
                  ))}
                </div>
              </div>
              <div className="w-20 h-24 bg-slate-100 rounded-lg flex items-end justify-center p-1">
                <div 
                  className={`w-full rounded ${colorClasses[c.color]}`} 
                  style={{ height: `${c.height}%`, transition: 'height 0.3s' }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reference Table */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800">
          <h4 className="font-semibold text-white mb-4">Operations by Data Structure</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 px-3 text-slate-300 font-medium">Data Structure</th>
                  <th className="text-center py-2 px-3 text-slate-300 font-medium">Access</th>
                  <th className="text-center py-2 px-3 text-slate-300 font-medium">Search</th>
                  <th className="text-center py-2 px-3 text-slate-300 font-medium">Insert</th>
                  <th className="text-center py-2 px-3 text-slate-300 font-medium">Delete</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                {[
                  { ds: 'Array', a: 'O(1)', s: 'O(n)', i: 'O(n)', d: 'O(n)' },
                  { ds: 'Linked List', a: 'O(n)', s: 'O(n)', i: 'O(1)', d: 'O(1)' },
                  { ds: 'Hash Table', a: '-', s: 'O(1) avg', i: 'O(1) avg', d: 'O(1) avg' },
                  { ds: 'BST', a: 'O(log n)', s: 'O(log n)', i: 'O(log n)', d: 'O(log n)' },
                  { ds: 'B-Tree', a: 'O(log n)', s: 'O(log n)', i: 'O(log n)', d: 'O(log n)' },
                  { ds: 'Heap', a: '-', s: 'O(n)', i: 'O(log n)', d: 'O(log n)' },
                  { ds: 'Trie', a: 'O(m)', s: 'O(m)', i: 'O(m)', d: 'O(m)' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-700">
                    <td className="py-2 px-3 font-medium text-white">{row.ds}</td>
                    <td className="py-2 px-3 text-center">{row.a}</td>
                    <td className="py-2 px-3 text-center">{row.s}</td>
                    <td className="py-2 px-3 text-center">{row.i}</td>
                    <td className="py-2 px-3 text-center">{row.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== HELPER: GET ICON COMPONENT ====================
function getIconComponent(iconName, className) {
  const icons = {
    List: List,
    Layers: Layers,
    Hash: Hash,
    RefreshCw: RefreshCw,
    TreeDeciduous: TreeDeciduous,
    Network: Network,
    GitBranch: GitBranch,
    Globe: Globe,
    Brain: Brain,
    Code: Code,
    Search: Search,
    Shield: Shield,
    Zap: Zap,
    Lock: Lock,
    Database: Database,
    BarChart2: BarChart2,
  };
  
  const Icon = icons[iconName] || List;
  return <Icon className={className} />;
}
