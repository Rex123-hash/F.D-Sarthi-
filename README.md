# FD SAATHI — साथी

> **Your trusted Fixed Deposit advisor for first-time investors in India's Tier 2/3 cities.**  
> Multilingual · AI-powered · Vernacular Brutalism design

[![Live Demo](https://img.shields.io/badge/Live%20Demo-f--d--sarthi.vercel.app-orange?style=flat-square&logo=vercel)](https://f-d-sarthi.vercel.app)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%202.5-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

---

## What is FD Saathi?

FD Saathi is a multilingual web app that helps first-time investors in Indian Tier 2/3 cities understand and compare Fixed Deposits across banks. It combines an AI chat advisor, a live rate board, an abacus-style investment simulator, and a FAQ — all wrapped in a distinctive **Vernacular Brutalism** design inspired by Indian government notices, railway tickets, and handwritten chits.

---

## Features

### AI Chat Advisor
- Powered by **Google Gemini 2.5 Flash Lite**
- Responds entirely in the user's chosen language (Hindi, Marathi, Tamil, Telugu, Bengali, English)
- Warm, friendly tone like a trusted local advisor (*bharosemand dost*)
- Always mentions DICGC insurance where relevant
- Chat history preserved across messages
- Falls back to helpful canned responses when AI quota is unavailable

### Live FD Rate Board
- Displays Fixed Deposit rates from 8 banks/NBFCs
- **General vs Senior Citizen toggle** (+0.50% for seniors)
- Typewriter chalk animation for each rate row on the slate board
- Chai cup loader with steam animation on data refresh every 45s
- Collapsible FD jargon glossary (DICGC, TDS, Compound Interest, NBFC)
- HOT badge on the highest-rate option

### Abacus Investment Simulator
- Move beads to set your principal amount (₹1,000 → ₹9,00,000+)
- Select any FD from the live rate list
- Calculates compound interest, maturity amount, and return %
- Growing plant SVG that visually represents your returns
- Soil layers show principal vs interest earned
- Dual-script number display (e.g. ₹१,०९,१०० (1,09,100))

### Railway FD Tickets
- FD recommendations styled as vintage Indian railway tickets
- Perforated borders, rubber ink stamps, serial numbers
- Toggle panel inside the chat interface

### FAQ Page
- 14 Q&A items across 5 categories
- Getting Started · Fixed Deposits · Using the Calculator · Safety & Trust · Senior Citizens
- Animated collapsible answers
- Category sidebar for quick navigation

### Multilingual Support

| Language | Script | Region |
|---|---|---|
| हिन्दी Hindi | Devanagari | MP · UP · Bihar |
| मराठी Marathi | Devanagari | Maharashtra · Vidarbha |
| தமிழ் Tamil | Tamil | Tamil Nadu · Puducherry |
| తెలుగు Telugu | Telugu | Andhra Pradesh · Telangana |
| বাংলা Bengali | Bengali | West Bengal · Barak Valley |
| English | Latin | All Regions |

### Design System — Vernacular Brutalism
- Aged paper (`#F5F0E8`) background with subtle ruled-line texture
- Split-flap airport display for language switching
- AI messages styled as **official typed letters** with letterhead, REF number, date, and rubber stamp
- User messages as **handwritten torn paper chits** with notebook lines
- Loading state as an animated **chai cup** filling with tea
- Errors as **crumpled paper** with spring physics drop animation
- Footer ticker tape scrolling live FD rates

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 + Vite 8 |
| Animations | Framer Motion 12 |
| AI Model | Google Gemini 2.5 Flash Lite |
| AI SDK | `@google/generative-ai` |
| Backend (local dev) | Express.js 4 |
| Backend (production) | Vercel Serverless Functions |
| Hosting | Vercel |
| Fonts | Noto Sans Devanagari · Roboto Mono · Space Grotesk |

---

## FD Data — Banks Covered

| Bank | Type | Rate | Senior Rate | DICGC Insured |
|---|---|---|---|---|
| Suryoday Small Finance Bank | SFB | 9.10% | 9.60% | ✅ |
| ESAF Small Finance Bank | SFB | 8.75% | 9.25% | ✅ |
| Ujjivan Small Finance Bank | SFB | 8.50% | 9.00% | ✅ |
| Utkarsh Small Finance Bank | SFB | 8.50% | 9.00% | ✅ |
| Jana Small Finance Bank | SFB | 8.25% | 8.75% | ✅ |
| Shriram Finance | NBFC | 8.18% | 8.68% | ❌ |
| Mahindra Finance | NBFC | 8.05% | 8.55% | ❌ |
| State Bank of India | PSU Bank | 6.80% | 7.30% | ✅ |

> NBFCs are not covered by DICGC insurance — this is clearly indicated in the UI.

---

## Project Structure

```
fd-saathi/
├── api/                          # Vercel serverless functions (production)
│   ├── _data.js                  # Shared FD rates data
│   ├── chat.js                   # POST /api/chat — Gemini AI advisor
│   └── rates.js                  # GET /api/rates — FD rates
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── ChatInterface.jsx     # AI chat — letter & chit message styles
│   │   ├── ChatInterface.css
│   │   ├── FAQ.jsx               # Collapsible FAQ with category sidebar
│   │   ├── FAQ.css
│   │   ├── LanguageSelector.jsx  # Onboarding language picker
│   │   ├── LanguageSelector.css
│   │   ├── NoticeBoard.jsx       # Live rate board — chalk slate + typewriter
│   │   ├── NoticeBoard.css
│   │   ├── RailwayTickets.jsx    # FD picks styled as train tickets
│   │   ├── RailwayTickets.css
│   │   ├── Simulator.jsx         # Abacus + compound interest + plant SVG
│   │   └── Simulator.css
│   │
│   ├── data/
│   │   └── fdData.js             # Static FD fallback data (frontend)
│   │
│   ├── utils/
│   │   └── language.js           # i18n strings + local numeral conversion
│   │
│   ├── App.jsx                   # Root — screen routing, rate polling
│   ├── App.css                   # Shell layout, header, footer ticker
│   ├── index.css                 # Design tokens (CSS variables)
│   └── main.jsx
│
├── server.js                     # Local Express server (dev only)
├── vercel.json                   # Vercel deployment config
├── vite.config.js                # Vite + dev API proxy
└── .env                          # Local secrets (never committed)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com) API key (free tier available)

### 1. Clone & Install

```bash
git clone https://github.com/Rex123-hash/F.D-Sarthi-.git
cd F.D-Sarthi-
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_ai_studio_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 3. Run Locally

Open two terminals:

```bash
# Terminal 1 — API server (port 3001)
node server.js

# Terminal 2 — Frontend dev server (port 5173)
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173).

---

## API Reference

### `GET /api/rates`

Returns all FD rates with metadata.

**Response:**
```json
{
  "rates": [
    {
      "id": "suryoday-1",
      "bank": "Suryoday Small Finance Bank",
      "bankShort": "Suryoday SFB",
      "rate": 9.10,
      "seniorRate": 9.60,
      "tenure": "12 months",
      "tenureMonths": 12,
      "minAmount": 5000,
      "type": "Small Finance Bank",
      "safetyRating": "AA-",
      "insured": true,
      "highlight": true
    }
  ],
  "updatedAt": "2026-04-19T12:00:00.000Z"
}
```

### `POST /api/chat`

Sends a conversation to the Gemini AI advisor.

**Request body:**
```json
{
  "messages": [
    { "role": "user", "content": "best FD for 1 lakh?" }
  ],
  "systemPrompt": "You are FD Saathi...",
  "language": "hi"
}
```

**Response:**
```json
{
  "content": "नमस्ते! Suryoday SFB में 9.10% मिलेगा — 1 लाख पर ₹1,09,100..."
}
```

---

## Deployment on Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Rex123-hash/F.D-Sarthi-)

### Manual Steps

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repository
3. Framework preset: **Vite** (auto-detected)
4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `GEMINI_API_KEY` | your Google AI Studio API key |
   | `GEMINI_MODEL` | `gemini-2.5-flash-lite` |

5. Click **Deploy**

The `api/` folder is automatically detected as Vercel Serverless Functions. No separate server needed in production.

---

## Updating FD Rates

All rate data lives in `api/_data.js`. To update:

1. Edit the `FD_RATES` array in `api/_data.js`
2. `git add api/_data.js && git commit -m "Update FD rates" && git push`
3. Vercel redeploys automatically — no frontend rebuild needed

---

## Important Disclaimers

- **DICGC Insurance** covers deposits up to ₹5 lakh per depositor per bank. Always shown in the UI.
- **NBFCs** (Shriram Finance, Mahindra Finance) are NOT covered by DICGC — clearly marked.
- **Rate Accuracy** — Always verify current rates directly with the bank before investing. Rates change frequently.
- **AI Quota** — Gemini free tier has a daily request limit. The app falls back to accurate canned responses if exceeded.
- This app is for **informational purposes only** and does not constitute financial advice.

---

## License

MIT — free to use, modify, and deploy.

---

<div align="center">

**FD SAATHI ◆ साथी**

Made with ☕ chai for India's first-time investors

[Live App](https://f-d-sarthi.vercel.app) · [Report an Issue](https://github.com/Rex123-hash/F.D-Sarthi-/issues)

</div>
