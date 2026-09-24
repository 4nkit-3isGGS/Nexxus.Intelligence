import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    info: (title, message) => {
      if (message === undefined) {
        addToast({ title: 'Authentication Required', message: title, type: 'info' });
      } else {
        addToast({ title, message, type: 'info' });
      }
    },
    success: (title, message) => {
      if (message === undefined) {
        addToast({ title: 'Success', message: title, type: 'success' });
      } else {
        addToast({ title, message, type: 'success' });
      }
    },
    warning: (title, message) => {
      if (message === undefined) {
        addToast({ title: 'Warning', message: title, type: 'warning' });
      } else {
        addToast({ title, message, type: 'warning' });
      }
    },
    error: (title, message) => {
      if (message === undefined) {
        addToast({ title: 'Error', message: title, type: 'error' });
      } else {
        addToast({ title, message, type: 'error' });
      }
    },
  };

  const getToastStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-white',
          border: 'border-emerald-300',
          icon: 'check_circle',
          iconColor: 'text-emerald-600',
          titleColor: 'text-slate-900',
        };
      case 'warning':
        return {
          bg: 'bg-white',
          border: 'border-amber-300',
          icon: 'warning',
          iconColor: 'text-amber-600',
          titleColor: 'text-slate-900',
        };
      case 'error':
        return {
          bg: 'bg-white',
          border: 'border-rose-300',
          icon: 'error',
          iconColor: 'text-rose-600',
          titleColor: 'text-slate-900',
        };
      case 'info':
      default:
        return {
          bg: 'bg-white',
          border: 'border-sky-300',
          icon: 'info',
          iconColor: 'text-sky-600',
          titleColor: 'text-slate-900',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-2 sm:px-0">
        {toasts.map((t) => {
          const style = getToastStyle(t.type);
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border ${style.bg} ${style.border} animate-fade-in backdrop-blur-md transition-all`}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-slate-50 border border-slate-200">
                <span className={`material-symbols-outlined text-[20px] ${style.iconColor}`}>
                  {style.icon}
                </span>
              </div>
              <div className="flex-1 flex flex-col min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-bold font-display tracking-tight ${style.titleColor}`}>
                    {t.title}
                  </span>
                  <button
                    onClick={() => removeToast(t.id)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                </div>
                {t.message && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-sans">
                    {t.message}
                  </p>
                )}
              </div>
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
    return {
      toast: {
        info: () => {},
        success: () => {},
        warning: () => {},
        error: () => {},
      },
    };
  }
  return context;
}
