import React from 'react';
import { motion } from 'framer-motion';
import type { BowlerStats } from '../../types/cricket';

interface BowlerPanelProps {
  bowler: BowlerStats;
}

const StatBlock: React.FC<{ label: string; value: number | string }> = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'rgba(255, 255, 255, 0.015)',
      borderRadius: '6px',
      padding: '6px 4px',
      border: '1px solid rgba(255, 255, 255, 0.02)',
    }}
  >
    <span
      style={{
        fontSize: '9px',
        fontWeight: 600,
        color: 'rgba(255, 255, 255, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: '13px',
        fontWeight: 700,
        color: '#FFFFFF',
        marginTop: '2px',
      }}
    >
      {value}
    </span>
  </div>
);

export const BowlerPanel: React.FC<BowlerPanelProps> = ({ bowler }) => {
  const economy = parseFloat(String(bowler.economy)) || 0;
  const ecoColor =
    economy <= 6.0
      ? '#00E676'
      : economy <= 8.5
        ? '#00E5FF'
        : economy <= 10.0
          ? '#FF9800'
          : '#FF4444';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
      }}
    >
      <span
        style={{
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          paddingLeft: '4px',
        }}
      >
        Bowling
      </span>
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '12px 14px',
          background: 'rgba(255, 255, 255, 0.01)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.03)',
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
              fontSize: '13px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.85)',
            }}
          >
            {bowler.name}
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            Eco: <strong style={{ color: ecoColor }}>{economy.toFixed(2)}</strong>
          </span>
        </div>

        {/* Figures Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
          }}
        >
          <StatBlock label="O" value={bowler.overs} />
          <StatBlock label="M" value={bowler.maidens} />
          <StatBlock label="R" value={bowler.runsConceded} />
          <StatBlock label="W" value={bowler.wickets} />
        </div>
      </motion.div>
    </div>
  );
};