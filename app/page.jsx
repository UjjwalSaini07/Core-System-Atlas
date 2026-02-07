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
import { RefreshCw, Info, Keyboard, X } from 'lucide-react';
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

  /* ---------------- Data Fetching ---------------- */
  const fetchFiles = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:3001/api/files');
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
      if (json.success) setStats(json);
    } catch {
      console.warn('Stats unavailable – offline mode');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/health');
        if (res.ok) {
          await Promise.all([fetchFiles(), fetchStats()]);
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
    <main className="min-h-screen bg-background">
      <Toaster />

      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Search System</h1>
            <p className="text-sm text-muted-foreground">
              File indexing, search, and caching
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                fetchFiles();
                fetchStats();
              }}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <a href="/monitoring">
              <Button variant="outline">Monitoring</Button>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* System Stats */}
        {stats && <SystemStats stats={stats} />}

        {/* Info */}
        <Card className="p-4">
          <div className="flex gap-3 text-sm text-muted-foreground">
            <Info className="w-4 h-4 mt-0.5" />
            <div>
              Files are indexed automatically using an inverted index and cached
              with an LRU strategy for fast repeated searches.
              <div className="mt-2 flex items-center gap-2 text-xs">
                <Keyboard className="w-3 h-3" />
                Press Ctrl / Cmd + K to focus search
              </div>
            </div>
          </div>
        </Card>

        {/* Main Work Area */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FileUpload onFileUploaded={handleFileUploaded} isLoading={loading} />
                <SearchBar onSearch={handleSearch} isLoading={loading} />
              </div>
              <SearchResults
                results={searchResults}
                cacheHit={cacheHit}
                query={lastQuery}
                onView={setSelectedFile}
              />
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
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">{selectedFile.filename}</h3>
                <p className="text-xs text-muted-foreground">
                  Version {selectedFile.version} · {selectedFile.wordCount} words
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedFile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
              {selectedFile.content || selectedFile.preview}
            </pre>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-4 mt-12 text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex justify-between">
          <span>
            Backend: LRU Cache · Trie · Inverted Index
          </span>
          <span>
            {stats ? 'Connected' : loading ? 'Connecting…' : 'offline Mode'}
          </span>
        </div>
      </footer>
    </main>
  );
}
