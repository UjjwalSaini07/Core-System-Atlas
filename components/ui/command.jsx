'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { Search, Database, FileText, Activity, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CommandPalette({ open, setOpen }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setOpen]);

  const actions = [
    { icon: <Search className="w-4 h-4" />, label: 'Search Files', shortcut: 'Ctrl+K', action: () => setOpen(false) },
    { icon: <FileText className="w-4 h-4" />, label: 'Upload File', shortcut: 'Ctrl+U', action: () => setOpen(false) },
    { icon: <Database className="w-4 h-4" />, label: 'View Statistics', shortcut: 'Ctrl+S', action: () => setOpen(false) },
    { icon: <Activity className="w-4 h-4" />, label: 'Open Monitoring', shortcut: 'Ctrl+M', action: () => window.location.href = '/monitoring' },
  ];

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Command Palette */}
      <div
        className={`fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-2xl shadow-black/50 z-50 transition-all duration-200 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-[var(--color-border)]">
          <Search className="w-5 h-5 text-[var(--color-muted-foreground)] mr-3" />
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)]"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-[var(--color-muted)] rounded text-xs text-[var(--color-muted-foreground)]">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {query === '' && (
            <div className="px-4 py-2">
              <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">Suggestions</p>
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--color-muted-foreground)]">{action.icon}</span>
                    <span className="text-[var(--color-foreground)]">{action.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="px-2 py-0.5 bg-[var(--color-muted)] rounded text-xs text-[var(--color-muted-foreground)]">
                      {action.shortcut}
                    </kbd>
                    <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {query !== '' && (
            <div className="px-4 py-2">
              <p className="text-xs text-[var(--color-muted-foreground)] uppercase tracking-wider mb-2">Search Results</p>
              {actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase())).map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-muted)] transition-colors"
                >
                  <span className="text-[var(--color-muted-foreground)]">{action.icon}</span>
                  <span className="text-[var(--color-foreground)]">{action.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)] text-xs text-[var(--color-muted-foreground)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--color-muted)] rounded">↵</kbd> to select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-[var(--color-muted)] rounded">↑↓</kbd> to navigate
            </span>
          </div>
          <span>Scalable Systems Simulator</span>
        </div>
      </div>
    </>
  );
}
