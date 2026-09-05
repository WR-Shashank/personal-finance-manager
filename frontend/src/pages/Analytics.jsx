import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Calendar, PieChart, TrendingUp, DollarSign, Wallet, 
  HelpCircle, Sparkles, LayoutGrid, ListFilter, ArrowRight, BookOpen
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart as RechartsPieChart, Pie, Cell, Sector
} from 'recharts';
import { useFinanceStore } from '../store/financeStore';
import GlassCard from '../components/GlassCard';

const Analytics = () => {
  const { 
    fetchMonthlyReport, 
    fetchYearlyReport, 
    monthlyReport, 
    yearlyReport, 
    selectedYear, 
    selectedMonth, 
    setSelectedPeriod,
    setSelectedYear,
    isLoading 
  } = useFinanceStore();

  const [activeChartTab, setActiveChartTab] = useState('CATEGORIES'); // CATEGORIES, TIMELINE
  const [activeIndex, setActiveIndex] = useState(0); // for active pie slice

  useEffect(() => {
    fetchMonthlyReport();
    fetchYearlyReport();
  }, [fetchMonthlyReport, fetchYearlyReport, selectedYear, selectedMonth]);

  const handlePeriodChange = (monthOffset) => {
    let nextMonth = selectedMonth + monthOffset;
    let nextYear = selectedYear;
    
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    } else if (nextMonth < 1) {
      nextMonth = 12;
      nextYear -= 1;
    }
    
    setSelectedPeriod(nextYear, nextMonth);
  };

  const handleYearChange = (yearOffset) => {
    setSelectedYear(selectedYear + yearOffset);
  };

  // Prepare Pie Chart data from monthlyReport
  const rawPieData = monthlyReport?.expenseByCategory || [];
  const pieData = rawPieData.map((c) => ({
    name: c.categoryName,
    value: c.totalAmount,
    percentage: c.percentage,
  }));

  const COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#a855f7', '#ec4899', '#f43f5e', '#10b981', '#f59e0b'];

  // Prepare Bar Chart data from yearlyReport
  const rawBarData = yearlyReport?.monthlySummaries || [];
  const barData = rawBarData.map((m) => ({
    name: m.monthName,
    Income: m.totalIncome,
    Expense: m.totalExpense,
    Savings: m.totalIncome - m.totalExpense,
  }));

  // Recharts custom active shape renderer for Pie Chart
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = sx + (cos >= 0 ? 1 : -1) * 22;
    const ey = sy;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#fff" className="font-display font-bold text-sm">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" className="text-xs font-semibold">
          {`$${value.toFixed(2)}`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#64748b" className="text-[10px] font-mono">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
      </g>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* Header Block */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Analytics Intelligence</h1>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
            ADVANCED FLOW COMPUTATION & SEGMENTATION RATIOS
          </p>
        </div>

        {/* Custom Timeline Year/Month Controls */}
        <div className="flex items-center gap-2">
          {activeChartTab === 'CATEGORIES' ? (
            <div className="flex items-center bg-midnight-card border border-midnight-border rounded-xl p-1 text-xs">
              <button 
                onClick={() => handlePeriodChange(-1)} 
                className="px-2.5 py-1.5 hover:bg-midnight/60 rounded-lg text-slate-400 hover:text-white"
              >
                ◀
              </button>
              <span className="px-3 py-1.5 font-bold text-white uppercase tracking-wider">
                {new Date(selectedYear, selectedMonth - 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </span>
              <button 
                onClick={() => handlePeriodChange(1)}
                className="px-2.5 py-1.5 hover:bg-midnight/60 rounded-lg text-slate-400 hover:text-white"
              >
                ▶
              </button>
            </div>
          ) : (
            <div className="flex items-center bg-midnight-card border border-midnight-border rounded-xl p-1 text-xs">
              <button 
                onClick={() => handleYearChange(-1)} 
                className="px-2.5 py-1.5 hover:bg-midnight/60 rounded-lg text-slate-400 hover:text-white"
              >
                ◀
              </button>
              <span className="px-4 py-1.5 font-bold text-white">
                YEAR: {selectedYear}
              </span>
              <button 
                onClick={() => handleYearChange(1)}
                className="px-2.5 py-1.5 hover:bg-midnight/60 rounded-lg text-slate-400 hover:text-white"
              >
                ▶
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Selector Tabs (Categories Breakdown vs Annual Cash Flow) */}
      <div className="flex bg-midnight-card border border-midnight-border max-w-sm rounded-xl p-1 text-xs self-start">
        <button
          onClick={() => setActiveChartTab('CATEGORIES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold tracking-wide transition-all ${
            activeChartTab === 'CATEGORIES' 
              ? 'bg-brand-violet/20 text-white shadow-inner' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>CATEGORY RATIOS</span>
        </button>
        <button
          onClick={() => setActiveChartTab('TIMELINE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold tracking-wide transition-all ${
            activeChartTab === 'TIMELINE' 
              ? 'bg-brand-violet/20 text-white shadow-inner' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>ANNUAL TIMELINE</span>
        </button>
      </div>

      {/* Main Charts Matrix */}
      <AnimatePresence mode="wait">
        {activeChartTab === 'CATEGORIES' ? (
          <motion.div
            key="categories-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Pie Chart Card (Colspan 7) */}
            <GlassCard glowColor="violet" className="lg:col-span-7 h-96 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Expense Share Allocations</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">SEGMENT OUTFLOW RATING BY DISCRETIONARY CAP</p>
              </div>

              {pieData.length > 0 ? (
                <div className="flex-1 w-full min-h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        onMouseEnter={(_, index) => setActiveIndex(index)}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
                  <HelpCircle className="w-8 h-8 text-slate-600 mb-2" />
                  <span>No outflow allocations recorded for this billing cycle.</span>
                </div>
              )}
            </GlassCard>

            {/* Category Data List & Insights (Colspan 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <GlassCard glowColor="none" className="max-h-96 overflow-y-auto scrollbar-thin">
                <h4 className="text-sm font-semibold text-white mb-4">Allocation Details</h4>
                {pieData.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {pieData.map((item, idx) => (
                      <div 
                        key={item.name} 
                        className="flex items-center justify-between p-3 bg-midnight/20 border border-midnight-border rounded-xl"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <span className="text-xs font-semibold text-white">{item.name}</span>
                        </div>
                        <div className="text-right font-mono text-[11px]">
                          <span className="text-white block font-bold">${item.value.toFixed(2)}</span>
                          <span className="text-slate-500 block mt-0.5">{item.percentage.toFixed(1)}% of total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    List empty. Seed ledger items to view.
                  </div>
                )}
              </GlassCard>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timeline-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-6"
          >
            {/* Double Bar Chart for Income vs Expenses */}
            <GlassCard glowColor="cyan" className="h-[450px] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Comparative Annual Cash Flows</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">MONTHLY INFLOWS VS OUTFLOWS SEGMENTED ACCUMULATION</p>
              </div>

              {barData.length > 0 ? (
                <div className="flex-1 w-full min-h-[300px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.06)" 
                        tick={{ fill: '#64748b', fontSize: 10 }}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.06)" 
                        tick={{ fill: '#64748b', fontSize: 10 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Savings" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                  No timeline data recorded.
                </div>
              )}
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Structural Ratios & Ratios Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        
        {/* Core Ratios */}
        <GlassCard glowColor="none">
          <h4 className="text-sm font-semibold text-white mb-4">Sovereign Metrics Breakdown</h4>
          <div className="flex flex-col gap-4">
            
            {/* Liquidity Ratio */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Capital Surplus Rate</span>
                <span className="font-mono font-bold text-brand-emerald">
                  {monthlyReport ? ((monthlyReport.netSavings / (monthlyReport.totalIncome || 1)) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full h-1 bg-midnight-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-emerald" 
                  style={{ width: `${monthlyReport ? Math.max(0, Math.min(100, (monthlyReport.netSavings / (monthlyReport.totalIncome || 1)) * 100)) : 0}%` }}
                />
              </div>
            </div>

            {/* Discretionary Burn rate */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-400">Fixed Burden Ratio</span>
                <span className="font-mono font-bold text-brand-rose">
                  {monthlyReport ? ((monthlyReport.totalExpense / (monthlyReport.totalIncome || 1)) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="w-full h-1 bg-midnight-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-rose" 
                  style={{ width: `${monthlyReport ? Math.max(0, Math.min(100, (monthlyReport.totalExpense / (monthlyReport.totalIncome || 1)) * 100)) : 0}%` }}
                />
              </div>
            </div>

          </div>
        </GlassCard>

        {/* Quick Advisor Insight */}
        <GlassCard glowColor="none" className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet shrink-0 mt-1">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Wealth Accelerator Audit</h4>
            <p className="text-xs text-slate-400 leading-relaxed mt-1">
              Your largest outflow sector this cycle is currently analyzed. Trimming high-burn expenditures and routing $150 extra into active high-yield savings objectives will accelerate your savings goals completion dates by up to 22 days!
            </p>
          </div>
        </GlassCard>

      </div>

    </div>
  );
};

export default Analytics;
