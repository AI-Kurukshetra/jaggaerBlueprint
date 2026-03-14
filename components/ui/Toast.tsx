"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "success" | "error" | "info";

type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  addToast: (toast: Omit<ToastMessage, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4" />,
  error: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />
};

const toneMap: Record<ToastVariant, string> = {
  success:
    "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200",
  error:
    "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200",
  info:
    "border-sky-100 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-200"
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...toast, id }]);
      setTimeout(() => removeToast(id), 4000);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-full max-w-xs flex-col gap-3">
        {toasts.map((toast) => {
          const variant = toast.variant ?? "info";
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-soft",
                toneMap[variant]
              )}
            >
              <div className="mt-0.5">{iconMap[variant]}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {toast.title}
                </p>
                {toast.description ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                className="rounded-full p-1 text-slate-500 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/60"
                onClick={() => removeToast(toast.id)}
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
