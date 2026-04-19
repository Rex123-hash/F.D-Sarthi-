import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FD_DATA } from '../data/fdData';
import { formatDualRate, t } from '../utils/language';
import './NoticeBoard.css';

// Typewriter hook
function useTypewriter(text, speed = 28) {
  const safeText = String(text ?? '');
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      if (i >= safeText.length) { setDone(true); clearInterval(timer); return; }
      const char = safeText[i];
      if (char !== undefined) setDisplayed(prev => prev + char);
      i++;
    }, speed);
    return () => clearInterval(timer);
  }, [safeText, speed]);
  return { displayed, done };
}

// Single rate row with typewriter
function RateRow({ fd, language, delay = 0, isSenior }) {
  const rate = isSenior ? fd.seniorRate : fd.rate;
  const rateStr = (rate != null) ? formatDualRate(rate, language) : 'N/A';
  const { displayed, done } = useTypewriter(`${fd.bankShort}  ${rateStr} p.a.`, 22);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  if (!visible) return null;

  return (
    <motion.div
      className={`nb-rate-row ${fd.highlight ? 'nb-rate-highlight' : ''}`}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000, duration: 0.3 }}
    >
      <span className={`nb-rate-text chalk-text ${!done ? 'typewriter-cursor' : ''}`}>
        {displayed}
      </span>
      {fd.highlight && done && (
        <span className="rubber-stamp nb-stamp">HOT</span>
      )}
      {fd.insured && (
        <span className="nb-insured-badge">✓ DICGC</span>
      )}
    </motion.div>
  );
}

export default function NoticeBoard({ language, rates }) {
  const [seniorMode, setSeniorMode] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);
  const [chaiLevel, setChaiLevel] = useState(100); // percentage filled
  const boardRef = useRef(null);

  // Simulate data refresh every 45s
  useEffect(() => {
    const interval = setInterval(() => {
      setChaiLevel(0);
      setTimeout(() => {
        setUpdateKey(k => k + 1);
        let level = 0;
        const fill = setInterval(() => {
          level += 5;
          setChaiLevel(level);
          if (level >= 100) clearInterval(fill);
        }, 40);
      }, 1000);
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const fdList = rates || FD_DATA;
  const sorted = [...fdList].sort((a, b) => b.rate - a.rate);

  return (
    <div className="nb-container" ref={boardRef}>
      {/* Board header */}
      <div className="nb-header">
        <div className="nb-header-title">
          <span className="nb-title-hi">{t('currentRates', language)}</span>
          <span className="nb-title-en">Interest Rates — Live</span>
        </div>
        {/* Chai loader */}
        <div className="nb-chai-loader">
          <div className="chai-cup">
            <div className="chai-fill" style={{ height: `${chaiLevel}%` }} />
            <div className="chai-steam">
              {chaiLevel >= 90 && ['', '', ''].map((_, i) => (
                <div key={i} className="steam-wisp" style={{ animationDelay: `${i * 0.3}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Senior Citizen Toggle */}
      <div className="nb-toggle-row">
        <button
          className={`nb-toggle-btn ${!seniorMode ? 'active' : ''}`}
          onClick={() => setSeniorMode(false)}
        >
          सामान्य / General
        </button>
        <button
          className={`nb-toggle-btn ${seniorMode ? 'active' : ''}`}
          onClick={() => setSeniorMode(true)}
        >
          वरिष्ठ / Senior (+0.5%)
        </button>
      </div>

      {/* Slate board */}
      <div className="nb-slate" key={updateKey}>
        <div className="nb-slate-header">
          <span className="chalk-text nb-slate-subhead">
            ** {seniorMode ? 'SENIOR CITIZEN RATES' : 'GENERAL RATES'} **
          </span>
        </div>

        <div className="nb-rates-list">
          {sorted.map((fd, i) => (
            <RateRow
              key={`${fd.id}-${updateKey}`}
              fd={fd}
              language={language}
              delay={i * 180}
              isSenior={seniorMode}
            />
          ))}
        </div>

        <div className="nb-slate-footer chalk-text">
          ★ DICGC insures up to ₹5 lakh per bank
        </div>
      </div>

      {/* FD Jargon glossary */}
      <div className="nb-glossary">
        <div className="nb-glossary-title">
          <span>शब्दकोश</span>
          <span className="nb-glossary-sub"> / Tap to learn</span>
        </div>
        {JARGON.map(term => (
          <JargonItem key={term.word} term={term} language={language} />
        ))}
      </div>

      {/* Date stamp */}
      <div className="nb-date-stamp">
        <span className="nb-date-inner">
          आज / {new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}
        </span>
      </div>
    </div>
  );
}

const JARGON = [
  { word: 'DICGC', hi: 'सरकारी बीमा — ₹5 लाख तक सुरक्षित', en: 'Govt insurance up to ₹5 lakh' },
  { word: 'TDS', hi: 'ब्याज पर टैक्स कटौती (10%)', en: 'Tax deducted on interest (10%)' },
  { word: 'Compound Interest', hi: 'ब्याज पर भी ब्याज मिलता है', en: 'Interest earned on interest' },
  { word: 'NBFC', hi: 'बैंक नहीं, लेकिन FD दे सकते हैं', en: 'Non-banking finance company' },
];

function JargonItem({ term, language }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="nb-jargon-item" onClick={() => setOpen(o => !o)}>
      <span className="nb-jargon-word">{term.word} <span className="nb-jargon-tap">↓</span></span>
      <AnimatePresence>
        {open && (
          <motion.div
            className="nb-jargon-desc"
            initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
            exit={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span className="nb-jargon-hi">{term.hi}</span>
            <span className="nb-jargon-en">{term.en}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
