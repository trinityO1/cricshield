import React from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  title: string;
  venue: string;
}

export const Header: React.FC<HeaderProps> = ({ title, venue }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Left: Match Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {/* LIVE Indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 68, 68, 0.15)',
              border: '1px solid rgba(255, 68, 68, 0.3)',
              borderRadius: '20px',
              padding: '3px 10px',
            }}
          >
            <span
              className="cs-live-pulse"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#FF4444',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#FF4444',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              LIVE
            </span>
          </div>
        </div>
        <span
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 500,
          }}
        >
          {venue}
        </span>
      </div>

      {/* Right: Actions and Branding */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Premium GitHub Button */}
        <a
          href="https://github.com/trinityO1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            color: '#070707',
            fontWeight: 800,
            fontSize: '11px',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '7px 14px',
            borderRadius: '10px',
            textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.03)';
            e.currentTarget.style.boxShadow = '0 6px 22px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5)';
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
          }}
        >
          <svg
            height="13"
            width="13"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ display: 'inline-block', verticalAlign: 'middle' }}
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span style={{ fontWeight: 800 }}>★ trinityO1</span>
        </a>


      </div>
    </motion.div>
  );
};