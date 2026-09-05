import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useUiStore } from '../store/uiStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useUiStore();

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-brand-emerald" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <AlertCircle className="w-5 h-5 text-brand-rose" />,
    info: <Info className="w-5 h-5 text-brand-blue" />,
  };

  const glows = {
    success: 'shadow-emerald-glow border-brand-emerald/30',
    warning: 'shadow-amber-500/20 border-amber-500/20',
    error: 'shadow-rose-glow border-brand-rose/30',
    info: 'shadow-glass-glow border-brand-blue/30',
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.85, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 bg-midnight/90 backdrop-blur-glass border border-midnight-border rounded-xl shadow-glass ${glows[toast.type]}`}
          >
            <div className="flex items-center gap-3">
              {icons[toast.type]}
              <p className="text-sm font-medium text-white">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors duration-150"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
