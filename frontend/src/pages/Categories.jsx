import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag, Plus, Trash2, ArrowUpRight, ArrowDownRight, 
  AlertTriangle, BookOpen, X, Sparkles, HelpCircle
} from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { useUiStore } from '../store/uiStore';
import GlassCard from '../components/GlassCard';

const Categories = () => {
  const { 
    categories, 
    transactions,
    fetchCategories, 
    fetchTransactions,
    createCategory, 
    deleteCategory, 
    isLoading 
  } = useFinanceStore();
  const { addToast } = useUiStore();

  const [activeTab, setActiveTab] = useState('EXPENSE'); // INCOME, EXPENSE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, [fetchCategories, fetchTransactions]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      addToast('Category name is required.', 'warning');
      return;
    }

    const res = await createCategory({
      name,
      description: description || 'Custom discretionary segment',
      type: activeTab
    });

    if (res.success) {
      addToast(`Category segment "${name}" initialized successfully!`, 'success');
      setIsModalOpen(false);
      setName('');
      setDescription('');
    } else {
      addToast(res.message || 'Failed to initialize category segment.', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    // Check if category is used by any transactions in local store (safeguard)
    const usageCount = transactions.filter((t) => t.categoryId === id).length;
    if (usageCount > 0) {
      addToast(`Conflict: Segment contains ${usageCount} active ledger rows! Reassign them first.`, 'error');
      return;
    }

    const res = await deleteCategory(id);
    if (res.success) {
      addToast('Category segment purged.', 'success');
    } else {
      addToast(res.message || 'Purge failed.', 'error');
    }
  };

  // Filter categories based on type
  const filteredCategories = categories.filter((c) => c.type === activeTab);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* Header Block */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Category Intelligence</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
            DISCRETIONARY ALLOCATION SEGMENTS & PROTECTION SAFEGUARDS
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:scale-[1.01] active:scale-[0.99] rounded-xl text-xs font-bold text-white shadow-neon-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>DEFINE SEGMENT</span>
        </button>
      </header>

      {/* Tabs Row */}
      <div className="flex bg-midnight-card border border-midnight-border max-w-xs rounded-xl p-1 text-xs self-start">
        {['EXPENSE', 'INCOME'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold tracking-wide transition-all ${
              activeTab === type 
                ? 'bg-brand-violet/20 text-white shadow-inner' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {type === 'INCOME' ? <ArrowUpRight className="w-4 h-4 text-brand-emerald" /> : <ArrowDownRight className="w-4 h-4 text-brand-rose" />}
            <span>{type} SEGMENTS</span>
          </button>
        ))}
      </div>

      {/* Warning Guard Banner */}
      <GlassCard glowColor="none" className="border-amber-500/20 bg-amber-500/5 py-4 px-6 flex items-start gap-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Mathematical Data isolation Protect</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
            The platform enforces strict referential database constraints. If you try to delete a category that currently has active transactions tied to it, the request will be automatically blocked with a 409 Conflict. Reassign or delete those transactions first!
          </p>
        </div>
      </GlassCard>

      {/* Categories Grid List */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((c) => {
              // Calculate usage count in transactions
              const usageCount = transactions.filter((t) => t.categoryId === c.id).length;
              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  <GlassCard glowColor="none" className="h-44 flex flex-col justify-between relative group hover:border-midnight-border/80">
                    
                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="absolute top-4 right-4 p-2.5 rounded-lg bg-midnight/50 border border-midnight-border hover:bg-brand-rose/15 hover:border-brand-rose/30 text-slate-500 hover:text-brand-rose opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          c.type === 'INCOME' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-rose/10 text-brand-rose'
                        }`}>
                          <Tag className="w-4 h-4" />
                        </div>
                        <h4 className="text-sm font-bold text-white max-w-[180px] truncate">{c.name}</h4>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{c.description || 'Custom discretionary segment.'}</p>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-4 pt-2 border-t border-midnight-border">
                      <span className="uppercase tracking-widest font-bold">LEDGER USAGE</span>
                      <span className={`font-semibold ${usageCount > 0 ? 'text-white' : 'text-slate-600'}`}>
                        {usageCount} rows tied
                      </span>
                    </div>

                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 glass-panel border-dashed border-midnight-border max-w-lg mx-auto">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white">No Segments Defined</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
            There are no segments defined under {activeTab}. Click "Define Segment" in the top right to get started!
          </p>
        </div>
      )}

      {/* Add Category Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-50 w-full max-w-sm bg-midnight/90 backdrop-blur-glass border border-midnight-border rounded-2xl shadow-glass shadow-neon-glow overflow-hidden text-left"
            >
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-midnight-border">
                <div>
                  <h4 className="text-sm font-semibold text-white">Define Category Segment</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">APPEND VALUE CLASSIFIER MATRIX</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="p-6 flex flex-col gap-4">
                {/* Segment type notice */}
                <div className="p-3 bg-midnight/50 border border-midnight-border rounded-xl flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Segment Type:</span>
                  <span className={`font-extrabold uppercase ${activeTab === 'INCOME' ? 'text-brand-emerald' : 'text-brand-rose'}`}>
                    {activeTab}
                  </span>
                </div>

                {/* Category Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Segment Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Technical Equipment"
                    className="w-full glass-input text-sm"
                  />
                </div>

                {/* Category Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Description</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. Laptops, software licenses"
                    className="w-full glass-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-glass shadow-neon-glow flex items-center justify-center gap-2 transition-all"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>DEFINE SEGMENT</span>
                      <Tag className="w-4.5 h-4.5" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Categories;
