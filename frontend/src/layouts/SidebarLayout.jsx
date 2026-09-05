import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Compass, DollarSign, BarChart3, Target, Tag, Settings, LogOut, Terminal, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import ToastContainer from '../components/ToastContainer';
import CommandPalette from '../components/CommandPalette';

const SidebarLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { toggleCommandPalette } = useUiStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Compass className="w-5 h-5" /> },
    { name: 'Ledger', path: '/transactions', icon: <DollarSign className="w-5 h-5" /> },
    { name: 'Analytics Lab', path: '/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Savings Orbs', path: '/goals', icon: <Target className="w-5 h-5" /> },
    { name: 'Category Hub', path: '/categories', icon: <Tag className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-midnight text-slate-300 flex relative">
      {/* Background Neon Mesh Gradients */}
      <div className="mesh-gradient-container">
        <div className="mesh-glow-1 animate-mesh-1" />
        <div className="mesh-glow-2 animate-mesh-2" />
        <div className="mesh-glow-3 animate-mesh-3" />
      </div>

      {/* Floating textured grain */}
      <div className="grain-overlay" />

      {/* Sidebar navigation */}
      <aside className="w-64 h-[calc(100vh-2rem)] sticky top-4 left-4 my-4 ml-4 glass-panel flex flex-col justify-between overflow-hidden shrink-0 z-30">
        <div className="flex flex-col gap-6 p-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-neon-glow">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-base tracking-tight">SYFE</span>
              <span className="text-[10px] block font-mono text-brand-violet font-semibold tracking-wider -mt-1">INTELLIGENCE</span>
            </div>
          </div>

          {/* Quick Command Palette Button */}
          <button
            onClick={toggleCommandPalette}
            className="flex items-center justify-between w-full px-3 py-2 bg-midnight/30 hover:bg-midnight-panel/50 border border-midnight-border rounded-xl text-left text-xs transition-all duration-150 group"
          >
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors duration-150">Search...</span>
            <kbd className="px-1.5 py-0.5 bg-midnight-border border border-white/5 text-[9px] rounded font-mono text-slate-500">⌘K</kbd>
          </button>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group overflow-hidden ${
                    isActive
                      ? 'bg-brand-violet/10 text-white font-semibold shadow-glass'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active tab neon glow effect */}
                    {isActive && (
                      <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-brand-violet shadow-neon-glow rounded-r" />
                    )}
                    {/* Hover light highlight */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    
                    <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-brand-violet' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="p-4 border-t border-midnight-border bg-midnight-panel/10 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar container */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet/30 to-brand-cyan/30 border border-brand-violet/30 flex items-center justify-center text-white font-display font-semibold shadow-inner">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <span className="text-sm font-semibold text-white block truncate leading-tight">{user?.fullName || 'User'}</span>
              <span className="text-[10px] text-slate-500 font-mono block truncate">@{user?.username || 'anonymous'}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 bg-brand-rose/5 hover:bg-brand-rose/15 border border-brand-rose/20 text-brand-rose rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 justify-center shadow-glass"
          >
            <LogOut className="w-4 h-4" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* Main content grid */}
      <main className="flex-1 p-6 overflow-y-auto max-w-full relative z-10">
        <Outlet />
      </main>

      {/* Global Utilities */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};

export default SidebarLayout;
