# FD Saathi — साथी

**A vernacular Fixed Deposit advisor built for first-time investors in India's Tier 2/3 cities.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-f--d--sarthi.vercel.app-orange?style=flat-square&logo=vercel)](https://f-d-sarthi.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Rex123--hash-181717?style=flat-square&logo=github)](https://github.com/Rex123-hash/F.D-Sarthi-)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Powered by Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)

---

## The Problem

India has over 400 million first-time investors — most of them in Tier 2 and 3 cities. Fixed Deposits are the most trusted savings instrument in these communities, yet the language used by banks is formal English or heavily jargon-laden Hindi. Terms like *compound interest*, *DICGC insurance*, *TDS deduction*, and *premature withdrawal penalty* create a trust barrier that pushes people away from making informed decisions.

**The result:** People either avoid investing altogether, or blindly follow advice from someone they know — often getting lower returns than they could.

---

## The Solution

FD Saathi is an AI-powered advisor that speaks to users in their own language — not just translated text, but the warm, conversational tone of a trusted neighbor. It explains FD concepts simply, compares live rates across banks, and helps users calculate exactly what they'll earn — all in Hindi, Marathi, Tamil, Telugu, Bengali, or English.

The design is intentional: inspired by Indian government notices, railway tickets, chalk slates, and handwritten chits — visuals that feel familiar and trustworthy to the target audience, not foreign or intimidating.

---

## Features

- **AI Chat Advisor** — Gemini-powered responses in the user's native language. Warm tone, zero jargon, always ends with a clear next step.
- **Live FD Rate Board** — Typewriter-animated chalk slate showing rates from 8 banks/NBFCs. General and Senior Citizen rates. Auto-refreshes every 45 seconds.
- **Abacus Investment Simulator** — Move beads to set your amount, pick a bank, see compound interest and maturity value. A growing plant visualizes your returns.
- **Railway FD Tickets** — Recommendations styled as vintage Indian train tickets — familiar, tangible, trustworthy.
- **Jargon Glossary** — Tap any term (DICGC, TDS, Compound Interest) to get a plain-language explanation.
- **FAQ Page** — 14 questions across 5 categories covering everything a first-time investor needs to know.
- **6 Languages** — Hindi, Marathi, Tamil, Telugu, Bengali, English with native numeral support.

---

## Tech Stack

| | Tool |
|---|---|
| Frontend | React 19 + Vite 8 |
| Animations | Framer Motion 12 |
| AI | Google Gemini 2.5 Flash Lite |
| Backend (dev) | Express.js |
| Backend (prod) | Vercel Serverless Functions |
| Hosting | Vercel |
| Fonts | Noto Sans Devanagari · Roboto Mono · Space Grotesk |
| Testing | Vitest |

---

## Banks Covered

| Bank | Type | Rate | Senior | DICGC |
|---|---|---|---|---|
| Suryoday Small Finance Bank | SFB | 9.10% | 9.60% | ✅ |
| ESAF Small Finance Bank | SFB | 8.75% | 9.25% | ✅ |
| Ujjivan Small Finance Bank | SFB | 8.50% | 9.00% | ✅ |
| Utkarsh Small Finance Bank | SFB | 8.50% | 9.00% | ✅ |
| Jana Small Finance Bank | SFB | 8.25% | 8.75% | ✅ |
| Shriram Finance | NBFC | 8.18% | 8.68% | ❌ |
| Mahindra Finance | NBFC | 8.05% | 8.55% | ❌ |
| State Bank of India | PSU | 6.80% | 7.30% | ✅ |

---

## Project Structure

```
fd-saathi/
├── api/                        # Vercel serverless functions
│   ├── _data.js                # FD rate data
│   ├── chat.js                 # POST /api/chat — Gemini AI
│   └── rates.js                # GET /api/rates — live rates
├── src/
│   ├── components/
│   │   ├── ChatInterface       # AI chat with letter/chit styles
│   │   ├── NoticeBoard         # Live rate board — chalk slate
│   │   ├── Simulator           # Abacus + plant growth
│   │   ├── RailwayTickets      # FD picks as train tickets
│   │   ├── FAQ                 # Collapsible help page
│   │   └── LanguageSelector    # Onboarding language picker
│   ├── utils/language.js       # i18n + numeral conversion
│   └── data/fdData.js          # Frontend fallback data
├── src/
│   └── __tests__/
│       ├── fdData.test.js      # calcMaturity, calcInterestEarned, data integrity
│       └── language.test.js    # toLocalNumeral, formatDualRate, translations
├── api/
│   └── __tests__/
│       └── rates.test.js       # /api/rates handler
├── server.js                   # Local Express server (dev)
└── vercel.json                 # Vercel config
```

---

## Running Locally

```bash
git clone https://github.com/Rex123-hash/F.D-Sarthi-.git
cd F.D-Sarthi-
npm install
```

Create `.env`:
```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

```bash
node server.js   # Terminal 1 — API on port 3001
npm run dev      # Terminal 2 — Frontend on port 5173
```

## Running Tests

```bash
npm test
```

38 tests across FD calculation logic, language/numeral utilities, and the rates API handler.

---

## Deployment

Hosted on Vercel. The `api/` folder is auto-detected as serverless functions.

To update FD rates: edit `api/_data.js` and push. Vercel redeploys automatically.

**Environment variables required on Vercel:**
- `GEMINI_API_KEY`
- `GEMINI_MODEL` → `gemini-2.5-flash-lite`

---

## Disclaimer

Rates shown are for informational purposes only. Always verify current rates directly with the bank before investing. This app does not constitute financial advice.

DICGC insurance covers up to ₹5 lakh per depositor per bank. NBFCs (Shriram, Mahindra) are not covered — this is clearly indicated in the UI.

---

## Author

**Amaan Khan**
Built solo for the [Blostem AI Builder Hackathon](https://blostem.com/hackathon) — Track 1: Vernacular FD Advisor.

[![GitHub](https://img.shields.io/badge/GitHub-Rex123--hash-181717?style=flat-square&logo=github)](https://github.com/Rex123-hash)

---

<div align="center">
  <strong>FD SAATHI ◆ साथी</strong><br/>
  Built for India's first-time investors
</div>
