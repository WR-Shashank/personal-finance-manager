import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, LogIn, ArrowRight, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { addToast } = useUiStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      addToast('Please input both username and password.', 'warning');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      addToast('Welcome back to your financial cockpit!', 'success');
      navigate('/');
    } else {
      addToast(error || 'Failed to authenticate.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex relative overflow-hidden items-center justify-center p-4">
      {/* Background Mesh */}
      <div className="mesh-gradient-container">
        <div className="mesh-glow-1 animate-mesh-1" />
        <div className="mesh-glow-2 animate-mesh-2" />
      </div>

      <div className="grain-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Premium Brand Visuals (asymmetric & animated) */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-center text-left gap-6 p-4 hidden md:flex">
          <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-neon-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl tracking-tight">SYFE</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight tracking-tighter">
              Next-generation <br />
              <span className="bg-gradient-to-r from-brand-violet via-brand-cyan to-brand-emerald bg-clip-text text-transparent">
                Fintech Operating System
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-2">
              Step into a calm, financially empowering space. Monitor cash flow, track active savings, and audit discretionary expenditures with real-time AI logic.
            </p>
          </div>

          {/* Glowing Virtual Card Showcase */}
          <motion.div
            initial={{ rotateY: -10, rotateX: 10, y: 15 }}
            animate={{ 
              rotateY: [10, -10, 10],
              rotateX: [-10, 10, -10],
              y: [0, 15, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-80 h-48 rounded-2xl p-6 relative overflow-hidden glass-panel border border-white/10 shadow-glass-glow flex flex-col justify-between cursor-grab active:cursor-grabbing self-start mt-4"
          >
            {/* Ambient card lights */}
            <div className="absolute -right-20 -top-20 w-44 h-44 rounded-full bg-brand-violet/20 blur-xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-44 h-44 rounded-full bg-brand-cyan/20 blur-xl pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-brand-violet font-bold block tracking-widest">SYFE PLATINUM</span>
                <span className="text-xs text-white/50 block font-mono mt-1">COCKPIT ACCESS</span>
              </div>
              <div className="w-10 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-brand-violet/40 mix-blend-screen animate-pulse" />
              </div>
            </div>

            <div className="font-mono text-white text-lg tracking-wider">
              •••• •••• •••• 2026
            </div>

            <div className="flex justify-between items-end">
              <div>
                <span className="text-[9px] text-slate-500 font-mono block">CARDHOLDER</span>
                <span className="text-xs text-white font-display font-semibold">FINANCIAL EXPLORER</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-mono block text-right">EXPIRES</span>
                <span className="text-xs text-white font-mono">12/30</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Glassmorphic Login Form */}
        <div className="col-span-1 md:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel p-8 relative shadow-neon-glow"
          >
            {/* Accent neon glow line */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-violet to-transparent" />

            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-2xl font-bold font-display text-white">Access Your Pilot Seat</h2>
              <p className="text-slate-400 text-xs">Enter your security credentials to sync your financial ledger.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 rounded-xl bg-brand-rose/10 border border-brand-rose/25 text-brand-rose text-xs leading-relaxed shadow-glass"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Username Input */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="explorer2026"
                    className="w-full pl-11 glass-input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2 relative">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 glass-input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-blue hover:from-brand-violet*1.1 hover:to-brand-blue*1.1 text-white font-bold text-sm tracking-wide shadow-glass shadow-neon-glow flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>AUTHENTICATE</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-midnight-border flex items-center justify-between text-xs">
              <span className="text-slate-500">New to the cockpit?</span>
              <Link to="/register" className="text-brand-cyan hover:text-brand-violet font-semibold transition-colors duration-150 flex items-center gap-1 group">
                <span>Create an Account</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Login;
