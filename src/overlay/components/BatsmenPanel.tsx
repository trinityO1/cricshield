import React from 'react';
import { motion } from 'framer-motion';
import type { BatsmanStats } from '../../types/cricket';

interface BatsmenPanelProps {
  batsmen: BatsmanStats[];
}

const BatsmanRow: React.FC<{ batsman: BatsmanStats; index: number }> = ({
  batsman,
  index,
}) => {
  const srPercent = Math.min(100, (batsman.strikeRate / 250) * 100);
  const srColor =
    batsman.strikeRate >= 150
      ? '#FFD700'
      : batsman.strikeRate >= 100
        ? '#00E5FF'
        : 'rgba(255, 255, 255, 0.4)';

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.35 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        padding: '10px 14px',
        background: batsman.isOnStrike
          ? 'rgba(0, 229, 255, 0.04)'
          : 'rgba(255, 255, 255, 0.01)',
        borderRadius: '8px',
        border: batsman.isOnStrike
          ? '1px solid rgba(0, 229, 255, 0.12)'
          : '1px solid rgba(255, 255, 255, 0.03)',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {batsman.isOnStrike && (
            <span
              className="cs-live-pulse"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#00E5FF',
                flexShrink: 0,
              }}
            />
          )}
          <span
            style={{
              fontSize: '13px',
              fontWeight: batsman.isOnStrike ? 700 : 500,
              color: batsman.isOnStrike ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
            }}
          >
            {batsman.name}
          </span>
        </div>

        {/* Score & Balls */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
            {batsman.runs}
          </span>
          <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.45)' }}>
            ({batsman.balls})
          </span>
        </div>
      </div>

      {/* Stats Subline: Boundaries and Strike Rate */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'rgba(255, 255, 255, 0.4)',
        }}
      >
        <span>
          4s: <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{batsman.fours}</strong> &nbsp;
          6s: <strong style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{batsman.sixes}</strong>
        </span>
        <span>
          SR:{' '}
          <strong style={{ color: srColor }}>
            {Number.isFinite(batsman.strikeRate) ? batsman.strikeRate.toFixed(1) : '0.0'}
          </strong>
        </span>
      </div>

      {/* Visual Strike Rate progress bar */}
      <div
        style={{
          width: '100%',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginTop: '2px',
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${srPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: srColor,
          }}
        />
      </div>
    </motion.div>
  );
};

export const BatsmenPanel: React.FC<BatsmenPanelProps> = ({ batsmen }) => {
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
        Batting
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {batsmen.map((batsman, index) => (
          <BatsmanRow key={batsman.name || index} batsman={batsman} index={index} />
        ))}
      </div>
    </div>
  );
};