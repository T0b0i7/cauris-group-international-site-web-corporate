import { createContext, useCallback, useContext, useState } from 'react';

type Toast = { id: number; message: string; type: 'success' | 'error' | 'info' };
type ToastCtx = { toasts: Toast[]; push: (m: string, t?: Toast['type']) => void };

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return <Ctx.Provider value={{ toasts, push }}>{children}</Ctx.Provider>;
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('ToastProvider manquant');
  return ctx;
}
