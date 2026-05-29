import React from 'react';
import { motion } from 'framer-motion';

interface ToastData {
  id: string;
  type: '4' | '6' | 'W';
  text: string;
  details?: string;
}

interface EventToastProps {
  toast: ToastData;
  onRemove: () => void;
}

export const EventToast: React.FC<EventToastProps> = ({ toast, onRemove }) => {
  let titleColor = '#FFFFFF';
  let glowColor = 'rgba(255, 255, 255, 0.2)';
  let borderColor = 'rgba(255, 255, 255, 0.15)';
  let bgGradient = 'linear-gradient(135deg, rgba(20, 20, 20, 0.85) 0%, rgba(10, 10, 10, 0.95) 100%)';
  let badgeText = '';
  let badgeBg = '';

  if (toast.type === '6') {
    titleColor = '#00E5FF'; // Electric Cyan
    glowColor = 'rgba(0, 229, 255, 0.35)';
    borderColor = 'rgba(0, 229, 255, 0.35)';
    badgeText = '6';
    badgeBg = 'linear-gradient(135deg, #7000FF 0%, #00E5FF 100%)';
  } else if (toast.type === '4') {
    titleColor = '#FFB800'; // Amber Orange
    glowColor = 'rgba(255, 184, 0, 0.35)';
    borderColor = 'rgba(255, 184, 0, 0.35)';
    badgeText = '4';
    badgeBg = 'linear-gradient(135deg, #FF5C00 0%, #FFB800 100%)';
  } else if (toast.type === 'W') {
    titleColor = '#FF3B30'; // Crimson Red
    glowColor = 'rgba(255, 59, 48, 0.45)';
    borderColor = 'rgba(255, 59, 48, 0.45)';
    badgeText = 'W';
    badgeBg = 'linear-gradient(135deg, #E60000 0%, #FF3B30 100%)';
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 80, scale: 0.85 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 24,
        mass: 0.8
      }}
      style={{
        width: '300px',
        background: bgGradient,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: `0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px ${glowColor}`,
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      {/* Event Badge Icon */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: badgeBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 900,
          fontSize: '20px',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          textShadow: '0 2px 4px rgba(0,0,0,0.4)',
          flexShrink: 0,
        }}
      >
        {badgeText}
      </div>

      {/* Details */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: titleColor,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}
        >
          {toast.type === 'W' ? 'Wicket Down!' : toast.type === '6' ? 'Monster Six!' : 'Boundary Four!'}
        </span>
        <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.95)' }}>
          {toast.text || 'Boundary Scored'}
        </span>
        {toast.details && (
          <span style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255, 255, 255, 0.5)' }}>
            {toast.details}
          </span>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s',
          marginLeft: '4px',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)')}
      >
        ✕
      </button>
    </motion.div>
  );
};
