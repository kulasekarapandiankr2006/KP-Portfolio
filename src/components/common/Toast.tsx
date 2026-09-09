import React, { useState, useEffect } from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'info' | 'warning';
  title: string;
  subtitle?: string;
}

// Global event bus for lightweight zero-context toasts
const TOAST_EVENT = 'kp-show-toast';

export const showToast = (title: string, subtitle?: string, type: 'success' | 'info' | 'warning' = 'success') => {
  const event = new CustomEvent(TOAST_EVENT, {
    detail: { id: Math.random().toString(36).substring(2, 9), title, subtitle, type }
  });
  window.dispatchEvent(event);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<ToastMessage>;
      const newToast = customEvent.detail;
      setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, 3500);
    };

    window.addEventListener(TOAST_EVENT, handleToast);
    return () => window.removeEventListener(TOAST_EVENT, handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-[#091528]/95 border border-cyan-400/40 text-slate-100 shadow-[0_10px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-xl animate-slideUp font-mono text-xs"
        >
          <div className="mt-0.5 p-1 rounded-md bg-cyan-400/10 text-cyan-300">
            {toast.type === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ) : toast.type === 'info' ? (
              <Info className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-white tracking-wide">{toast.title}</div>
            {toast.subtitle && <div className="text-[11px] text-slate-400 mt-0.5">{toast.subtitle}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
