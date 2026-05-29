/**
 * CricShield — Background Service Worker
 *
 * Handles:
 * 1. Muting and unmuting tabs automatically during ad breaks.
 * 2. Hotstar specific ad detection via webRequest API (intercepting ct_impression).
 */

const durationRegexes = [
  /_VCTA_(\d{1,3})(?:_|$)/i,
  /(\d{1,3})s(?:Eng(?:lish)?|Hin(?:di)?)/i,
  /(?:^|[_-])(?:HIN|HING|ENG|HINDI|ENGLISH)(?:[_-])[^\d]*(\d{1,3})(?:_|$)/i,
];

const MAX_AD_DURATION_SEC = 50;

function normalizeAdDurationSec(rawDurationSec: number): number | null {
  if (!Number.isFinite(rawDurationSec)) {
    return null;
  }
  return Math.min(MAX_AD_DURATION_SEC, Math.max(1, rawDurationSec));
}

// Intercept Hotstar tracking requests to find exact ad duration
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    try {
      const url = new URL(details.url);
      const adName = url.searchParams.get('adName');

      if (adName) {
        console.log(`[CricShield] Hotstar ad tracking detected: ${adName}`);
        let durationSec: number | null = null;

        for (const regex of durationRegexes) {
          const match = adName.match(regex);
          if (match && match[1]) {
            durationSec = normalizeAdDurationSec(parseInt(match[1], 10));
            break;
          }
        }

        if (durationSec != null) {
          console.log(`[CricShield] Extracted exact ad duration: ${durationSec}s`);

          // Broadcast exact duration to all active Hotstar / JioHotstar tabs
          chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
              if (tab.id && tab.url && (tab.url.includes('hotstar.com') || tab.url.includes('jiohotstar.com'))) {
                // Automatically mute
                chrome.tabs.update(tab.id, { muted: true });

                // Notify content script
                chrome.tabs.sendMessage(tab.id, {
                  type: 'HOTSTAR_AD_STARTED',
                  durationMs: durationSec! * 1000,
                  adName,
                }).catch(() => {
                  // Ignore if content script isn't loaded yet
                });
              }
            }
          });
        }
      }
    } catch (e) {
      console.warn('[CricShield] Error parsing webRequest URL:', e);
    }
  },
  {
    urls: ['*://bifrost-api.hotstar.com/v1/events/track/ct_impression*'],
  }
);

/* ─── Standard Message Handlers (for Manual / JioCinema Fallback) ─── */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'MUTE_TAB') {
    if (sender.tab?.id) {
      chrome.tabs.update(sender.tab.id, { muted: true }, () => {
        sendResponse({ success: true });
      });
      return true;
    } else {
      sendResponse({ success: false, error: 'No active tab found' });
    }
  }

  if (message.type === 'UNMUTE_TAB') {
    if (sender.tab?.id) {
      chrome.tabs.update(sender.tab.id, { muted: false }, () => {
        sendResponse({ success: true });
      });
      return true;
    } else {
      sendResponse({ success: false, error: 'No active tab found' });
    }
  }

  if (message.type === 'FETCH_CRICBUZZ_URL') {
    fetch(message.url)
      .then((res) => res.text())
      .then((html) => {
        sendResponse({ success: true, html });
      })
      .catch((err) => {
        sendResponse({ success: false, error: err.message || String(err) });
      });
    return true; // Keep response channel open
  }
});