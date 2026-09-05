import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Compass, DollarSign, BarChart3, Target, Tag, Settings, LogOut, Terminal } from 'lucide-react';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';

const CommandPalette = () => {
  const navigate = useNavigate();
  const { isCommandPaletteOpen, setCommandPalette } = useUiStore();
  const { logout } = useAuthStore();
  const { transactions } = useFinanceStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPalette(!isCommandPaletteOpen);
      } else if (e.key === 'Escape') {
        setCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPalette]);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isCommandPaletteOpen]);

  // Command items definition
  const navigationItems = [
    { name: 'Go to Dashboard', icon: <Compass className="w-4 h-4 text-brand-violet" />, action: () => navigate('/') },
    { name: 'View Transactions', icon: <DollarSign className="w-4 h-4 text-brand-emerald" />, action: () => navigate('/transactions') },
    { name: 'Analytics Intelligence', icon: <BarChart3 className="w-4 h-4 text-brand-cyan" />, action: () => navigate('/analytics') },
    { name: 'Savings Command Center', icon: <Target className="w-4 h-4 text-brand-neon" />, action: () => navigate('/goals') },
    { name: 'Category Settings', icon: <Tag className="w-4 h-4 text-brand-violet" />, action: () => navigate('/categories') },
    { name: 'System Settings', icon: <Settings className="w-4 h-4 text-slate-400" />, action: () => navigate('/settings') },
  ];

  const actionItems = [
    { name: 'Log out session', icon: <LogOut className="w-4 h-4 text-brand-rose" />, action: () => { logout(); setCommandPalette(false); } },
  ];

  // Filter items based on search query
  const filteredNav = navigationItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActions = actionItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTransactions = transactions
    .filter(tx => tx.description.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 4)
    .map(tx => ({
      name: `Tx: ${tx.description} (${tx.type === 'INCOME' ? '+' : '-'}$${tx.amount})`,
      icon: <Terminal className="w-4 h-4 text-slate-400" />,
      action: () => { navigate('/transactions'); setCommandPalette(false); }
    }));

  const allItems = [...filteredNav, ...filteredTransactions, ...filteredActions];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
        setCommandPalette(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPalette(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Floating Raycast Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-50 w-full max-w-xl bg-midnight/90 backdrop-blur-glass border border-midnight-border rounded-2xl shadow-glass shadow-neon-glow overflow-hidden"
          >
            {/* Input Wrapper */}
            <div className="flex items-center gap-3 px-4 border-b border-midnight-border py-4">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search transactions... (Cmd+K to close)"
                type="text"
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-sm"
              />
            </div>

            {/* Results Scroll Area */}
            <div className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
              {allItems.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {filteredNav.length > 0 && (
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-1.5">
                      Navigation
                    </div>
                  )}
                  {filteredNav.map((item, idx) => {
                    const globalIdx = idx;
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={item.name}
                        onClick={() => { item.action(); setCommandPalette(false); }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 ${
                          isSelected ? 'bg-brand-violet/20 text-white font-medium pl-4 border-l-2 border-brand-violet' : 'text-slate-400 hover:bg-midnight-panel/50 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    );
                  })}

                  {filteredTransactions.length > 0 && (
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-1.5 mt-2">
                      Recent Ledger Matches
                    </div>
                  )}
                  {filteredTransactions.map((item, idx) => {
                    const globalIdx = filteredNav.length + idx;
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={item.name}
                        onClick={() => { item.action(); setCommandPalette(false); }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm font-mono transition-all duration-150 ${
                          isSelected ? 'bg-brand-violet/20 text-white font-medium pl-4 border-l-2 border-brand-violet' : 'text-slate-400 hover:bg-midnight-panel/50 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    );
                  })}

                  {filteredActions.length > 0 && (
                    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider px-3 py-1.5 mt-2">
                      System & Operations
                    </div>
                  )}
                  {filteredActions.map((item, idx) => {
                    const globalIdx = filteredNav.length + filteredTransactions.length + idx;
                    const isSelected = globalIdx === selectedIndex;
                    return (
                      <button
                        key={item.name}
                        onClick={() => { item.action(); setCommandPalette(false); }}
                        className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-150 ${
                          isSelected ? 'bg-brand-violet/20 text-white font-medium pl-4 border-l-2 border-brand-violet' : 'text-slate-400 hover:bg-midnight-panel/50 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No matches found for <span className="font-mono text-slate-300">"{search}"</span>
                </div>
              )}
            </div>

            {/* command footer */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-midnight-border bg-midnight-panel/30 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>Navigate</span>
                <kbd className="px-1.5 py-0.5 bg-midnight-border rounded border border-white/5 font-mono">↑↓</kbd>
                <span>Select</span>
                <kbd className="px-1.5 py-0.5 bg-midnight-border rounded border border-white/5 font-mono">Enter</kbd>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Close</span>
                <kbd className="px-1.5 py-0.5 bg-midnight-border rounded border border-white/5 font-mono">Esc</kbd>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
