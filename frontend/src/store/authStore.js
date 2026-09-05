import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,
  error: null,

  // Reset errors
  clearError: () => set({ error: null }),

  // Check auth session on startup
  checkAuth: async () => {
    set({ isInitializing: true });
    try {
      const response = await api.get('/auth/me');
      if (response.data && response.data.success) {
        set({
          user: response.data.data,
          isAuthenticated: true,
          error: null,
        });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      // If 401, session doesn't exist, which is expected for anonymous users
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitializing: false });
    }
  },

  // Register new user
  register: async (username, email, password, fullName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        fullName,
      });

      if (response.data && response.data.success) {
        set({ isLoading: false });
        return { success: true, message: response.data.message };
      }
      set({ isLoading: false, error: response.data.message || 'Registration failed' });
      return { success: false };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Username or email might be taken.';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  // Login user
  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });

      if (response.data && response.data.success) {
        set({
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true };
      }
      set({ isLoading: false, error: response.data.message || 'Login failed' });
      return { success: false };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid username or password.';
      set({ isLoading: false, error: message });
      return { success: false };
    }
  },

  // Logout user
  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout request failed, clearing client state anyway:', err);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },
}));
