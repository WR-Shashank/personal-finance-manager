import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Plus, Calendar, Flame, Sparkles, RefreshCcw, 
  Trash2, X, Trophy, DollarSign, Milestone, HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useFinanceStore } from '../store/financeStore';
import { useUiStore } from '../store/uiStore';
import GlassCard from '../components/GlassCard';

const Goals = () => {
  const { 
    goals, 
    fetchGoals, 
    createGoal, 
    deleteGoal, 
    refreshGoals, 
    isLoading 
  } = useFinanceStore();
  const { addToast } = useUiStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount || !targetDate) {
      addToast('Please input name, target amount, and date.', 'warning');
      return;
    }

    const res = await createGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      targetDate
    });

    if (res.success) {
      addToast(`Savings goal "${name}" initialized!`, 'success');
      setIsModalOpen(false);
      setName('');
      setTargetAmount('');
      setTargetDate('');
      
      // Trigger a light welcoming confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#06b6d4', '#10b981']
      });
    } else {
      addToast(res.message || 'Failed to establish goal.', 'error');
    }
  };

  const handleDeleteGoal = async (id) => {
    const res = await deleteGoal(id);
    if (res.success) {
      addToast('Savings goal deleted.', 'success');
    } else {
      addToast(res.message || 'Purge failed.', 'error');
    }
  };

  const handleRefresh = async () => {
    const res = await refreshGoals();
    if (res.success) {
      addToast('Savings goal math recalculated from ledger!', 'success');
      
      // Check if any goals are fully achieved and fire huge confetti!
      const achievedGoals = goals.filter((g) => {
        const percent = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
        return percent >= 100;
      });

      if (achievedGoals.length > 0) {
        addToast('COMMENDATION: Savings milestones hit!', 'success');
        // Massive celebratory double-burst confetti!
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#6366f1', '#06b6d4']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#a855f7']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
    } else {
      addToast(res.message || 'Failed to synchronize ledger goals.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* Header Block */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Savings Orbs</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
            MOTIVATIONAL METRIC TARGETS & LEDGER-SYNCED ORBS
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Synchronize Button */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center justify-center p-2.5 bg-midnight-card border border-midnight-border rounded-xl hover:border-brand-violet transition-colors text-slate-400 hover:text-white disabled:opacity-50"
            title="Recalculate savings progress from ledger transactions"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Create Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:scale-[1.01] active:scale-[0.99] rounded-xl text-xs font-bold text-white shadow-neon-glow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>ESTABLISH OBJECTIVE</span>
          </button>
        </div>
      </header>

      {/* Main Grid: Orbs */}
      {goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          <AnimatePresence mode="popLayout">
            {goals.map((goal) => {
              const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              const isAchieved = percent >= 100;
              const statusColor = isAchieved ? 'emerald' : 'violet';

              return (
                <motion.div
                  key={goal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard glowColor={statusColor} className="flex flex-col justify-between h-96 relative group">
                    
                    {/* Corner Delete Action */}
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="absolute top-4 right-4 p-2.5 rounded-lg bg-midnight/50 border border-midnight-border hover:bg-brand-rose/15 hover:border-brand-rose/30 text-slate-500 hover:text-brand-rose opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Progress Orb Visual */}
                    <div className="flex flex-col items-center justify-center my-4 relative">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        {/* Radial progress ring SVG */}
                        <svg className="w-full h-full transform -rotate-90">
                          <circle 
                            cx="72" 
                            cy="72" 
                            r="58" 
                            stroke="rgba(255,255,255,0.02)" 
                            strokeWidth="8" 
                            fill="transparent" 
                          />
                          <motion.circle 
                            cx="72" 
                            cy="72" 
                            r="58" 
                            stroke={isAchieved ? '#10b981' : '#6366f1'} 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={364}
                            initial={{ strokeDashoffset: 364 }}
                            animate={{ strokeDashoffset: Math.max(0, 364 - (364 * percent) / 100) }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                          />
                        </svg>
                        
                        {/* Glowing progress core inside */}
                        <div className="absolute flex flex-col items-center justify-center">
                          {isAchieved ? (
                            <Trophy className="w-8 h-8 text-brand-emerald animate-bounce" />
                          ) : (
                            <span className="text-xl font-display font-extrabold text-white">{percent.toFixed(0)}%</span>
                          )}
                          <span className="text-[7px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">COMPLETED</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="text-center mt-2 flex-1 flex flex-col justify-end">
                      <h4 className="text-base font-bold text-white">{goal.name}</h4>
                      
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-4 p-2 bg-midnight/20 border border-midnight-border rounded-xl">
                        <div className="text-left">
                          <span className="block text-[8px] text-slate-600">ACCUMULATED</span>
                          <span className="block font-bold text-white">${goal.currentAmount.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] text-slate-600">TARGET DEPOSIT</span>
                          <span className="block font-bold text-white">${goal.targetAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-slate-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>DEADLINE: {new Date(goal.targetDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 glass-panel border-dashed border-midnight-border max-w-lg mx-auto mt-6">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-white">No Savings Objectives Configured</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
            Savings goals pull progress automatically from your transactions. Define a target deposit and watch the progress orb fill dynamically!
          </p>
        </div>
      )}

      {/* Add Goal Modal */}
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
              <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-brand-violet to-transparent" />
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-midnight-border">
                <div>
                  <h4 className="text-sm font-semibold text-white">Establish Savings Target</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">INITIALIZE COMPOUNDING ORB TRACKER</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="p-6 flex flex-col gap-4">
                {/* Goal name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Objective Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Tesla Model Y Fund"
                    className="w-full glass-input text-sm"
                  />
                </div>

                {/* Target Amount */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Target Value (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="15000.00"
                      className="w-full pl-10 glass-input text-sm"
                    />
                  </div>
                </div>

                {/* Target Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">Objective Deadline</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
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
                      <span>ESTABLISH OBJECTIVE</span>
                      <Target className="w-4.5 h-4.5" />
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

export default Goals;
