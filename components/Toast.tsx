
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Sparkles, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'ai' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, description?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    // Limit to 3 toasts, keep newest at the bottom
    setToasts(prev => {
        const current = [...prev];
        if (current.length >= 3) current.shift(); 
        return [...current, { id, type, message, description }];
    });
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-3 w-full max-w-[90vw] sm:max-w-[400px] pointer-events-none items-center">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-4 p-4 pr-12 rounded-2xl shadow-2xl backdrop-blur-xl border w-full
              animate-in slide-in-from-bottom-5 fade-in duration-300 relative overflow-hidden group
              ${toast.type === 'success' ? 'bg-[#1a1a1c]/95 border-primary/30' : 
                toast.type === 'error' ? 'bg-[#1a1a1c]/95 border-rose-500/30' : 
                toast.type === 'ai' ? 'bg-[#1a1a1c]/95 border-purple-500/30' : 
                'bg-[#1a1a1c]/95 border-white/10'}
            `}
          >
            {/* Icon Box */}
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center shrink-0
              ${toast.type === 'success' ? 'bg-primary/10 text-primary' : 
                toast.type === 'error' ? 'bg-rose-500/10 text-rose-500' : 
                toast.type === 'ai' ? 'bg-purple-500/10 text-purple-400' : 
                'bg-zinc-800 text-zinc-400'}
            `}>
              {toast.type === 'success' && <CheckCircle2 size={20} strokeWidth={3} />}
              {toast.type === 'error' && <AlertCircle size={20} strokeWidth={3} />}
              {toast.type === 'ai' && <Sparkles size={20} strokeWidth={3} />}
              {toast.type === 'info' && <Info size={20} strokeWidth={3} />}
              {toast.type === 'warning' && <AlertTriangle size={20} strokeWidth={3} />}
            </div>

            <div className="flex-grow min-w-0">
              <h4 className={`text-sm font-black uppercase italic tracking-tight leading-none mb-1 ${
                  toast.type === 'success' ? 'text-primary' : 
                  toast.type === 'error' ? 'text-rose-500' : 
                  'text-white'
              }`}>
                  {toast.message}
              </h4>
              {toast.description && <p className="text-[11px] text-zinc-400 font-bold leading-tight truncate">{toast.description}</p>}
            </div>

            <button 
              onClick={() => removeToast(toast.id)}
              className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-zinc-600 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            
            {/* Elegant Glow */}
            <div className={`absolute -bottom-10 -left-4 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none ${
                toast.type === 'success' ? 'bg-primary' : 
                toast.type === 'error' ? 'bg-rose-500' : 
                toast.type === 'ai' ? 'bg-purple-500' : 'bg-white'
            }`}></div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
