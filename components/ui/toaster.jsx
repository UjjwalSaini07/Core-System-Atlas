'use client';

import { useToast } from '@/hooks/use-toast';
import { Toast, ToastProvider, ToastViewport } from '@/components/ui/toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function (toast) {
        return (
          <Toast
            key={toast.id}
            onClose={() => dismiss(toast.id)}
            action={toast.action}
          >
            <div className="grid gap-1">
              {toast.title && <div className="font-semibold">{toast.title}</div>}
              {toast.description && (
                <div className="text-sm text-[var(--color-muted-foreground)]">{toast.description}</div>
              )}
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
