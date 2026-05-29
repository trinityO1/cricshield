# 🛡️ CricShield — Smart Ad-Replacement Overlay for Live Cricket Streaming

CricShield is a configuration-free Google Chrome Extension that automatically intercepts video ads during live cricket streaming on popular platforms (such as **JioCinema**, **Hotstar**, and **JioHotstar**) and replaces them with a gorgeous, real-time live cricket scoreboard overlay. 

Instead of sitting through repetitive and loud advertisements, CricShield silences the ad stream and presents a modern, premium, glassmorphic React dashboard featuring real-time scores, detailed batting and bowling statistics, and a live ball-by-ball timeline synced dynamically with Cricbuzz.

---

## 🌟 Key Features

*   **Smart Telemetry Ad Interception (Hotstar)**
    *   Intercepts ad-tracking requests (specifically `ct_impression` events on `bifrost-api.hotstar.com`) to calculate exact ad-break durations.
    *   Automatically mutes the streaming tab on ad start and unmutes it when the ad ends.
*   **Multi-Signal Heuristic Ad Detection (JioCinema & General)**
    *   Uses a robust `MutationObserver` and video state scanner to watch for ad containers, skip buttons, countdown timers, video source changes, and text labels (e.g., *"Ad"*, *"Advertisement"*, *"Ad 1 of 2"*).
*   **Premium React Scoreboard Overlay**
    *   Designed with a dark-themed, glassmorphic layout using **React**, **Tailwind CSS**, and **Framer Motion** for sleek animations.
    *   Displays current batting team runs/wickets, overs, run rate, target score, and required run rate.
    *   Renders real-time statistics for both active batsmen (runs, balls, 4s, 6s, strike rate, strike indicator) and the current bowler (overs, maidens, runs conceded, wickets, economy).
    *   Shows a live ball-by-ball timeline of the current over (with highlights for boundaries and wickets).
*   **Real-time Event Toast Alerts**
    *   Beautiful, animated notification banners (Framer Motion) slide into the stream's top-right corner to notify you instantly of critical events (4s, 6s, Wickets).
*   **Smart Cricbuzz Match Matching**
    *   Queries Cricbuzz live scores via a background-script proxy to bypass CORS restrictions.
    *   Uses synonym-matching algorithms on the tab's page title and metadata to automatically identify and pair the streaming video with the correct Cricbuzz live match.
*   **Next.js JSON Hydration Extraction**
    *   Robust score parsing extracts Cricbuzz's Next.js hydrated state JSON (`matchScore`, `team1`, `team2`) from raw HTML for 100% reliable data fetching, falling back to regex selectors when necessary.
*   **Style Isolation via Shadow DOM**
    *   Injected components are hosted inside an isolated Shadow DOM, preventing the streaming site's stylesheets from leaking into or breaking the overlay's styling.
*   **Manual Control & Bypass Controls**
    *   Includes a floating Shield Action Button (🛡️ / ❌) in the bottom-right corner to manually toggle the overlay anytime.
    *   Provides a **Bypass Ad Break** option directly on the overlay if you want to skip CricShield and watch the current ad/broadcast instead.
*   **Developer Sandbox**
    *   Press `Ctrl` + `Shift` + `A` to simulate ad starts/ends instantly for layout testing and style validation.

---

## 📂 Project Structure

```filepath
cricshield/
├── public/                 # Static assets (icons and logo)
├── src/
│   ├── api/                # API integration (empty/reserved for future CricAPI endpoints)
│   ├── background/
│   │   └── index.ts        # Service worker for telemetry interception & CORS proxy requests
│   ├── content/
│   │   ├── ad-detector.ts  # Heuristic ad detector (MutationObserver, video source matching)
│   │   ├── index.tsx       # Content script entry point (mounts Shadow DOM & FAB)
│   │   └── styles.css      # Content script Tailwind-injected stylesheet
│   ├── overlay/
│   │   ├── components/     # UI Components (Header, ScoreHero, Panels, Timeline, Toasts)
│   │   ├── hooks/
│   │   │   └── useLiveMatchStats.ts # Custom hook for scraping, matching, and simulating scores
│   │   └── App.tsx         # Overlay entrypoint and layout engine
│   ├── types/
│   │   └── cricket.d.ts    # TypeScript interfaces for Match, Player, and Event data
│   └── vite-env.d.ts       # Vite environment types
├── manifest.json           # Chrome Extension Manifest V3 configuration
├── package.json            # Scripts & project dependencies
├── popup.html              # Simple configuration-free extension popup
├── popup.js                # Extension popup entry point script
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration with @crxjs/vite-plugin
```

---

## 🛠️ Tech Stack

*   **Core Logic:** TypeScript, React 18, HTML5
*   **Styling & Motion:** Tailwind CSS v4, Framer Motion
*   **Bundler:** Vite with `@crxjs/vite-plugin` (Manifest V3 support)
*   **APIs & Data Fetching:** Dynamic web parsing/telemetry scraping of Cricbuzz live pages via Chrome Extension proxy messaging.

---

## 🚀 Installation & Setup

### Requirements
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [Google Chrome](https://www.google.com/chrome/) or any Chromium-based browser (Brave, Edge, etc.)

### 1. Build from Source

Install the dependencies:

```bash
npm install
```

Build the extension:

```bash
npm run build
```

This will compile the project and generate a production-ready `dist/` directory inside the project root folder.

---

### 2. Load the Extension in Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `dist/` directory generated in the previous step (path: `.../cricshield/dist`).
5. CricShield is now active! 

---

## 🎮 How to Use & Test

1. Navigate to **JioCinema** or **Hotstar** and open any live cricket match stream.
2. The extension will automatically activate. You will see a small Shield Button (🛡️) at the bottom-right corner of your screen.
3. **Automatic Mode:** As soon as an advertisement begins, the video player's sound will be muted and CricShield's live scoreboard overlay will slide onto your player. When the ad ends, the overlay will disappear and the sound will unmute automatically.
4. **Manual Mode:** Click the floating Shield Button (🛡️) at any time to manually open the scoreboard overlay. Click the Close Button (❌) to hide it.
5. **Testing/Debugging:**
    *   Press `Ctrl` + `Shift` + `A` on your keyboard while on a supported streaming page to manually simulate/toggle an ad break.
    *   This allows developers to inspect the scoreboard elements, styles, and Framer Motion transitions.

---

## 📝 Scripts

*   `npm run dev` - Starts the Vite development server with Hot Module Replacement (HMR) for the extension.
*   `npm run build` - Standard TypeScript compiling and Vite bundling to compile code into the `dist/` folder.
*   `npm run preview` - Local preview of built assets.

---

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
