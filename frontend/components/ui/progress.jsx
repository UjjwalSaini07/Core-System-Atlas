'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function Progress({ value = 0, max = 100, className, indicatorClassName, showValue = false, ...props }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('relative w-full h-2 bg-slate-100 rounded-full overflow-hidden', className)} {...props}>
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          indicatorClassName || 'bg-gradient-to-r from-teal-500 to-teal-600'
        )}
        style={{ width: `${percentage}%` }}
      />
      {showValue && (
        <span className="absolute right-0 -top-5 text-xs text-slate-500">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export { Progress };
