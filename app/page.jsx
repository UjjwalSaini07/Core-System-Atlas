'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { FileList } from '@/components/FileList';
import { SystemStats } from '@/components/SystemStats';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Info, Keyboard, Sparkles } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

export default function Page() {
  const [files, setFiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [lastQuery, setLastQuery] = useState('');
  const [cacheHit, setCacheHit] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

  // Fetch files
  const fetchFiles = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:3001/api/files', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setFiles(result.files);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Fetch timeout - server may be slow');
      } else {
        console.warn('Server not available - showing demo mode');
      }
      // Don't show toast on initial load, just silently handle
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:3001/api/stats', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setStats(result);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Stats fetch timeout');
      }
      // Silently handle server not available
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // Check if server is available first
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const healthCheck = await fetch('http://localhost:3001/api/health', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (healthCheck.ok) {
          // Server is available, fetch data
          await Promise.all([fetchFiles(), fetchStats()]);
        }
      } catch (error) {
        console.log('Backend server not running - showing demo mode');
      }
      
      setLoading(false);
    };

    init();

    const interval = setInterval(() => {
      fetchStats();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchFiles, fetchStats]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]');
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFileUploaded = async (file) => {
    setFiles((prev) => [...prev, file]);
    await fetchStats();
    setActiveTab('files');
  };

  const handleSearch = (results, hit) => {
    setSearchResults(results);
    setCacheHit(hit);
    if (results.length > 0) {
      setLastQuery(results[0]?.filename || '');
    }
  };

  const handleDeleteFile = async (fileId) => {
    toast({
      title: 'Confirm Delete',
      description: 'Are you sure you want to delete this file?',
      variant: 'warning',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const response = await fetch(`http://localhost:3001/api/files/${fileId}`, {
              method: 'DELETE',
            });
            const result = await response.json();
            if (result.success) {
              setFiles((prev) => prev.filter((f) => f.id !== fileId));
              await fetchStats();
              toast({
                title: 'File Deleted',
                description: 'File has been removed',
                variant: 'success',
              });
            }
          } catch (error) {
            // Demo mode - remove locally
            console.log('Server not available, removing file locally');
            setFiles((prev) => prev.filter((f) => f.id !== fileId));
            toast({
              title: 'File Removed (Demo Mode)',
              description: 'File removed from local session',
              variant: 'success',
            });
          }
        },
      },
    });
  };

  const handleReset = async () => {
    toast({
      title: 'Confirm Reset',
      description: 'This will clear all files and reset the system. Continue?',
      variant: 'warning',
      action: {
        label: 'Reset System',
        onClick: async () => {
          try {
            await fetch('http://localhost:3001/api/reset', { method: 'POST' });
            setFiles([]);
            setSearchResults([]);
            setStats(null);
            toast({
              title: 'System Reset',
              description: 'All data has been cleared',
              variant: 'success',
            });
            await Promise.all([fetchFiles(), fetchStats()]);
          } catch (error) {
            // Demo mode - reset locally
            console.log('Server not available, resetting locally');
            setFiles([]);
            setSearchResults([]);
            setStats(null);
            toast({
              title: 'System Reset (Demo Mode)',
              description: 'All local data has been cleared',
              variant: 'success',
            });
          }
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Toaster for notifications */}
      <Toaster />

      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Scalable Systems Simulator
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">
                    Interactive search engine, cache, and file storage demo
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  fetchFiles();
                  fetchStats();
                }}
                variant="outline"
                className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <a href="/monitoring">
                <Button
                  variant="outline"
                  className="bg-blue-900/30 border-blue-700 text-blue-400 hover:bg-blue-900/50"
                >
                  Monitor
                </Button>
              </a>
              <Button
                onClick={handleReset}
                variant="outline"
                className="bg-red-900/30 border-red-700 text-red-400 hover:bg-red-900/50"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* System Stats */}
        {stats && <SystemStats stats={stats} />}

        {/* Info Card */}
        <Card className="p-4 bg-blue-900/20 border-blue-700/50">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">How it works:</p>
              <p>
                Upload text files to automatically index them. The search engine uses an inverted index for fast
                full-text search, a Trie for autocomplete, and an LRU cache with cache-aside pattern for optimal
                performance. All system operations are tracked in real-time.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-blue-700/30">
            <span className="text-xs text-blue-300/60 flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              Press Ctrl+K to focus search
            </span>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Upload Files', desc: 'Add documents to index', icon: '📁' },
            { title: 'Search', desc: 'Full-text search powered by inverted index', icon: '🔍' },
            { title: 'Monitor', desc: 'View real-time analytics', icon: '📊' },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="p-4 bg-slate-800/50 border-slate-700 hover:border-slate-600 cursor-pointer transition-all"
              onClick={() => idx === 1 && setActiveTab('search')}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger value="search" className="data-[state=active]:bg-slate-700">
              🔍 Search & Upload
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-slate-700">
              📁 File Browser
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FileUpload onFileUploaded={handleFileUploaded} isLoading={loading} />
                <SearchBar onSearch={handleSearch} isLoading={loading} />
              </div>
              <div>
                <SearchResults
                  results={searchResults}
                  cacheHit={cacheHit}
                  query={lastQuery}
                  onView={setSelectedFile}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FileList files={files} onDelete={handleDeleteFile} onView={setSelectedFile} />
          </TabsContent>
        </Tabs>

        {/* File Preview Modal */}
        {selectedFile && (
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-h-96 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {selectedFile.filename}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Version {selectedFile.version} • {selectedFile.wordCount} words
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
              {selectedFile.content || selectedFile.preview}
            </p>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 bg-slate-950/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              Backend running on port 3001 • Real data structures: LRU Cache, Trie, Inverted Index
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${stats ? 'bg-green-400' : loading ? 'bg-amber-400 animate-pulse' : 'bg-red-400'}`} />
                {stats ? 'Connected' : loading ? 'Connecting...' : 'Demo Mode'}
              </span>
              {stats && (
                <>
                  <span>{files.length} files</span>
                  <span>{stats?.searchEngine?.searches || 0} searches</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
