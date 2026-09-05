import { create } from 'zustand';
import api from '../services/api';

export const useFinanceStore = create((set, get) => ({
  categories: [],
  transactions: [],
  goals: [],
  monthlyReport: null,
  yearlyReport: null,
  aiInsights: [],
  isLoading: false,
  error: null,

  // Selected periods
  selectedYear: new Date().getFullYear(),
  selectedMonth: new Date().getMonth() + 1,

  setSelectedPeriod: (year, month) => {
    set({ selectedYear: year, selectedMonth: month });
    get().fetchMonthlyReport();
  },

  setSelectedYear: (year) => {
    set({ selectedYear: year });
    get().fetchYearlyReport();
  },

  // ── CATEGORIES ───────────────────────────────────────────────────
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/categories');
      if (response.data && response.data.success) {
        set({ categories: response.data.data });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch categories' });
    } finally {
      set({ isLoading: false });
    }
  },

  createCategory: async (categoryData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/categories', categoryData);
      if (response.data && response.data.success) {
        // Refresh categories
        await get().fetchCategories();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create category' };
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, categoryData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      if (response.data && response.data.success) {
        await get().fetchCategories();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update category' };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(`/categories/${id}`);
      if (response.data && response.data.success) {
        await get().fetchCategories();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete category' };
    } finally {
      set({ isLoading: false });
    }
  },

  // ── TRANSACTIONS ─────────────────────────────────────────────────
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/transactions');
      if (response.data && response.data.success) {
        set({ transactions: response.data.data });
        get().generateAiInsights(); // Recalculate AI insights based on new transactions
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch transactions' });
    } finally {
      set({ isLoading: false });
    }
  },

  createTransaction: async (txData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/transactions', txData);
      if (response.data && response.data.success) {
        await get().fetchTransactions();
        // Refresh reports and goals
        await get().fetchMonthlyReport();
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create transaction' };
    } finally {
      set({ isLoading: false });
    }
  },

  updateTransaction: async (id, txData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/transactions/${id}`, txData);
      if (response.data && response.data.success) {
        await get().fetchTransactions();
        await get().fetchMonthlyReport();
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update transaction' };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(`/transactions/${id}`);
      if (response.data && response.data.success) {
        await get().fetchTransactions();
        await get().fetchMonthlyReport();
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete transaction' };
    } finally {
      set({ isLoading: false });
    }
  },

  // ── SAVINGS GOALS ────────────────────────────────────────────────
  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/goals');
      if (response.data && response.data.success) {
        set({ goals: response.data.data });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch goals' });
    } finally {
      set({ isLoading: false });
    }
  },

  createGoal: async (goalData) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/goals', goalData);
      if (response.data && response.data.success) {
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to create goal' };
    } finally {
      set({ isLoading: false });
    }
  },

  updateGoal: async (id, goalData) => {
    set({ isLoading: true });
    try {
      const response = await api.put(`/goals/${id}`, goalData);
      if (response.data && response.data.success) {
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update goal' };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true });
    try {
      const response = await api.delete(`/goals/${id}`);
      if (response.data && response.data.success) {
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete goal' };
    } finally {
      set({ isLoading: false });
    }
  },

  refreshGoals: async () => {
    set({ isLoading: true });
    try {
      const response = await api.post('/goals/refresh');
      if (response.data && response.data.success) {
        await get().fetchGoals();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to refresh goals' };
    } finally {
      set({ isLoading: false });
    }
  },

  // ── REPORTS ──────────────────────────────────────────────────────
  fetchMonthlyReport: async () => {
    const { selectedYear, selectedMonth } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/reports/monthly?year=${selectedYear}&month=${selectedMonth}`);
      if (response.data && response.data.success) {
        set({ monthlyReport: response.data.data });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch monthly report' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchYearlyReport: async () => {
    const { selectedYear } = get();
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/reports/yearly?year=${selectedYear}`);
      if (response.data && response.data.success) {
        set({ yearlyReport: response.data.data });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch yearly report' });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── AI ENGINE SIMULATOR ──────────────────────────────────────────
  generateAiInsights: () => {
    const { transactions, goals } = get();
    if (transactions.length === 0) {
      set({
        aiInsights: [
          {
            id: '1',
            type: 'neutral',
            title: 'Analyze Financial Footprint',
            desc: 'Start logging your daily expenses and income. I will continuously track patterns and unlock automated saving vectors for you.',
            savingPotential: '$0.00',
          },
          {
            id: '2',
            type: 'info',
            title: 'Dynamic Asset Allocation',
            desc: 'A robust portfolio begins with data consistency. Log your first transaction to unlock savings score analytics.',
            savingPotential: 'Unlock Now',
          }
        ]
      });
      return;
    }

    // Basic calculation of monthly parameters
    const totalIncome = transactions
      .filter((tx) => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const totalExpense = transactions
      .filter((tx) => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    const insights = [];

    // Savings rate analysis
    if (savingsRate > 30) {
      insights.push({
        id: 'sr-high',
        type: 'success',
        title: 'Outstanding Financial Momentum',
        desc: `You are saving ${savingsRate.toFixed(1)}% of your income. This puts you in the top 5% of wealth builders. Consider routing your surplus cash into long-term investments.`,
        savingPotential: `$${(totalIncome * 0.1).toFixed(2)} / mo`,
      });
    } else if (savingsRate > 10) {
      insights.push({
        id: 'sr-mod',
        type: 'info',
        title: 'Optimal Savings Velocity',
        desc: `Your savings rate is ${savingsRate.toFixed(1)}%. We identified that you could easily boost this to 25% by reducing subscriptions or dining out by just 15%.`,
        savingPotential: `$${(totalExpense * 0.15).toFixed(2)} / mo`,
      });
    } else {
      insights.push({
        id: 'sr-low',
        type: 'warning',
        title: 'Capital Preservation Alert',
        desc: `Your savings rate is currently low at ${savingsRate.toFixed(1)}%. Your monthly burn rate is high relative to your income. Let's audit your discretionary categories.`,
        savingPotential: `$${(totalExpense * 0.2).toFixed(2)} / mo`,
      });
    }

    // Category analysis
    const categorySpending = {};
    transactions
      .filter((tx) => tx.type === 'EXPENSE')
      .forEach((tx) => {
        const catName = tx.categoryName || 'Discretionary';
        categorySpending[catName] = (categorySpending[catName] || 0) + tx.amount;
      });

    // Find highest spending category
    let highestCat = '';
    let highestAmt = 0;
    Object.entries(categorySpending).forEach(([cat, amt]) => {
      if (amt > highestAmt) {
        highestAmt = amt;
        highestCat = cat;
      }
    });

    if (highestCat && totalExpense > 0) {
      const percentage = (highestAmt / totalExpense) * 100;
      if (percentage > 25) {
        insights.push({
          id: 'cat-overspend',
          type: 'warning',
          title: `Intense Spending in "${highestCat}"`,
          desc: `Disproportionate allocation detected: "${highestCat}" accounts for ${percentage.toFixed(1)}% of your total expenses. A structured budget cap here will accelerate your savings path.`,
          savingPotential: `$${(highestAmt * 0.25).toFixed(2)} / mo`,
        });
      }
    }

    // Savings Goal proximity analysis
    const activeGoals = goals.filter((g) => g.status === 'ACTIVE');
    if (activeGoals.length > 0) {
      const nearGoal = activeGoals[0];
      const percent = nearGoal.targetAmount > 0 ? (nearGoal.currentAmount / nearGoal.targetAmount) * 100 : 0;
      if (percent > 75 && percent < 100) {
        insights.push({
          id: 'goal-proximity',
          type: 'success',
          title: `Goal "${nearGoal.name}" is Within Reach!`,
          desc: `You are at ${percent.toFixed(1)}% of your goal. Adjusting small expenses this week can trigger the completion milestone early!`,
          savingPotential: 'Almost there!',
        });
      }
    }

    // Fallback general advice
    if (insights.length < 2) {
      insights.push({
        id: 'ai-default',
        type: 'info',
        title: 'Algorithmic Financial Audit',
        desc: 'Keep logging your expenses for another 14 days. Our neural network will outline a customized wealth builder program for you.',
        savingPotential: 'Audit Pending',
      });
    }

    set({ aiInsights: insights });
  },

  // ── CONSOLIDATED INITIALIZATION ──────────────────────────────────
  initializeData: async () => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().fetchCategories(),
        get().fetchTransactions(),
        get().fetchGoals(),
        get().fetchMonthlyReport(),
      ]);
    } catch (err) {
      console.error('Error initializing financial data:', err);
    } finally {
      set({ isLoading: false });
    }
  }
}));
