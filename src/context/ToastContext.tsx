import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg: string) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg: string) => addToast(msg, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed bottom-5 end-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
            error: <AlertCircle className="h-5 w-5 text-algerian-600 shrink-0" />,
            info: <Info className="h-5 w-5 text-neutral-800 shrink-0" />,
          };

          const borders = {
            success: 'border-l-4 border-l-emerald-600 rtl:border-l-0 rtl:border-r-4 rtl:border-r-emerald-600',
            error: 'border-l-4 border-l-algerian-600 rtl:border-l-0 rtl:border-r-4 rtl:border-r-algerian-600',
            info: 'border-l-4 border-l-neutral-800 rtl:border-l-0 rtl:border-r-4 rtl:border-r-neutral-800',
          };

          return (
            <div
              key={t.id}
              role="status"
              className={`pointer-events-auto bg-white text-primary shadow-xl border border-border px-4 py-3 flex items-start space-x-3 rtl:space-x-reverse transition-all transform animate-in slide-in-from-bottom-2 duration-200 ${borders[t.type]}`}
            >
              {icons[t.type]}
              <p className="text-xs font-medium flex-1 pt-0.5">{t.message}</p>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-neutral-400 hover:text-primary transition-colors p-0.5"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
