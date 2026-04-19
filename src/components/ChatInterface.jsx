import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../utils/language';
import { LANGUAGES } from '../utils/language';
import { FD_DATA, calcMaturity } from '../data/fdData';
import RailwayTickets from './RailwayTickets';
import './ChatInterface.css';

// ── Split-Flap language display ──
function SplitFlapDisplay({ language, onLanguageChange }) {
  const [flipping, setFlipping] = useState(false);
  const [displayLang, setDisplayLang] = useState(language);
  const langObj = LANGUAGES.find(l => l.code === displayLang);

  useEffect(() => {
    if (language !== displayLang) {
      setFlipping(true);
      setTimeout(() => {
        setDisplayLang(language);
        setFlipping(false);
      }, 220);
    }
  }, [language]);

  return (
    <div className="sf-display">
      <span className="sf-label">भाषा / Language:</span>
      {[...(langObj?.nativeName || '')].map((ch, i) => (
        <span key={i} className={`split-flap-cell ${flipping ? 'flipping' : ''}`}
          style={{ animationDelay: `${i * 0.04}s` }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
      {/* Language cycle button */}
      <button className="sf-cycle-btn" onClick={() => {
        const idx = LANGUAGES.findIndex(l => l.code === displayLang);
        onLanguageChange(LANGUAGES[(idx + 1) % LANGUAGES.length].code);
      }} title="Change language">⟳</button>
    </div>
  );
}

// ── AI Call ──
function getClientFallbackResponse() {
  return `Thanks for asking!

**Suryoday Small Finance Bank** currently offers one of the best FD rates:

• 9.10% per year for 12 months
• Rs 1 lakh grows to Rs 1,09,100 in 1 year

It is DICGC insured, so deposits are protected up to Rs 5 lakh.

How much are you planning to invest?`;
}

async function callAdvisor(messages, language, rates) {
  const fdList = rates || FD_DATA;
  const systemPrompt = `You are FD Saathi, a warm and trusted Fixed Deposit advisor for first-time investors in India's Tier 2/3 cities. You MUST respond entirely in ${language === 'hi' ? 'Hindi (Devanagari script)' : language === 'mr' ? 'Marathi (Devanagari script)' : language === 'ta' ? 'Tamil script' : language === 'te' ? 'Telugu script' : language === 'bn' ? 'Bengali script' : 'simple English'}.

Rules:
- Use very simple, everyday language (like talking to a neighbor, not a bank manager)
- Keep sentences short and direct
- Always mention DICGC insurance when relevant
- When recommending FDs, format as: BANK | RATE | TENURE
- Available FDs: ${fdList.map(fd => `${fd.bank}: ${fd.rate}% for ${fd.tenure}`).join(', ')}
- If asked about amount, calculate maturity using compound interest
- Never use jargon without explaining it in the same breath
- Be warm, encouraging, patient — like a trusted local advisor (bharosemand dost)
- Always end with an actionable next step or question`;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, systemPrompt, language }),
    });
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    return data.content?.trim() ? data.content : getClientFallbackResponse();
  } catch {
    // Fallback responses for demo
    const fallbacks = {
      hi: `नमस्ते! आपके सवाल के लिए धन्यवाद। 

Suryoday Small Finance Bank में अभी **9.10% प्रति वर्ष** दे रहे हैं 12 महीने के लिए — यह सबसे अच्छा है।

₹1 लाख के लिए: 1 साल बाद ₹1,09,100 मिलेंगे।

और यह DICGC से बीमित है, मतलब ₹5 लाख तक सुरक्षित है। 🔒

क्या आप अभी कितना निवेश करना चाहते हैं?`,
      mr: `नमस्कार! तुमच्या प्रश्नाबद्दल धन्यवाद।

Suryoday Small Finance Bank मध्ये आता **9.10% प्रति वर्ष** मिळतात 12 महिन्यांसाठी — हे सर्वोत्तम आहे।

₹1 लाखासाठी: 1 वर्षानंतर ₹1,09,100 मिळतील।

आणि हे DICGC विमाकृत आहे — ₹5 लाखांपर्यंत सुरक्षित। 🔒

तुम्ही किती गुंतवणूक करणार?`,
      en: `Hello! Thanks for asking.

**Suryoday Small Finance Bank** currently offers the best rate: **9.10% per year** for 12 months.

For ₹1 lakh: you'd receive ₹1,09,100 after 1 year.

It's DICGC insured — meaning up to ₹5 lakh is government-protected. 🔒

How much are you looking to invest?`,
    };
    return fallbacks[language] || fallbacks.en;
  }
}

export default function ChatInterface({ language, onLanguageChange, rates }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: t('greeting', language), type: 'letter' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTickets, setShowTickets] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const endRef = useRef(null);
  const messagesRef = useRef(null);
  const shouldStickToBottomRef = useRef(true);
  const autoScrollingUntilRef = useRef(0);

  const handleMessagesScroll = () => {
    if (Date.now() < autoScrollingUntilRef.current) return;
    const el = messagesRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldStickToBottomRef.current = distFromBottom < 140;
  };

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    if (!shouldStickToBottomRef.current) return;

    autoScrollingUntilRef.current = Date.now() + 450;
    const scrollToBottom = () => el.scrollTo({ top: el.scrollHeight, behavior: 'auto' });
    const frameId = requestAnimationFrame(scrollToBottom);
    const settleTimer = setTimeout(scrollToBottom, 260);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(settleTimer);
    };
  }, [messages, loading, showTickets]);

  // Only reset greeting if conversation hasn't started yet
  useEffect(() => {
    setMessages(prev =>
      prev.length <= 1
        ? [{ role: 'assistant', text: t('greeting', language), type: 'letter' }]
        : prev
    );
  }, [language]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setErrorMsg(null);
    shouldStickToBottomRef.current = true;

    const newUserMsg = { role: 'user', text, type: 'note' };
    const updated = [...messages, newUserMsg];
    setMessages(updated);

    // Check for FD recommendation trigger
    const isRecoRequest = /fd|recommend|best|suggest|कौन सा|सबसे|बेस्ट|श्रेष्ठ|சிறந்த|uttamah/i.test(text);

    setLoading(true);
    try {
      const apiMessages = updated.map(m => ({ role: m.role, content: m.text }));
      const reply = await callAdvisor(apiMessages, language, rates);
      shouldStickToBottomRef.current = true;
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: reply?.trim() ? reply : getClientFallbackResponse(),
        type: 'letter'
      }]);
      if (isRecoRequest) setTimeout(() => setShowTickets(true), 600);
    } catch {
      setErrorMsg('नेटवर्क में कोई दिक्कत है। / Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Top bar: split-flap language display */}
      <div className="chat-topbar">
        <SplitFlapDisplay language={language} onLanguageChange={onLanguageChange} />
        <button className="chat-tickets-btn stamp-border" onClick={() => setShowTickets(s => !s)}>
          <span>🎫</span>
          <span>{showTickets ? 'Hide' : 'FD'} Tickets</span>
        </button>
      </div>

      {/* Railway tickets panel */}
      <AnimatePresence>
        {showTickets && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="chat-tickets-panel"
          >
            <RailwayTickets language={language} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
      <div className="chat-messages" ref={messagesRef} onScroll={handleMessagesScroll}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            msg.role === 'user'
              ? <UserNote key={i} text={msg.text} />
              : <OfficialLetter key={i} text={msg.text} language={language} />
          ))}
        </AnimatePresence>

        {/* Loading — typewriter dots */}
        {loading && <LoadingLetter language={language} />}

        {/* Error — crumpled paper */}
        {errorMsg && <ErrorNote message={errorMsg} />}

        <div className="chat-scroll-anchor" ref={endRef} />
      </div>

      {/* Input — looks like a chit */}
      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <textarea
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={t('placeholder', language)}
            rows={2}
            disabled={loading}
          />
        </div>
        <motion.button
          className="chat-send-btn"
          onClick={send}
          disabled={loading || !input.trim()}
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.04 }}
        >
          <span className="chat-send-hi">भेजें</span>
          <span className="chat-send-en">SEND ▶</span>
        </motion.button>
      </div>
    </div>
  );
}

// ── User Note — handwritten on torn paper ──
function UserNote({ text }) {
  return (
    <motion.div
      className="user-note"
      initial={{ opacity: 0, x: 40, rotate: 2 }}
      animate={{ opacity: 1, x: 0, rotate: 1.5 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 340, damping: 28 }}
    >
      <div className="torn-top" />
      <div className="user-note-content">
        <span className="user-note-text">{text}</span>
        <span className="user-note-sig">— आप / You</span>
      </div>
      <div className="torn-bottom" />
    </motion.div>
  );
}

// ── Official typed letter ──
function OfficialLetter({ text }) {
  const bodyText = text?.trim()
    ? text
    : 'Thanks for asking. Please tell me the amount and time period, and I will suggest a suitable FD.';

  return (
    <motion.div
      className="official-letter-wrap"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Letterhead */}
      <div className="letter-head">
        <div className="letter-stamp-logo">FD<br/>SAATHI</div>
        <div className="letter-head-info">
          <span className="letter-ref">REF: FDSA/{new Date().getFullYear()}/{String(Math.floor(Math.random()*9999)).padStart(4,'0')}</span>
          <span className="letter-date">{new Date().toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'})}</span>
        </div>
      </div>

      {/* Body — typewriter style */}
      <div className="letter-body">
        {bodyText.split('\n').filter(line => line.trim() !== '').map((line, i) => {
          const clean = line.replace(/\*\*/g, '').replace(/^#+\s*/, '').replace(/^[-*]\s+/, '• ').trim();
          return clean ? (
            <p key={i} className={line.startsWith('**') || line.startsWith('#') ? 'letter-bold' : 'letter-para'}>
              {clean}
            </p>
          ) : null;
        })}
      </div>

      {/* Rubber stamp */}
      <div className="letter-footer">
        <span className="letter-sign">FD Saathi Advisory</span>
        <span className="rubber-stamp letter-approved">VERIFIED ✓</span>
      </div>
    </motion.div>
  );
}

// ── Loading letter (chai pour style) ──
function LoadingLetter({ language }) {
  return (
    <motion.div className="loading-letter"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="loading-chai">
        <div className="loading-cup">
          <motion.div
            className="loading-fill"
            animate={{ height: ['10%', '90%', '10%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <span className="loading-steam">☕</span>
      </div>
      <span className="loading-text">{t('loading', language)}</span>
    </motion.div>
  );
}

// ── Error crumpled paper ──
function ErrorNote({ message }) {
  return (
    <motion.div
      className="error-note"
      initial={{ opacity: 0, y: -60, rotate: -20, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, rotate: 2, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
    >
      <div className="error-crumple">✗</div>
      <span className="error-text">{message}</span>
    </motion.div>
  );
}
