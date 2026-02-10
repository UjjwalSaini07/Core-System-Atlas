'use client';

import { useEffect, useState, useCallback } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { FileList } from '@/components/FileList';
import { SystemStats } from '@/components/SystemStats';
import { CodeFetch } from '@/components/CodeFetch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Info, Keyboard, X, BarChart2, BookOpen, Network, Server } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  const [files, setFiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [lastQuery, setLastQuery] = useState('');
  const [cacheHit, setCacheHit] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeTab, setActiveTab] = useState('search');

  /* ---------------- Data Fetching ---------------- */
  const fetchFiles = useCallback(async (storageType = 'tmp') => {
    try {
      const res = await fetch(`http://localhost:3001/api/files?storageType=${storageType}`);
      const json = await res.json();
      if (json.success) setFiles(json.files);
    } catch {
      console.warn('Files unavailable – offline mode');
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/stats');
      const json = await res.json();
      if (json.success) {
        setStats(json);
        // Refresh files with current storage mode
        fetchFiles(json.currentStorageMode);
      }
    } catch {
      console.warn('Stats unavailable – offline mode');
    }
  }, [fetchFiles]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/health');
        if (res.ok) {
          // First get the current storage mode
          const modeRes = await fetch('http://localhost:3001/api/storage/mode');
          if (modeRes.ok) {
            const modeData = await modeRes.json();
            const mode = modeData.mode || 'tmp';
            // Fetch files and stats with correct storage mode
            await Promise.all([fetchFiles(mode), fetchStats()]);
          } else {
            await Promise.all([fetchFiles(), fetchStats()]);
          }
        }
      } catch {
        console.info('Backend not running – offline mode');
      }
      setLoading(false);
    };

    init();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [fetchFiles, fetchStats]);

  /* ---------------- Keyboard Shortcut ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.querySelector('input[placeholder*="Search"]')?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  /* ---------------- Actions ---------------- */
  const handleFileUploaded = async (file) => {
    setFiles((prev) => [...prev, file]);
    await fetchStats();
    setActiveTab('files');
  };

  const handleSearch = (results, hit) => {
    setSearchResults(results);
    setCacheHit(hit);
    if (results.length > 0) setLastQuery(results[0]?.filename || '');
  };

  const handleDeleteFile = (fileId) => {
    toast({
      title: 'Delete file?',
      description: 'This action cannot be undone.',
      variant: 'warning',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            await fetch(`http://localhost:3001/api/files/${fileId}`, {
              method: 'DELETE',
            });
          } catch {}
          setFiles((prev) => prev.filter((f) => f.id !== fileId));
          fetchStats();
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Toaster />

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/mainLogo.png" alt="Core System Atlas" width={40} height={40} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">Search System</h1>
              <p className="text-sm text-slate-500">
                File indexing, search, and caching
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/visualize">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <Network className="w-4 h-4 mr-2" />
                Visualizer
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <BarChart2 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-black"
              onClick={() => {
                fetchFiles();
                fetchStats();
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link href="/monitoring">
              <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-black">Monitoring</Button>
            </Link>
            <Link href="/systems">
              <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-200 hover:border-slate-400 hover:text-black">
                <Server className="w-4 h-4 mr-2" />
                Systems
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* System Stats */}
        {stats && <SystemStats stats={stats} />}

        {/* Info */}
        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex gap-3 text-sm">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-600" />
            <div>
              <p className="text-slate-700">
                Files are indexed automatically using an inverted index and cached
                with an LRU strategy for fast repeated searches.
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <Keyboard className="w-3 h-3" />
                Press Ctrl / Cmd + K to focus search
              </div>
            </div>
          </div>
        </Card>

        {/* Main Work Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full bg-slate-100 border border-slate-200">
            <TabsTrigger value="search" className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">Search</TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-white data-[state=active]:text-teal-700 data-[state=active]:shadow-sm">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FileUpload onFileUploaded={handleFileUploaded} isLoading={loading} />
              <div className="space-y-6">
                <SearchBar onSearch={handleSearch} isLoading={loading} />
                <SearchResults
                  results={searchResults}
                  cacheHit={cacheHit}
                  query={lastQuery}
                  onView={setSelectedFile}
                />
                <CodeFetch onView={setSelectedFile} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FileList
              files={files}
              onDelete={handleDeleteFile}
              onView={setSelectedFile}
            />
          </TabsContent>
        </Tabs>

        {/* File Inspector */}
        {selectedFile && (
          <Card className="p-6 border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-slate-900">{selectedFile.filename}</h3>
                <p className="text-xs text-slate-500">
                  Version {selectedFile.version} · {selectedFile.wordCount} words
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="text-slate-400 hover:text-slate-600"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <pre className="text-sm whitespace-pre-wrap font-mono text-slate-700 bg-slate-50 rounded-lg p-4">
              {selectedFile.content || selectedFile.preview}
            </pre>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 mt-12 text-sm text-slate-500 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>
              Backend: LRU Cache · Trie · Inverted Index
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
              Graph · Heap · Segment Tree · Union-Find · BIT 
            </span>
            <span className="text-xs text-slate-600">
              ~ujjwals07 
            </span>
          </div>
          <span>
            {stats ? 'Connected' : loading ? 'Connecting…' : 'Offline Mode'}
          </span>
        </div>
      </footer>
    </main>
  );
}
