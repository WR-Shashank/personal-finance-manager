import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, User, Shield, Sliders, Bell, Sparkles, 
  Terminal, Monitor, HelpCircle, HardDrive, Check
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUiStore } from '../store/uiStore';
import GlassCard from '../components/GlassCard';

const SettingsPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useUiStore();

  // Customization mock states
  const [neonIntensity, setNeonIntensity] = useState('HIGH'); // LOW, HIGH, VIBRANT
  const [audioAlerts, setAudioAlerts] = useState(false);
  const [neuralRecs, setNeuralRecs] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);

  const handleSavePreferences = () => {
    addToast('Preferences written to core local storage!', 'success');
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12 text-left">
      
      {/* Header Block */}
      <header>
        <h1 className="text-3xl font-display font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500 font-mono tracking-wide mt-1">
          OPERATIONAL PREFERENCES & PLATFORM PREFERENCES
        </p>
      </header>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
        
        {/* LEFT COLUMN: Profile Info (Colspan 1) */}
        <div className="flex flex-col gap-6">
          <GlassCard glowColor="violet" className="text-center flex flex-col items-center">
            
            {/* Massive Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-violet to-brand-cyan border border-brand-violet/30 flex items-center justify-center text-white font-display text-3xl font-semibold shadow-neon-glow mb-4">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>

            <h3 className="text-base font-bold text-white leading-tight">{user?.fullName || 'User'}</h3>
            <span className="text-[10px] text-brand-violet font-mono block mt-1 uppercase tracking-wider">ACTIVE EXPLORER</span>

            {/* Profile specifications */}
            <div className="w-full mt-6 pt-6 border-t border-midnight-border flex flex-col gap-3.5 text-left text-xs">
              
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">USERNAME:</span>
                <span className="text-white font-semibold font-mono">@{user?.username}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">EMAIL:</span>
                <span className="text-white font-semibold">{user?.email || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-mono">ACCESS ROLE:</span>
                <span className="text-brand-cyan font-bold font-mono">COCKPIT_PILOT</span>
              </div>

            </div>

          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Customization Toggles (Colspan 2) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* OS UI Customization Card */}
          <GlassCard glowColor="none">
            <div className="flex items-center gap-2.5 mb-6">
              <Sliders className="w-5 h-5 text-brand-violet" />
              <div>
                <h4 className="text-sm font-semibold text-white">Quantum Visual Interface</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">MANAGE VISUAL LIGHTING ACCENTS</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Neon Intensity Selection */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1.5">
                <div>
                  <span className="text-xs font-semibold text-white block">Neon Aura Intensity</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Control the glow shadows behind glass panels</span>
                </div>
                
                <div className="flex bg-midnight/50 border border-midnight-border rounded-xl p-1 text-xs">
                  {['LOW', 'HIGH', 'VIBRANT'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setNeonIntensity(mode)}
                      className={`px-3 py-1.5 rounded-lg font-semibold tracking-wide transition-all ${
                        neonIntensity === mode 
                          ? 'bg-brand-violet/20 text-white shadow-inner' 
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-midnight-border" />

              {/* Quantum Audio toggle */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-xs font-semibold text-white block">Quantum Audio Alerts</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Play atmospheric micro-tones on transaction logs</span>
                </div>
                
                <button
                  onClick={() => setAudioAlerts(!audioAlerts)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 cursor-pointer ${
                    audioAlerts ? 'bg-brand-violet' : 'bg-midnight-border'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all duration-200 ${
                    audioAlerts ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="h-[1px] bg-midnight-border" />

              {/* Neural Recommendations toggle */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <span className="text-xs font-semibold text-white block">Neural Recommendations</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Allow simulated AI model to parse ledger statistics</span>
                </div>
                
                <button
                  onClick={() => setNeuralRecs(!neuralRecs)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 cursor-pointer ${
                    neuralRecs ? 'bg-brand-violet' : 'bg-midnight-border'
                  }`}
                >
                  <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all duration-200 ${
                    neuralRecs ? 'translate-x-5.5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>
          </GlassCard>

          {/* Infrastructure Specifications Card */}
          <GlassCard glowColor="none">
            <div className="flex items-center gap-2.5 mb-6">
              <Terminal className="w-5 h-5 text-brand-cyan" />
              <div>
                <h4 className="text-sm font-semibold text-white">Quantum Tech Stack Specs</h4>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">INFRASTRUCTURE METRICS</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="p-3 bg-midnight/40 border border-midnight-border rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 block">CORE PLATFORM</span>
                <span className="text-white font-semibold mt-1 block">React 18.3 & Vite</span>
              </div>

              <div className="p-3 bg-midnight/40 border border-midnight-border rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 block">STYLING ENGINE</span>
                <span className="text-white font-semibold mt-1 block">Tailwind CSS v3.4</span>
              </div>

              <div className="p-3 bg-midnight/40 border border-midnight-border rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 block">MOTION ORCHESTRATION</span>
                <span className="text-white font-semibold mt-1 block">Framer Motion v11</span>
              </div>

              <div className="p-3 bg-midnight/40 border border-midnight-border rounded-xl">
                <span className="text-[9px] font-mono text-slate-500 block">PERSISTENT LEDGER DATABASE</span>
                <span className="text-white font-semibold mt-1 block">Spring Data JPA + In-Memory H2</span>
              </div>

            </div>
          </GlassCard>

          {/* Action button */}
          <button
            onClick={handleSavePreferences}
            className="py-3 px-6 bg-gradient-to-r from-brand-violet to-brand-cyan rounded-xl text-xs font-bold text-white shadow-neon-glow hover:scale-[1.01] active:scale-[0.99] transition-all self-end"
          >
            WRITE PREFERENCES TO STORAGE
          </button>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;
