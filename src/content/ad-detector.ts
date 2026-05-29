/**
 * CricShield — Ad Detection Engine
 *
 * Multi-signal heuristic ad detection for JioCinema and Hotstar.
 * Uses MutationObserver + video element state monitoring.
 *
 * Detection signals:
 * 1. DOM: Watches for ad-related elements (containers, skip buttons, countdown timers)
 * 2. Video: Monitors for src changes, ad metadata attributes, player state shifts
 * 3. Text: Scans for "Ad" / "Advertisement" labels appearing in player UI
 */

const AD_SELECTOR_PATTERNS = [
  // Common ad container patterns
  '[class*="ad-overlay"]',
  '[class*="ad-container"]',
  '[class*="ad-banner"]',
  '[class*="advertisement"]',
  '[class*="adBreak"]',
  '[class*="ad-break"]',
  '[class*="preroll"]',
  '[class*="midroll"]',
  '[id*="ad-container"]',
  '[id*="ad-overlay"]',
  // Skip button patterns
  '[class*="skip-ad"]',
  '[class*="skipAd"]',
  '[class*="skip-button"]',
  '[class*="ad-skip"]',
  'div[class*="AdSkip"]',
  // Countdown / timer patterns
  '[class*="ad-timer"]',
  '[class*="ad-countdown"]',
  '[class*="adCountdown"]',
  'div[class*="AdDuration"]',
  // JioCinema specific
  '.bx-ads',
  '[class*="bx-ads"]',
  '[class*="jio-ad"]',
  'span[class*="AdIndicator"]',
  '.shaka-ad-container',
  // Hotstar specific
  '[class*="ad-unit"]',
  '[class*="adUnit"]',
  '.ad-container',
];

const AD_TEXT_PATTERNS = [
  /^ad$/i,
  /^ads$/i,
  /advertisement/i,
  /skip\s*ad/i,
  /ad\s*\d+\s*of\s*\d+/i, // "Ad 1 of 2"
  /ad\s*in\s*\d+/i,        // "Ad in 5"
  /your\s*video\s*will\s*resume/i,
];

export interface AdDetectorCallbacks {
  onAdStart: () => void;
  onAdEnd: () => void;
}

export class AdDetector {
  private observer: MutationObserver | null = null;
  private videoCheckInterval: ReturnType<typeof setInterval> | null = null;
  private callbacks: AdDetectorCallbacks;
  private isAdPlaying = false;
  private bypassCurrentBreak = false;
  private lastVideoSrc = '';
  private devModeEnabled = false;

  constructor(callbacks: AdDetectorCallbacks) {
    this.callbacks = callbacks;
  }

  /** Start monitoring for ads */
  start(): void {
    this.setupMutationObserver();
    this.setupVideoMonitor();
    this.setupDevModeShortcut();
    console.log('[CricShield] Ad detection engine started');
  }

  /** Stop monitoring and clean up all listeners */
  stop(): void {
    this.disconnectObserver();
    this.stopVideoMonitor();
    this.removeDevModeShortcut();
    console.log('[CricShield] Ad detection engine stopped');
  }

  /** Flag current ad break as bypassed (user chose to watch ad) */
  bypassCurrentAdBreak(): void {
    this.bypassCurrentBreak = true;
    if (this.isAdPlaying) {
      this.isAdPlaying = false;
      this.callbacks.onAdEnd();
    }
    console.log('[CricShield] Current ad break bypassed by user');
  }

  /** Check if an ad is currently detected */
  getIsAdPlaying(): boolean {
    return this.isAdPlaying;
  }

  /* ─── MutationObserver ─── */
  private setupMutationObserver(): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              this.checkElementForAd(node);
            }
          }
          for (const node of mutation.removedNodes) {
            if (node instanceof HTMLElement && this.isAdPlaying) {
              this.checkIfAdEnded();
            }
          }
        }

        if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
          this.checkElementForAd(mutation.target);
          if (this.isAdPlaying) {
            this.checkIfAdEnded();
          }
        }
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'src', 'data-ad', 'data-adbreak'],
    });
  }

  private disconnectObserver(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  /* ─── Video Element Monitor ─── */
  private setupVideoMonitor(): void {
    this.videoCheckInterval = setInterval(() => {
      this.checkVideoState();
    }, 1000);
  }

  private stopVideoMonitor(): void {
    if (this.videoCheckInterval) {
      clearInterval(this.videoCheckInterval);
      this.videoCheckInterval = null;
    }
  }

  private checkVideoState(): void {
    const videos = document.querySelectorAll('video');
    for (const video of videos) {
      const currentSrc = video.currentSrc || video.src || '';

      // Signal 1: src suddenly changed to an ad-related URL
      if (
        currentSrc !== this.lastVideoSrc &&
        this.lastVideoSrc !== '' &&
        this.isAdUrl(currentSrc)
      ) {
        this.triggerAdStart();
      }

      // Signal 2: Video element has ad-related data attributes or classes
      if (
        video.dataset.ad === 'true' ||
        video.dataset.adbreak === 'true' ||
        video.classList.toString().match(/ad/i)
      ) {
        this.triggerAdStart();
      }

      this.lastVideoSrc = currentSrc;
    }
  }

  /* ─── Detection Logic ─── */
  private checkElementForAd(element: HTMLElement): void {
    // Check against known selectors
    for (const selector of AD_SELECTOR_PATTERNS) {
      try {
        if (element.matches(selector) || element.querySelector(selector)) {
          this.triggerAdStart();
          return;
        }
      } catch {
        // Ignore invalid selector matches
      }
    }

    // Check text content for ad indicators
    const text = element.textContent?.trim() || '';
    if (text.length > 0 && text.length < 50) {
      for (const pattern of AD_TEXT_PATTERNS) {
        if (pattern.test(text)) {
          this.triggerAdStart();
          return;
        }
      }
    }
  }

  private checkIfAdEnded(): void {
    // Verify that no ad indicators remain in the DOM
    for (const selector of AD_SELECTOR_PATTERNS) {
      try {
        if (document.querySelector(selector)) {
          return; // Ad still present
        }
      } catch {
        // Ignore
      }
    }

    // Double check text contents of active overlays
    const overlays = document.querySelectorAll('[class*="player"], [class*="video"], [class*="container"]');
    for (const overlay of Array.from(overlays)) {
      const text = overlay.textContent?.trim() || '';
      if (text.length > 0 && text.length < 50) {
        for (const pattern of AD_TEXT_PATTERNS) {
          if (pattern.test(text)) {
            return; // Ad text still visible
          }
        }
      }
    }

    this.triggerAdEnd();
  }

  private isAdUrl(url: string): boolean {
    const adUrlPatterns = [
      /ad[s]?\./i,
      /doubleclick/i,
      /googlesyndication/i,
      /adservice/i,
      /imasdk/i,
      /adsrvr/i,
      /adnxs/i,
    ];
    return adUrlPatterns.some((pattern) => pattern.test(url));
  }

  /* ─── Event Triggers ─── */
  private triggerAdStart(): void {
    if (this.isAdPlaying || this.bypassCurrentBreak) return;

    this.isAdPlaying = true;
    console.log('[CricShield] 🔴 Ad detected — activating overlay');
    this.callbacks.onAdStart();
  }

  private triggerAdEnd(): void {
    if (!this.isAdPlaying && !this.bypassCurrentBreak) return;

    this.isAdPlaying = false;
    this.bypassCurrentBreak = false; // Reset bypass for next ad break
    console.log('[CricShield] 🟢 Ad ended — removing overlay');
    this.callbacks.onAdEnd();
  }

  /* ─── Dev Mode (Ctrl+Shift+A to simulate ads for testing) ─── */
  private devKeyHandler = (e: KeyboardEvent): void => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      if (this.isAdPlaying) {
        this.triggerAdEnd();
      } else {
        this.bypassCurrentBreak = false;
        this.triggerAdStart();
      }
      console.log('[CricShield] Dev mode: Ad toggled');
    }
  };

  private setupDevModeShortcut(): void {
    this.devModeEnabled = true;
    document.addEventListener('keydown', this.devKeyHandler);
  }

  private removeDevModeShortcut(): void {
    if (this.devModeEnabled) {
      document.removeEventListener('keydown', this.devKeyHandler);
      this.devModeEnabled = false;
    }
  }
}