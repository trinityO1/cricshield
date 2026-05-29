import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BypassButtonProps {
  onBypass: () => void;
  requireConfirmation: boolean;
}

export const BypassButton: React.FC<BypassButtonProps> = ({ onBypass, requireConfirmation }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (!requireConfirmation) {
      onBypass();
      return;
    }
    if (!isConfirming) {
      setIsConfirming(true);
      // Reset confirmation if user doesn't click again in 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }
    onBypass();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
      }}
    >
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: isConfirming
            ? 'rgba(255, 68, 68, 0.15)'
            : 'rgba(255, 255, 255, 0.08)',
          border: isConfirming
            ? '1px solid rgba(255, 68, 68, 0.35)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          color: isConfirming ? '#FF4444' : 'rgba(255, 255, 255, 0.75)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          letterSpacing: '0.02em',
          transition: 'background 0.2s, border 0.2s, color 0.2s',
          boxShadow: isHovered
            ? '0 4px 15px rgba(0, 0, 0, 0.25)'
            : 'none',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
      >
        <span>{isConfirming ? '⚠️ Confirm: Watch Ad?' : (requireConfirmation ? 'Close Scoreboard (Resume Stream)' : 'Close Scoreboard')}</span>
      </motion.button>
    </motion.div>
  );
};