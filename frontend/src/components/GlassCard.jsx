import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ 
  children, 
  className = '', 
  glowColor = 'violet', // 'violet', 'cyan', 'emerald', 'rose', 'neon', 'none'
  hoverEffect = true,
  onClick,
  ...props 
}) => {
  const glowClasses = {
    violet: 'glow-blur-violet',
    cyan: 'glow-blur-cyan',
    emerald: 'glow-blur-emerald',
    rose: 'glow-blur-rose',
    neon: 'glow-blur-neon',
    none: '',
  };

  const cardVariants = {
    initial: { y: 0, scale: 1 },
    hover: hoverEffect ? { 
      y: -5, 
      scale: 1.01,
      transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } 
    } : {},
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onClick={onClick}
      className={`relative glass-panel overflow-hidden glow-border ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {/* Background glow shadow */}
      {glowColor !== 'none' && (
        <div className={`absolute -inset-10 opacity-30 pointer-events-none rounded-2xl ${glowClasses[glowColor]}`} />
      )}
      
      {/* Dynamic grain/noise overlay specific to the card */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

      {/* Card Content */}
      <div className="relative z-10 w-full h-full p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
