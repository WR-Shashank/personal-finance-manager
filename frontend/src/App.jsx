import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuthStore } from './store/authStore';

// Layouts & Shells
import SidebarLayout from './layouts/SidebarLayout';

// Core Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Goals from './pages/Goals';
import Categories from './pages/Categories';
import Settings from './pages/Settings';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) return null; // Let the main App render the loader
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AnonymousRoute = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) return null;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const { checkAuth, isInitializing } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Premium holographic loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#030012] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-violet/10 blur-[120px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-cyan/10 blur-[90px] top-1/3 left-1/3 animate-pulse" />
        
        {/* Grain overlay */}
        <div className="grain-overlay" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Logo animation */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center shadow-neon-glow animate-spin-slow">
            <Sparkles className="w-7 h-7 text-white" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <span className="font-display font-extrabold text-white text-lg tracking-tight">SYFE</span>
            <span className="text-[9px] font-mono text-brand-violet font-bold tracking-widest uppercase">Initializing Cockpit...</span>
          </div>

          {/* Hologram loader bar */}
          <div className="w-40 h-[2px] bg-midnight-border rounded-full overflow-hidden mt-2 relative">
            <div className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan w-1/2 rounded-full absolute animate-shimmer" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public / Onboarding routes */}
        <Route path="/login" element={
          <AnonymousRoute>
            <Login />
          </AnonymousRoute>
        } />
        
        <Route path="/register" element={
          <AnonymousRoute>
            <Register />
          </AnonymousRoute>
        } />

        {/* Secure fintech shell */}
        <Route path="/" element={
          <ProtectedRoute>
            <SidebarLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="goals" element={<Goals />} />
          <Route path="categories" element={<Categories />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
