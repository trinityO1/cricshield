import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TeamScore } from '../../types/cricket';

interface ScoreHeroProps {
  battingTeam: TeamScore;
  bowlingTeam: TeamScore;
  target: number | null;
  requiredRunRate: number | null;
  statusText?: string;
  status?: 'live' | 'completed' | 'upcoming';
}

const AnimatedNumber: React.FC<{ value: number | string }> = ({ value }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={String(value)}
      initial={{ y: 15, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -15, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ display: 'inline-block' }}
    >
      {value}
    </motion.span>
  </AnimatePresence>
);

export const ScoreHero: React.FC<ScoreHeroProps> = ({
  battingTeam,
  bowlingTeam,
  target,
  requiredRunRate,
  statusText,
  status,
}) => {
  if (status === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4, type: 'spring' }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px',
          gap: '20px',
          width: '100%',
        }}
      >
        {/* Trophy & Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#FFD700',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span>🏆</span>
          <span>Match Completed</span>
        </div>

        {/* Winner Banner */}
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#00E5FF',
            textAlign: 'center',
            padding: '12px 24px',
            background: 'rgba(0, 229, 255, 0.06)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 229, 255, 0.05)',
            maxWidth: '90%',
            lineHeight: '1.4',
          }}
        >
          {statusText || "Match Finished"}
        </div>

        {/* Both Team Scores Side by Side */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%',
            marginTop: '12px',
            gap: '16px',
          }}
        >
          {/* Batting Team (Final) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              flex: 1,
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {battingTeam.teamShort}
            </span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
              {battingTeam.runs}/{battingTeam.wickets}
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', marginTop: '2px' }}>
              ({battingTeam.overs} ov)
            </span>
          </div>

          {/* Bowling Team (Final) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: '12px',
              flex: 1,
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {bowlingTeam.teamShort}
            </span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', marginTop: '6px' }}>
              {bowlingTeam.runs > 0 ? `${bowlingTeam.runs}/${bowlingTeam.wickets}` : 'N/A'}
            </span>
            {parseFloat(bowlingTeam.overs) > 0 && (
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', marginTop: '2px' }}>
                ({bowlingTeam.overs} ov)
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15, duration: 0.4, type: 'spring' }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        gap: '12px',
      }}
    >
      {/* Team vs Team Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          fontSize: '14px',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.45)',
          letterSpacing: '0.05em',
        }}
      >
        <span>{battingTeam.teamShort}</span>
        <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>vs</span>
        <span>{bowlingTeam.teamShort}</span>
      </div>

      {/* Main Score Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '2px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
        }}
      >
        <span style={{ fontSize: '56px', color: '#FFFFFF' }}>
          <AnimatedNumber value={battingTeam.runs} />
        </span>
        <span style={{ fontSize: '42px', color: 'rgba(255, 255, 255, 0.3)', margin: '0 4px' }}>
          /
        </span>
        <span style={{ fontSize: '48px', color: '#00E5FF' }}>
          <AnimatedNumber value={battingTeam.wickets} />
        </span>

        {/* Overs Indicator */}
        <span
          style={{
            fontSize: '18px',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.4)',
            marginLeft: '16px',
            letterSpacing: '0.02em',
          }}
        >
          (<AnimatedNumber value={battingTeam.overs} /> overs)
        </span>
      </div>

      {/* Run Rates Grid */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '8px 20px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Run Rate
          </span>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>
            {battingTeam.runRate}
          </span>
        </div>

        {requiredRunRate !== null && (
          <>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Required Run Rate
              </span>
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFD700', marginTop: '2px' }}>
                {requiredRunRate}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Target Chase message / Status Text */}
      {statusText ? (
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.85)',
            background: 'rgba(0, 229, 255, 0.05)',
            border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '24px',
            padding: '6px 18px',
            marginTop: '4px',
            textAlign: 'center',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.05)',
          }}
        >
          {statusText}
        </div>
      ) : target !== null && (
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.8)',
            background: 'rgba(255, 215, 0, 0.05)',
            border: '1px solid rgba(255, 215, 0, 0.15)',
            borderRadius: '24px',
            padding: '6px 16px',
            marginTop: '4px',
          }}
        >
          {battingTeam.teamShort} needs{' '}
          <span style={{ color: '#FFD700', fontWeight: 700 }}>
            {target - battingTeam.runs}
          </span>{' '}
          runs to win from{' '}
          <span style={{ color: '#FFFFFF', fontWeight: 700 }}>
            {Math.max(0, 120 - Math.floor(parseFloat(battingTeam.overs) * 6))}
          </span>{' '}
          balls
        </div>
      )}
    </motion.div>
  );
};