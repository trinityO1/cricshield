import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveMatchStats } from './hooks/useLiveMatchStats';
import { Header } from './components/Header';
import { ScoreHero } from './components/ScoreHero';
import { BatsmenPanel } from './components/BatsmenPanel';
import { BowlerPanel } from './components/BowlerPanel';
import { OverTimeline } from './components/OverTimeline';
import { BypassButton } from './components/BypassButton';
import { EventToast } from './components/EventToast';

interface AppProps {
  isVisible: boolean;
  onBypass: () => void;
  requireConfirmation?: boolean;
}

export const App: React.FC<AppProps> = ({ isVisible, onBypass, requireConfirmation = false }) => {
  const { matchData, isLoading, error, toasts, removeToast } = useLiveMatchStats(true);

  return (
    <>
      {/* Toast Notifications Container */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <EventToast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              type: 'spring',
              stiffness: 220,
              damping: 26,
              mass: 0.8,
            }}
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#070707',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              padding: '20px',
              boxSizing: 'border-box',
              pointerEvents: 'auto',
            }}
          >
          {/* Bypass Button */}
          <BypassButton onBypass={onBypass} requireConfirmation={requireConfirmation} />

          {/* Main Card */}
          <motion.div
            layout
            style={{
              width: '100%',
              maxWidth: '680px',
              background: '#121212',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.8)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isLoading && !matchData ? (
              <LoadingState />
            ) : error && !matchData ? (
              <ErrorState error={error} />
            ) : matchData ? (
              <>
                <Header title={matchData.title} venue={matchData.venue} />

                {/* Score info & Player details Row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: (matchData.batsmen || matchData.bowler) ? '1.1fr 0.9fr' : '1fr',
                    gap: '16px',
                    padding: '20px 24px',
                    alignItems: 'start',
                  }}
                >
                  <ScoreHero
                    battingTeam={matchData.battingTeam}
                    bowlingTeam={matchData.bowlingTeam}
                    target={matchData.target}
                    requiredRunRate={matchData.requiredRunRate}
                    statusText={matchData.statusText}
                    status={matchData.status}
                  />

                  {(matchData.batsmen || matchData.bowler) && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        height: '100%',
                      }}
                    >
                      {matchData.batsmen && <BatsmenPanel batsmen={matchData.batsmen} />}
                      {matchData.bowler && <BowlerPanel bowler={matchData.bowler} />}
                    </div>
                  )}
                </div>

                {matchData.recentBalls && matchData.recentBalls.length > 0 && (
                  <OverTimeline recentBalls={matchData.recentBalls} />
                )}
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

const LoadingState: React.FC = () => (
  <div
    style={{
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
      color: '#FFFFFF',
    }}
  >
    <div
      style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0, 229, 255, 0.1)',
        borderTop: '3px solid #00E5FF',
        borderRadius: '50%',
        animation: 'cs-spin 1s linear infinite',
      }}
    />
    <span style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>
      Fetching Live Cricket Scorecard...
    </span>
  </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div
    style={{
      padding: '48px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      color: '#FF4444',
    }}
  >
    <span style={{ fontSize: '32px' }}>⚠️</span>
    <span style={{ fontSize: '15px', fontWeight: 700 }}>Connection Error</span>
    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center' }}>
      {error}
    </span>
  </div>
);