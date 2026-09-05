import { create } from 'zustand';

export const useUiStore = create((set, get) => ({
  toasts: [],
  isCommandPaletteOpen: false,

  // Toast Management
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };
    
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    // Auto-discard after 3.5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 3500);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Command Palette Management
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPalette: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
}));
