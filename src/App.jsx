import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSelector from './components/LanguageSelector';
import NoticeBoard from './components/NoticeBoard';
import ChatInterface from './components/ChatInterface';
import Simulator from './components/Simulator';
import FAQ from './components/FAQ';
import './index.css';
import './App.css';

const SCREENS = [
  { id: 'chat',      labelHi: 'सलाह',   labelEn: 'Advisor' },
  { id: 'simulator', labelHi: 'गणक',    labelEn: 'Calculator' },
  { id: 'faq',       labelHi: 'सहायता', labelEn: 'Help' },
];

export default function App() {
  const [language, setLanguage] = useState(null);
  const [screen, setScreen] = useState('chat');
  const [rates, setRates] = useState(null);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState(null);

  // Fetch real-time rates from server
  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch('/api/rates');
        if (!res.ok) return;
        const data = await res.json();
        setRates(data.rates);
        setRatesUpdatedAt(data.updatedAt);
      } catch {
        // fall back to static data in components
      }
    }
    fetchRates();
    const interval = setInterval(fetchRates, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  if (!language) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="lang"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          style={{ height: '100vh' }}
        >
          <LanguageSelector onSelect={lang => setLanguage(lang)} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const tickerItems = rates
    ? rates.map(fd => `${fd.bankShort} — ${fd.rate}% (${fd.tenure})`)
    : [
        'Suryoday SFB — 9.10% (12mo)',
        'ESAF SFB — 8.75% (24mo)',
        'Ujjivan SFB — 8.50% (18mo)',
        'DICGC Insurance covers ₹5 lakh per depositor per bank',
        'Jana SFB — 8.25% (36mo)',
        'Utkarsh SFB — 8.50% (12mo)',
        'Shriram Finance NBFC — 8.18% (24mo)',
        'SBI — 6.80% (12mo)',
      ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="main"
        className="app-shell"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        {/* ── HEADER ── */}
        <header className="app-header">
          <button className="app-logo" onClick={() => setLanguage(null)} title="Change language">
            <span className="app-logo-fd">FD</span>
            <span className="app-logo-dot">◆</span>
            <span className="app-logo-saathi">SAATHI</span>
            <span className="app-logo-hi">साथी</span>
          </button>

          <nav className="app-nav">
            {SCREENS.map(sc => (
              <button
                key={sc.id}
                className={`app-nav-btn ${screen === sc.id ? 'active' : ''}`}
                onClick={() => setScreen(sc.id)}
              >
                <span className="app-nav-hi">{sc.labelHi}</span>
                <span className="app-nav-en">{sc.labelEn}</span>
              </button>
            ))}
          </nav>

          <div className="app-trust">
            {ratesUpdatedAt && (
              <span className="trust-badge rates-live">
                ● LIVE {new Date(ratesUpdatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <span className="trust-badge">🔒 DICGC</span>
            <span className="trust-badge">RBI REG.</span>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main className="app-main">
          <AnimatePresence mode="wait">
            {screen === 'chat' && (
              <motion.div
                key="chat"
                className="app-chat-layout"

                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <div className="app-notice-col">
                  <NoticeBoard language={language} rates={rates} />
                </div>
                <div className="app-chat-col">
                  <ChatInterface language={language} onLanguageChange={setLanguage} rates={rates} />
                </div>
              </motion.div>
            )}

            {screen === 'simulator' && (
              <motion.div
                key="sim"
                className="app-sim-layout"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <Simulator language={language} rates={rates} />
              </motion.div>
            )}

            {screen === 'faq' && (
              <motion.div
                key="faq"
                className="app-sim-layout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <FAQ language={language} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── FOOTER TICKER ── */}
        <footer className="app-footer">
          <div className="footer-ticker">
            <div className="ticker-track">
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span key={i} className="ticker-item">◆ {item}</span>
              ))}
            </div>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
