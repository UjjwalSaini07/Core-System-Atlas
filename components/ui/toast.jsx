'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Toast = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-[var(--color-border)] p-4 pr-8 shadow-lg transition-all',
        'bg-[var(--color-card)] text-[var(--color-card-foreground)]',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full',
        className
      )}
      {...props}
    >
      {props.children}
      <button
        onClick={props.onClose}
        className="absolute right-2 top-2 rounded-md p-1 text-[var(--color-muted-foreground)] opacity-0 transition-opacity hover:text-[var(--color-foreground)] focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
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
