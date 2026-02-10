'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Toast = React.forwardRef(({ className, onClose, action, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-md border border-[var(--color-border)] p-4 shadow-lg transition-all',
        'bg-[var(--color-card)] text-[var(--color-card-foreground)]',
        'animate-fade-in',
        className
      )}
      {...props}
    >
      <div className="flex-1">
        {children}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {action && (
          <button
            onClick={action.onClick}
            className="text-sm font-medium text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded hover:bg-cyan-500/10 transition-colors"
          >
            {action.label}
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
});
Toast.displayName = 'Toast';

const ToastProvider = ({ children }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {children}
    </div>
  );
};

const ToastViewport = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-4 sm:right-4 sm:flex-col md:max-w-[420px]',
        className
      )}
      {...props}
    />
  );
};

export { Toast, ToastProvider, ToastViewport };
