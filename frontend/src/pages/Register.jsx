import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, FileText, ArrowRight, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const { addToast } = useUiStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    clearError();
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !fullName) {
      addToast('All registration inputs are required.', 'warning');
      return;
    }

    const result = await register(username, email, password, fullName);
    if (result.success) {
      addToast('Account initialized successfully! Please authenticate.', 'success');
      navigate('/login');
    } else {
      addToast(error || 'Failed to initialize account.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-midnight flex relative overflow-hidden items-center justify-center p-4">
      {/* Background Mesh */}
      <div className="mesh-gradient-container">
        <div className="mesh-glow-2 animate-mesh-2" />
        <div className="mesh-glow-3 animate-mesh-3" />
      </div>

      <div className="grain-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Brand Visuals */}
        <div className="col-span-1 md:col-span-6 flex flex-col justify-center text-left gap-6 p-4 hidden md:flex">
          <div className="flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-neon-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-white text-xl tracking-tight">SYFE</span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight tracking-tighter">
              Onboard into <br />
              <span className="bg-gradient-to-r from-brand-cyan via-brand-emerald to-brand-violet bg-clip-text text-transparent">
                Financial Sovereignty
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-2">
              Join explorers worldwide who manage and scale their financial footprint without JWT overheads, supported by strict user-scoped security and mathematical data integrity.
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Automated Category Seeding</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-0.5">We auto-generate 15 customized default ledger categories right on signup so you can begin immediately.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-brand-emerald" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Advanced Encrypted Sessions</h4>
                <p className="text-xs text-slate-500 max-w-xs mt-0.5">Cookies are secured with HTTP-Only isolation flags, meaning no local tokens are vulnerable to script injection.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding Glass Form */}
        <div className="col-span-1 md:col-span-6 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md glass-panel p-8 relative shadow-neon-glow"
          >
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />

            <div className="flex flex-col gap-2 mb-8">
              <h2 className="text-2xl font-bold font-display text-white">Launch Your Profile</h2>
              <p className="text-slate-400 text-xs">Set up your cockpit coordinates to activate financial tracking.</p>
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Full Name</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-11 glass-input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Username Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="john_explorer"
                    className="w-full pl-11 glass-input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@explorer.com"
                    className="w-full pl-11 glass-input text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Security Password</label>
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
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet hover:from-brand-cyan*1.1 hover:to-brand-violet*1.1 text-white font-bold text-sm tracking-wide shadow-glass shadow-neon-glow flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none group"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>INITIALIZE COCKPIT</span>
                    <UserPlus className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-midnight-border flex items-center justify-between text-xs">
              <span className="text-slate-500">Already have a cockpit?</span>
              <Link to="/login" className="text-brand-violet hover:text-brand-cyan font-semibold transition-colors duration-150 flex items-center gap-1 group">
                <span>Sign In Here</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Register;
