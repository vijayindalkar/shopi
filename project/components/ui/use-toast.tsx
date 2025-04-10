// components/ui/use-toast.ts

import * as React from 'react';
import { useState, useCallback } from 'react';

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type Toast = ToastOptions & {
  id: number;
};

let toastCount = 0;

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    const id = ++toastCount;
    const newToast = { ...options, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return {
    toast,
    toasts,
    setToasts,
  };
}
