'use client';

import { useToast } from '@/hooks/use-toast';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} onClose={() => props.onOpenChange?.(false)}>
            <div className="grid gap-1">
              {title && <div className="font-semibold">{title}</div>}
              {description && (
                <div className="text-sm text-[var(--color-muted-foreground)]">{description}</div>
              )}
            </div>
            {action}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
