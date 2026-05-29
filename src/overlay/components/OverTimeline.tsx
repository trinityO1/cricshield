import React from 'react';
import { motion } from 'framer-motion';
import type { BallEvent } from '../../types/cricket';

interface OverTimelineProps {
  recentBalls: BallEvent[];
}

function getBallStyles(ball: BallEvent): {
  bg: string;
  color: string;
  border: string;
} {
  if (ball.isWicket) {
    return {
      bg: 'rgba(255, 68, 68, 0.16)',
      color: '#FF4444',
      border: '1px solid rgba(255, 68, 68, 0.35)',
    };
  }

  switch (ball.runs) {
    case 0:
      return {
        bg: 'rgba(255, 255, 255, 0.05)',
        color: 'rgba(255, 255, 255, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      };
    case 4:
      return {
        bg: 'rgba(0, 229, 255, 0.12)',
        color: '#00E5FF',
        border: '1px solid rgba(0, 229, 255, 0.3)',
      };
    case 6:
      return {
        bg: 'rgba(255, 215, 0, 0.12)',
        color: '#FFD700',
        border: '1px solid rgba(255, 215, 0, 0.3)',
      };
    default:
      return {
        bg: 'rgba(255, 255, 255, 0.08)',
        color: '#FFFFFF',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      };
  }
}

export const OverTimeline: React.FC<OverTimelineProps> = ({ recentBalls }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '16px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Recent Over
        </span>
        <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.35)', fontWeight: 500 }}>
          Scroll left to view previous events
        </span>
      </div>

      {/* Pill Row */}
      <div
        className="cs-scroll-premium"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}
      >
        {recentBalls.map((ball, idx) => {
          const styles = getBallStyles(ball);
          return (
            <motion.div
              key={idx}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.03, type: 'spring', stiffness: 200 }}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: styles.bg,
                border: styles.border,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                color: styles.color,
                flexShrink: 0,
                boxShadow: ball.runs >= 4 || ball.isWicket ? `0 0 10px ${styles.color}15` : 'none',
              }}
            >
              {ball.label}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};