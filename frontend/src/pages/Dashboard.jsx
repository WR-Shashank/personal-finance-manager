import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, TrendingUp, TrendingDown, Wallet, Calendar, 
  ArrowUpRight, ArrowDownRight, Bot, Target, HelpCircle, Flame, Milestone
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/authStore';
import { useFinanceStore } from '../store/financeStore';
import { useUiStore } from '../store/uiStore';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { 
    transactions, 
    goals, 
    monthlyReport, 
    aiInsights, 
    initializeData, 
    isLoading,
    selectedYear,
    selectedMonth
  } = useFinanceStore();
  const { addToast } = useUiStore();

  const [greeting, setGreeting] = useState('Welcome back');

  useEffect(() => {
    // Initial fetch of all finances
    initializeData();

    // Determine greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [initializeData]);

  // Aggregate numbers
  const totalIncome = transactions
    .filter((tx) => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

  // Calculate a mock financial health score (0 - 100) based on actual metrics:
  // - Savings rate (up to 50 pts)
  // - Having active goals (15 pts)
  // - High transaction count denoting ledger utilization (15 pts)
  // - Net savings being positive (20 pts)
  let healthScore = 20; // base score
  if (savingsRate > 30) healthScore += 50;
  else if (savingsRate > 0) healthScore += Math.floor(savingsRate * 1.6);
  
  if (goals.length > 0) healthScore += 15;
  if (transactions.length > 5) healthScore += 15;
  if (netSavings > 0) healthScore += 20;
  healthScore = Math.min(Math.max(healthScore, 0), 100);

  // Health Score Description
  const getHealthStatus = (score) => {
    if (score >= 85) return { label: 'Elite Sovereign', color: 'text-brand-emerald', glow: 'shadow-emerald-glow' };
    if (score >= 70) return { label: 'Optimal Stability', color: 'text-brand-cyan', glow: 'shadow-glass-glow' };
    if (score >= 50) return { label: 'Moderate Flow', color: 'text-brand-violet', glow: 'shadow-glass-glow' };
    return { label: 'Capital Drain Risk', color: 'text-brand-rose', glow: 'shadow-rose-glow' };
  };

  const status = getHealthStatus(healthScore);

  // Format Recharts data (last 7 transactions for flow, or monthly aggregation)
  const chartData = transactions
    .slice()
    .reverse()
    .slice(-10)
    .map(tx => ({
      name: new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: tx.amount,
      type: tx.type,
      cumulativeFlow: tx.type === 'INCOME' ? tx.amount : -tx.amount
    }));

  // Fallback chart data if empty
  const fallbackData = [
    { name: 'Phase 1', amount: 0, cumulativeFlow: 0 },
    { name: 'Phase 2', amount: 0, cumulativeFlow: 0 },
    { name: 'Phase 3', amount: 0, cumulativeFlow: 0 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* ── Dynamic Header & Greeting ──────────────────────────────── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              {greeting}, {user?.fullName?.split(' ')[0] || 'Explorer'}
            </h1>
            <Sparkles className="w-5 h-5 text-brand-violet animate-pulse mt-1" />
          </div>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
            INTELLIGENCE COCKPIT SYNCED • STATUS: <span className={status.color}>{status.label.toUpperCase()}</span>
          </p>
        </div>

        {/* Selected Month Widget */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 bg-midnight-card border border-midnight-border backdrop-blur-glass rounded-xl shadow-glass text-xs font-semibold">
          <Calendar className="w-4 h-4 text-brand-violet" />
          <span>
            {new Date(selectedYear, selectedMonth - 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </header>

      {/* ── Main Dashboard Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CORE LEDGER METRICS & GRAPHS (Colspan 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Floating Statistics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Income Card */}
            <GlassCard glowColor="emerald" className="glow-border">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Total Inflows</span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1.5">
                    ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-emerald/10 border border-brand-emerald/20 flex items-center justify-center text-brand-emerald">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-[10px] text-brand-emerald font-semibold font-mono">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+12.4% MONTH-OVER-MONTH</span>
              </div>
            </GlassCard>

            {/* Total Expenses Card */}
            <GlassCard glowColor="rose" className="glow-border">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Total Outflows</span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1.5">
                    ${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-rose/10 border border-brand-rose/20 flex items-center justify-center text-brand-rose">
                  <TrendingDown className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-[10px] text-brand-rose font-semibold font-mono">
                <ArrowDownRight className="w-3.5 h-3.5" />
                <span>EXPENSE BURN RATE: HIGH</span>
              </div>
            </GlassCard>

            {/* Net Savings Card */}
            <GlassCard glowColor="cyan" className="glow-border">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Surplus Surplus</span>
                  <h3 className="text-2xl font-display font-bold text-white mt-1.5">
                    ${netSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan">
                  <Wallet className="w-4.5 h-4.5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-[10px] text-brand-cyan font-semibold font-mono">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>SAVINGS RATE: {savingsRate.toFixed(1)}%</span>
              </div>
            </GlassCard>

          </div>

          {/* Cash Flow Visualizer Chart */}
          <GlassCard glowColor="none" className="h-80 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Quantum Capital Flow</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">TIMELINE TREND OF RECENT TRANSACTION FLOWS</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono font-semibold">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-violet shadow-neon-glow" />
                  <span>CUMULATIVE CHANGE ($)</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length > 0 ? chartData : fallbackData}>
                  <defs>
                    <linearGradient id="colorGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(255,255,255,0.1)" 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.1)" 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    dx={-10}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeFlow" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorGlow)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Recent Activity Timeline */}
          <GlassCard glowColor="none">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-sm font-semibold text-white">Recent Core Ledger Activity</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">MOST RECENT ACQUIRED TRANSACTIONS</p>
              </div>
            </div>

            {transactions.length > 0 ? (
              <div className="flex flex-col gap-4">
                {transactions.slice(0, 4).map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex justify-between items-center p-3 bg-midnight/20 border border-midnight-border rounded-xl hover:border-white/10 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        tx.type === 'INCOME' ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-brand-rose/10 text-brand-rose'
                      }`}>
                        {tx.type === 'INCOME' ? 'IN' : 'OUT'}
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">{tx.description}</span>
                        <span className="text-[10px] text-slate-500 font-mono block mt-0.5 uppercase">
                          {tx.categoryName || 'Discretionary'} • {new Date(tx.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${
                        tx.type === 'INCOME' ? 'text-brand-emerald' : 'text-slate-300'
                      }`}>
                        {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </span>
                      {tx.notes && <span className="text-[9px] text-slate-600 font-mono block mt-0.5">{tx.notes}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">
                No recent activity. Track your first transaction to initialize.
              </div>
            )}
          </GlassCard>

        </div>

        {/* RIGHT COLUMN: AI INTELLIGENCE & HEALTH RATINGS (Colspan 4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Futuristic Health Score Gauge */}
          <GlassCard glowColor="violet" className="flex flex-col items-center text-center">
            <div className="flex items-center gap-1 text-[10px] font-mono text-brand-violet uppercase tracking-widest font-bold mb-4 self-start">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Flow Health Rating</span>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="64" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="8" 
                  fill="transparent" 
                />
                <motion.circle 
                  cx="80" 
                  cy="80" 
                  r="64" 
                  stroke="url(#healthGradient)" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={402}
                  initial={{ strokeDashoffset: 402 }}
                  animate={{ strokeDashoffset: 402 - (402 * healthScore) / 100 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Score text inside */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-display font-extrabold text-white">{healthScore}</span>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Index Rating</span>
              </div>
            </div>

            <div className="w-full mt-2">
              <span className={`text-sm font-bold block ${status.color}`}>{status.label}</span>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                {healthScore >= 80 
                  ? 'Your surplus generation is highly secure. Routing surplus to dynamic savings vectors is recommended.' 
                  : healthScore >= 50 
                    ? 'Your operational runway is stable, but high fixed expenses limit compound velocity.' 
                    : 'Critical operational warning. Your ledger experiences severe cash leakage.'}
              </p>
            </div>
          </GlassCard>

          {/* AI Advisor Panel */}
          <GlassCard glowColor="neon">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-brand-neon/10 border border-brand-neon/20 flex items-center justify-center text-brand-neon">
                <Bot className="w-4.5 h-4.5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI Financial Copilot</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">DYNAMIC DECISION MATRIX</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {aiInsights.map((insight) => (
                <div 
                  key={insight.id} 
                  className={`p-3 bg-midnight-panel/30 border rounded-xl flex flex-col gap-2 relative overflow-hidden ${
                    insight.type === 'success' ? 'border-brand-emerald/20' :
                    insight.type === 'warning' ? 'border-brand-rose/20' : 'border-midnight-border'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-white">{insight.title}</span>
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                      insight.type === 'success' ? 'bg-brand-emerald/10 text-brand-emerald' :
                      insight.type === 'warning' ? 'bg-brand-rose/10 text-brand-rose' : 'bg-brand-blue/10 text-brand-blue'
                    }`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{insight.desc}</p>
                  
                  {/* Divider line */}
                  <div className="h-[1px] bg-midnight-border my-0.5" />
                  
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase tracking-widest font-bold">Savings Yield</span>
                    <span className={insight.type === 'success' ? 'text-brand-emerald font-bold' : 'text-brand-cyan font-bold'}>
                      {insight.savingPotential}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Active Goals & Confetti Trackers */}
          <GlassCard glowColor="none">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-semibold text-white">Target Milestones</h4>
              <button className="w-6 h-6 rounded-lg bg-midnight/40 border border-midnight-border flex items-center justify-center hover:border-brand-violet transition-colors">
                <Target className="w-3.5 h-3.5 text-brand-violet" />
              </button>
            </div>

            {goals.length > 0 ? (
              <div className="flex flex-col gap-4">
                {goals.slice(0, 2).map((goal) => {
                  const percent = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                  return (
                    <div key={goal.id} className="flex flex-col gap-2 p-3 bg-midnight/20 border border-midnight-border rounded-xl">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">{goal.name}</span>
                        <span className="font-mono text-slate-400 font-medium">{percent.toFixed(0)}%</span>
                      </div>
                      
                      {/* Premium Progress Track */}
                      <div className="w-full h-1.5 bg-midnight-border rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut' }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mt-0.5">
                        <span>${goal.currentAmount} SAVED</span>
                        <span>TARGET: ${goal.targetAmount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                No active savings goals found. Navigate to savings center to configure.
              </div>
            )}
          </GlassCard>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
