import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, ArrowUpRight, ArrowDownRight, Tag, Trash2, Calendar, 
  Sparkles, DollarSign, Filter, X, RefreshCcw, HelpCircle, Check, BookOpen
} from 'lucide-react';
import { useFinanceStore } from '../store/financeStore';
import { useUiStore } from '../store/uiStore';
import GlassCard from '../components/GlassCard';

const Transactions = () => {
  const { 
    transactions, 
    categories, 
    fetchTransactions, 
    fetchCategories,
    createTransaction, 
    deleteTransaction,
    isLoading 
  } = useFinanceStore();
  const { addToast } = useUiStore();

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, INCOME, EXPENSE
  const [filterCategory, setFilterCategory] = useState('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // AI-Assisted Categorizer State
  const [aiRecommendedCategory, setAiRecommendedCategory] = useState(null);

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [fetchTransactions, fetchCategories]);

  // AI Category Recommendation Logic based on transaction description
  useEffect(() => {
    if (!description || type !== 'EXPENSE' || categories.length === 0) {
      setAiRecommendedCategory(null);
      return;
    }

    const desc = description.toLowerCase();
    let matchedCat = null;

    // Direct text keyword checks for mock AI suggestions
    if (desc.includes('grocer') || desc.includes('food') || desc.includes('restaurant') || desc.includes('eat') || desc.includes('dinner')) {
      matchedCat = categories.find(c => c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('dining'));
    } else if (desc.includes('uber') || desc.includes('taxi') || desc.includes('fuel') || desc.includes('gas') || desc.includes('metro') || desc.includes('bus')) {
      matchedCat = categories.find(c => c.name.toLowerCase().includes('transport') || c.name.toLowerCase().includes('travel'));
    } else if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('movie') || desc.includes('game') || desc.includes('entertainment')) {
      matchedCat = categories.find(c => c.name.toLowerCase().includes('entertainment') || c.name.toLowerCase().includes('leisure'));
    } else if (desc.includes('rent') || desc.includes('electricity') || desc.includes('water') || desc.includes('bill') || desc.includes('utility')) {
      matchedCat = categories.find(c => c.name.toLowerCase().includes('utilities') || c.name.toLowerCase().includes('housing'));
    } else if (desc.includes('gym') || desc.includes('doctor') || desc.includes('medicine') || desc.includes('health') || desc.includes('pharmacy')) {
      matchedCat = categories.find(c => c.name.toLowerCase().includes('health') || c.name.toLowerCase().includes('medical'));
    }

    if (matchedCat) {
      setAiRecommendedCategory(matchedCat);
    } else {
      setAiRecommendedCategory(null);
    }
  }, [description, type, categories]);

  const handleApplyAiCategory = () => {
    if (aiRecommendedCategory) {
      setCategoryId(aiRecommendedCategory.id.toString());
      addToast(`AI recommended category "${aiRecommendedCategory.name}" applied!`, 'success');
      setAiRecommendedCategory(null);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || !description || !categoryId) {
      addToast('Please complete all required fields.', 'warning');
      return;
    }

    const payload = {
      amount: parseFloat(amount),
      description,
      type,
      date,
      categoryId: parseInt(categoryId),
      notes: notes || null
    };

    const res = await createTransaction(payload);
    if (res.success) {
      addToast('Transaction recorded to ledger.', 'success');
      setIsModalOpen(false);
      
      // Reset form
      setAmount('');
      setDescription('');
      setType('EXPENSE');
      setCategoryId('');
      setNotes('');
    } else {
      addToast(res.message || 'Failed to record transaction.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteTransaction(id);
    if (res.success) {
      addToast('Transaction purged from ledger.', 'success');
    } else {
      addToast(res.message || 'Purge failed.', 'error');
    }
  };

  // Filter implementation
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase()) || 
      (tx.notes && tx.notes.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    
    const matchesCategory = filterCategory === 'ALL' || 
      (tx.categoryId && tx.categoryId.toString() === filterCategory);

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* Header Block */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Ledger Workspace</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
            DENSE LEDGER PROTOCOL • ACTIVE TRANSACTIONS: {transactions.length}
          </p>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setAiRecommendedCategory(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:scale-[1.01] active:scale-[0.99] rounded-xl text-xs font-bold text-white shadow-neon-glow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>RECORD TRANSACTION</span>
        </button>
      </header>

      {/* Statistics Quick Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <GlassCard hoverEffect={false} glowColor="none" className="py-4 px-6 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Ledger Size</span>
            <span className="text-lg font-display font-extrabold text-white block mt-0.5">{transactions.length} rows</span>
          </div>
          <BookOpen className="w-5 h-5 text-brand-violet" />
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="none" className="py-4 px-6 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Category Distribution</span>
            <span className="text-lg font-display font-extrabold text-white block mt-0.5">{categories.length} segments</span>
          </div>
          <Tag className="w-5 h-5 text-brand-cyan" />
        </GlassCard>

        <GlassCard hoverEffect={false} glowColor="none" className="py-4 px-6 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Last Recorded</span>
            <span className="text-xs font-mono text-white block mt-1">
              {transactions.length > 0 ? new Date(transactions[0].date).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <Calendar className="w-5 h-5 text-brand-emerald" />
        </GlassCard>
      </div>

      {/* Filter Control Board */}
      <GlassCard glowColor="none" className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search memo or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 glass-input text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Type Select buttons */}
          <div className="flex bg-midnight/40 border border-midnight-border rounded-xl p-1 text-xs">
            {['ALL', 'INCOME', 'EXPENSE'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg font-semibold tracking-wide transition-all ${
                  filterType === t 
                    ? 'bg-brand-violet/20 text-white shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-midnight/40 border border-midnight-border text-white text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-violet/50 cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id.toString()}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {(search || filterType !== 'ALL' || filterCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearch('');
                setFilterType('ALL');
                setFilterCategory('ALL');
              }}
              className="p-2.5 hover:bg-brand-rose/10 border border-transparent hover:border-brand-rose/20 text-brand-rose rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </GlassCard>

      {/* Timeline Content */}
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <motion.div
                key={tx.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative overflow-hidden group"
              >
                {/* Visual Glow Line for hovering */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-brand-violet/0 to-transparent group-hover:via-brand-violet/40 transition-all duration-300 rounded" />
                
                <GlassCard glowColor="none" className="hover:border-midnight-border/80 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Circle Indicator */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      tx.type === 'INCOME' 
                        ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/15 shadow-emerald-glow/10' 
                        : 'bg-brand-rose/10 text-brand-rose border border-brand-rose/15 shadow-rose-glow/10'
                    }`}>
                      {tx.type === 'INCOME' ? 'IN' : 'OUT'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{tx.description}</span>
                        {tx.notes && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-midnight/60 border border-midnight-border text-slate-500 font-mono rounded">
                            NOTES
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-slate-500 font-mono uppercase">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-brand-violet" />
                          {tx.categoryName || 'Discretionary'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-brand-cyan" />
                          {new Date(tx.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`text-sm font-display font-extrabold block ${
                        tx.type === 'INCOME' ? 'text-brand-emerald' : 'text-slate-200'
                      }`}>
                        {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                      {tx.notes && <span className="text-[10px] text-slate-600 block mt-0.5 truncate max-w-xs">{tx.notes}</span>}
                    </div>

                    {/* Delete Action button */}
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-2.5 rounded-lg bg-midnight/40 border border-midnight-border hover:bg-brand-rose/10 hover:border-brand-rose/20 text-slate-500 hover:text-brand-rose transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          ) : (
            <motion.div
              layout
              className="text-center py-16 glass-panel border-dashed border-midnight-border"
            >
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white">No Matching Transactions</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                Log a transaction using the button in the top right, or clear search queries to restore full ledger view.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Add Transaction Modal (Cinematic Backdrop) ──────────────── */}
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
              className="relative z-50 w-full max-w-md bg-midnight/90 backdrop-blur-glass border border-midnight-border rounded-2xl shadow-glass shadow-neon-glow overflow-hidden text-left"
            >
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-cyan to-transparent" />
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-midnight-border">
                <div>
                  <h4 className="text-sm font-semibold text-white">Record Capital Allocation</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">APPEND ROW TO CENTRAL SYSTEM LEDGER</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="p-6 flex flex-col gap-4">
                {/* Transaction Type Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  {['EXPENSE', 'INCOME'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setType(t);
                        setCategoryId(''); // Reset category when switching type
                      }}
                      className={`py-3 rounded-xl border text-xs font-bold tracking-wider transition-all ${
                        type === t 
                          ? t === 'INCOME' 
                            ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald shadow-emerald-glow/20'
                            : 'bg-brand-rose/10 border-brand-rose text-brand-rose shadow-rose-glow/20'
                          : 'bg-midnight/40 border-midnight-border text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                {/* Amount input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Value (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="145.50"
                      className="w-full pl-10 glass-input text-sm"
                    />
                  </div>
                </div>

                {/* Description input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Memo / Description</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="E.g. Weekly grocery haul"
                    className="w-full glass-input text-sm"
                  />
                  
                  {/* AI Smart Categorization helper notification */}
                  {aiRecommendedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 mt-1 rounded-lg bg-brand-violet/10 border border-brand-violet/25 text-brand-violet flex items-center justify-between text-[10px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>AI Suggestion: Catégorize under <b>{aiRecommendedCategory.name}</b></span>
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyAiCategory}
                        className="px-2 py-0.5 bg-brand-violet text-white font-semibold rounded hover:scale-95 transition-all text-[9px]"
                      >
                        APPLY
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Category Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Segment Category</label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full glass-input text-sm cursor-pointer"
                  >
                    <option value="" disabled>Select category segment</option>
                    {categories
                      .filter((c) => c.type === type)
                      .map((c) => (
                        <option key={c.id} value={c.id.toString()}>{c.name}</option>
                      ))}
                  </select>
                </div>

                {/* Date input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full glass-input text-sm"
                  />
                </div>

                {/* Notes input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Optional Notes</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="E.g. paid via primary card"
                    className="w-full glass-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan hover:scale-[1.01] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-glass shadow-neon-glow flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>APPEND TRANSACTION</span>
                      <Plus className="w-4.5 h-4.5" />
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

export default Transactions;
