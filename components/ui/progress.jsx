'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function Progress({ value = 0, max = 100, className, indicatorClassName, showValue = false, ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('relative w-full h-2 bg-[var(--color-muted)] rounded-full overflow-hidden', className)} {...props}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          indicatorClassName || 'bg-gradient-to-r from-[hsl(199,89%,48%)] via-[hsl(188,100%,47%)] to-[hsl(168,85%,45%)]'
        )}
        style={{ width: `${percentage}%` }}
      />
      {showValue && (
        <span className="absolute right-0 -top-5 text-xs text-[var(--color-muted-foreground)]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export { Progress };
