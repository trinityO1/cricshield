/**
 * CricShield — Content Script Entry Point
 *
 * Lifecycle:
 * 1. Mounts Shadow DOM over video player container
 * 2. Injects Tailwind/custom CSS into the shadow root
 * 3. Binds AdDetector (DOM MutationObserver + Video element scanner)
 * 4. Listens for HOTSTAR_AD_STARTED from background script
 * 5. Mounts a floating action button 🛡️ for manual score overrides
 */

import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { App } from '../overlay/App';
import { AdDetector } from './ad-detector';

import tailwindStyles from './styles.css?inline';

const HOST_ID = 'cricshield-overlay-host';
const FAB_ID = 'cricshield-fab';
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';

let shadowRoot: ShadowRoot | null = null;
let reactRoot: Root | null = null;
let reactContainer: HTMLDivElement | null = null;
let hostElement: HTMLDivElement | null = null;
let adDetector: AdDetector | null = null;
let isOverlayVisible = false;
let isManualMode = false;
let hotstarAdTimeout: ReturnType<typeof setTimeout> | null = null;

function sendMessage(type: 'MUTE_TAB' | 'UNMUTE_TAB'): void {
  try {
    chrome.runtime.sendMessage({ type }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('[CricShield] Messaging error:', chrome.runtime.lastError.message);
        return;
      }
      if (response && !response.success) {
        console.warn('[CricShield] Background audio shift failed:', response.error);
      }
    });
  } catch (err) {
    console.warn('[CricShield] Messaging failure:', err);
  }
}

function createShadowHost(): void {
  const player = findVideoPlayer();
  const parent = player || document.body;

  const existingHost = document.getElementById(HOST_ID) as HTMLDivElement | null;
  if (existingHost) {
    hostElement = existingHost;
    if (existingHost.parentElement !== parent) {
      console.log('[CricShield] Moving shadow host to active player parent');
      existingHost.style.position = player ? 'absolute' : 'fixed';
      parent.appendChild(existingHost);
      if (player) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.position === 'static') {
          (parent as HTMLElement).style.position = 'relative';
        }
      }
    }
    if (!reactRoot && hostElement.shadowRoot) {
      shadowRoot = hostElement.shadowRoot;
      reactContainer = shadowRoot.getElementById('cricshield-react-root') as HTMLDivElement | null;
      if (reactContainer) {
        reactRoot = createRoot(reactContainer);
      }
    }
    return;
  }

  hostElement = document.createElement('div');
  hostElement.id = HOST_ID;

  if (player) {
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === 'static') {
      (parent as HTMLElement).style.position = 'relative';
    }
  }

  hostElement.style.cssText = `
    position: ${player ? 'absolute' : 'fixed'};
    inset: 0;
    z-index: 2147483647;
    pointer-events: none;
    display: none;
  `;

  parent.appendChild(hostElement);

  shadowRoot = hostElement.attachShadow({ mode: 'open' });

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = GOOGLE_FONTS_URL;
  shadowRoot.appendChild(link);

  const style = document.createElement('style');
  style.textContent = tailwindStyles;
  shadowRoot.appendChild(style);

  // Injected CSS animations keyframes for spinner/pulsar
  const helperStyle = document.createElement('style');
  helperStyle.textContent = `
    @keyframes cs-spin {
      to { transform: rotate(360deg); }
    }
  `;
  shadowRoot.appendChild(helperStyle);

  reactContainer = document.createElement('div');
  reactContainer.id = 'cricshield-react-root';
  reactContainer.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: auto;
  `;
  shadowRoot.appendChild(reactContainer);

  reactRoot = createRoot(reactContainer);
  console.log('[CricShield] Shadow DOM mounted');
}

function findVideoPlayer(): HTMLElement | null {
  const selectors = [
    'video',
    '[class*="player-container"]',
    '[class*="video-player"]',
    '[class*="playerContainer"]',
    '[class*="videoPlayer"]',
    '.jw-wrapper',
    '.shaka-video-container',
  ];

  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) {
      if (el.tagName === 'VIDEO' && el.parentElement) {
        return el.parentElement;
      }
      return el as HTMLElement;
    }
  }
  return null;
}

function createFloatingButton(): void {
  if (document.getElementById(FAB_ID)) return;

  const fab = document.createElement('div');
  fab.id = FAB_ID;
  fab.innerHTML = '🛡️';
  fab.title = 'CricShield: Click to toggle live scores';
  fab.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483646;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(18, 18, 18, 0.85);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 2px solid rgba(0, 229, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 255, 0.15);
    user-select: none;
  `;

  fab.addEventListener('mouseenter', () => {
    fab.style.transform = 'scale(1.08)';
    fab.style.borderColor = 'rgba(0, 229, 255, 0.6)';
    fab.style.boxShadow = '0 6px 24px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 229, 255, 0.3)';
  });

  fab.addEventListener('mouseleave', () => {
    fab.style.transform = 'scale(1)';
    fab.style.borderColor = isOverlayVisible ? 'rgba(255, 68, 68, 0.5)' : 'rgba(0, 229, 255, 0.25)';
    fab.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 229, 255, 0.15)';
  });

  fab.addEventListener('click', () => {
    if (isOverlayVisible) {
      isManualMode = false;
      onAdEnd();
    } else {
      isManualMode = true;
      onAdStart();
    }
  });

  document.body.appendChild(fab);
}

function updateFabStyle(): void {
  const fab = document.getElementById(FAB_ID);
  if (!fab) return;

  if (isOverlayVisible) {
    fab.style.borderColor = 'rgba(255, 68, 68, 0.5)';
    fab.innerHTML = '❌';
    fab.title = 'CricShield: Click to hide overlay';
  } else {
    fab.style.borderColor = 'rgba(0, 229, 255, 0.25)';
    fab.innerHTML = '🛡️';
    fab.title = 'CricShield: Click to show live scores';
  }
}

function showOverlay(): void {
  if (isOverlayVisible) return;

  createShadowHost();

  if (!hostElement || !reactRoot) return;

  isOverlayVisible = true;
  hostElement.style.display = 'block';
  hostElement.style.pointerEvents = 'auto';

  renderOverlay();
  updateFabStyle();
}

function hideOverlay(): void {
  if (!isOverlayVisible) return;

  isOverlayVisible = false;
  renderOverlay();
  updateFabStyle();

  setTimeout(() => {
    if (hostElement && !isOverlayVisible) {
      hostElement.style.display = 'none';
      hostElement.style.pointerEvents = 'none';
    }
  }, 350);
}

function renderOverlay(): void {
  if (!reactRoot) return;
  
  const adIsPlaying = adDetector ? adDetector.getIsAdPlaying() : false;
  const requireConfirmation = adIsPlaying && !isManualMode;

  reactRoot.render(
    React.createElement(App, {
      isVisible: isOverlayVisible,
      onBypass: handleBypass,
      requireConfirmation,
    })
  );
}

function handleBypass(): void {
  if (hotstarAdTimeout) {
    clearTimeout(hotstarAdTimeout);
    hotstarAdTimeout = null;
  }
  hideOverlay();
  sendMessage('UNMUTE_TAB');

  if (adDetector && !isManualMode) {
    adDetector.bypassCurrentAdBreak();
  }
  isManualMode = false;
}

function onAdStart(): void {
  if (!isManualMode) {
    sendMessage('MUTE_TAB');
  }
  showOverlay();
}

function onAdEnd(): void {
  if (!isManualMode) {
    sendMessage('UNMUTE_TAB');
  }
  hideOverlay();
}

// Background Listener for Hotstar telemetry ad trigger
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'HOTSTAR_AD_STARTED') {
    console.log(`[CricShield] Telemetry ad-break caught (duration: ${message.durationMs}ms)`);

    if (hotstarAdTimeout) {
      clearTimeout(hotstarAdTimeout);
    }

    showOverlay();

    hotstarAdTimeout = setTimeout(() => {
      console.log('[CricShield] Telemetry duration complete, returning to match.');
      hotstarAdTimeout = null;
      hideOverlay();
      sendMessage('UNMUTE_TAB');
    }, message.durationMs);
  }
});

function init(): void {
  createFloatingButton();
  createShadowHost();
  renderOverlay();

  adDetector = new AdDetector({
    onAdStart,
    onAdEnd,
  });
  adDetector.start();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('unload', () => {
  if (hotstarAdTimeout) clearTimeout(hotstarAdTimeout);
  if (adDetector) {
    adDetector.stop();
    adDetector = null;
  }
  if (reactRoot) {
    reactRoot.unmount();
    reactRoot = null;
  }
  if (hostElement?.parentElement) {
    hostElement.parentElement.removeChild(hostElement);
    hostElement = null;
  }
  const fab = document.getElementById(FAB_ID);
  if (fab?.parentElement) {
    fab.parentElement.removeChild(fab);
  }
});