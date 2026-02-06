'use client';

import { useEffect, useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { SearchBar } from '@/components/SearchBar';
import { SearchResults } from '@/components/SearchResults';
import { FileList } from '@/components/FileList';
import { SystemStats } from '@/components/SystemStats';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Info } from 'lucide-react';

export default function Page() {
  const [files, setFiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [lastQuery, setLastQuery] = useState('');
  const [cacheHit, setCacheHit] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch files
  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/files');
      const result = await response.json();
      if (result.success) {
        setFiles(result.files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      const result = await response.json();
      if (result.success) {
        setStats(result);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFiles(), fetchStats()]);
      setLoading(false);
    };

    init();

    const interval = setInterval(() => {
      fetchStats();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUploaded = async (file) => {
    setFiles((prev) => [...prev, file]);
    await fetchStats();
  };

  const handleSearch = (results, hit) => {
    setSearchResults(results);
    setCacheHit(hit);
    if (results.length > 0) {
      setLastQuery(results[0]?.filename || '');
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Delete this file?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/files/${fileId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        await fetchStats();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleReset = async () => {
    if (!confirm('Reset all systems?')) return;

    try {
      await fetch('http://localhost:3001/api/reset', { method: 'POST' });
      setFiles([]);
      setSearchResults([]);
      setStats(null);
      setRefreshKey((k) => k + 1);
    } catch (error) {
      console.error('Reset failed:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Scalable Systems Simulator
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Interactive search engine, cache, and file storage demo
              </p>
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
        {stats && <SystemStats stats={stats} />}

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
        </Card>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border border-slate-700">
            <TabsTrigger value="search" className="data-[state=active]:bg-slate-700">
              Search & Upload
            </TabsTrigger>
            <TabsTrigger value="files" className="data-[state=active]:bg-slate-700">
              File Browser
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FileUpload onFileUploaded={handleFileUploaded} isLoading={loading} />
                <SearchBar onSearch={handleSearch} isLoading={loading} />
              </div>
              <div>
                <SearchResults results={searchResults} cacheHit={cacheHit} query={lastQuery} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-6">
            <FileList files={files} onDelete={handleDeleteFile} onView={setSelectedFile} />
          </TabsContent>
        </Tabs>

        {selectedFile && (
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 max-h-96 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                {selectedFile.filename}
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-slate-400 hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
              {selectedFile.preview}
            </p>
          </Card>
        )}
      </div>

      <div className="border-t border-slate-800 bg-slate-950/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm">
            Backend running on port 3001 • Real data structures: LRU Cache, Trie, Inverted Index
          </p>
        </div>
      </div>
    </main>
  );
}
