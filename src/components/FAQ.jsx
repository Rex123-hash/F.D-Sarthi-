import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '../utils/language';
import './FAQ.css';

const FAQ_DATA = [
  {
    category: 'Getting Started',
    categoryHi: 'शुरुआत',
    icon: '📋',
    items: [
      {
        q: 'What is FD Saathi?',
        a: 'FD Saathi is your trusted Fixed Deposit advisor. It helps first-time investors in India compare FD rates across banks, understand safety features like DICGC insurance, and make informed decisions — in your own language.',
      },
      {
        q: 'How do I use the Advisor tab?',
        a: 'Type any question in the chat box and press SEND (or Enter). Ask things like "Which FD gives the best return for 1 year?" or "Is my money safe in a small finance bank?" — the AI advisor will reply in simple language.',
      },
      {
        q: 'Can I change the language?',
        a: 'Yes! Click the ⟳ button next to the language name at the top of the chat, or click the FD◆SAATHI logo to go back to the language selection screen. Supported: Hindi, Marathi, Tamil, Telugu, Bengali, English.',
      },
    ],
  },
  {
    category: 'Fixed Deposits',
    categoryHi: 'सावधि जमा',
    icon: '🏦',
    items: [
      {
        q: 'What is a Fixed Deposit (FD)?',
        a: 'A Fixed Deposit is a savings instrument where you deposit a lump sum with a bank for a fixed period (e.g. 12 months). The bank pays you a guaranteed interest rate. At the end of the period, you get back your money plus the interest earned. It is one of the safest ways to grow your savings.',
      },
      {
        q: 'What is DICGC insurance?',
        a: 'DICGC (Deposit Insurance and Credit Guarantee Corporation) is a Government of India body that insures your bank deposits up to ₹5 lakh per depositor per bank. So even if a bank fails, you will get back up to ₹5 lakh. All banks and Small Finance Banks (SFBs) in India must have this insurance.',
      },
      {
        q: 'What is the difference between a Small Finance Bank (SFB) and a regular bank?',
        a: 'Small Finance Banks (SFBs) like Suryoday, ESAF, and Ujjivan are licensed by RBI to serve smaller customers. They often offer higher FD interest rates (8-9%) compared to large banks like SBI (6-7%) to attract deposits. Importantly, SFBs are also DICGC insured — your money is equally safe up to ₹5 lakh.',
      },
      {
        q: 'What is an NBFC FD?',
        a: 'NBFCs (Non-Banking Finance Companies) like Shriram Finance and Mahindra Finance also offer FDs. They are NOT covered by DICGC insurance — so they carry slightly higher risk. However, AAA-rated NBFCs (the highest rating) are considered very safe. Always check the credit rating before investing.',
      },
      {
        q: 'What is TDS on FD interest?',
        a: 'If your FD interest exceeds ₹40,000 per year (₹50,000 for senior citizens), the bank deducts 10% Tax at Source (TDS). You can avoid TDS by submitting Form 15G (for non-seniors) or Form 15H (for seniors) at the beginning of the year if your total income is below the taxable limit.',
      },
    ],
  },
  {
    category: 'Using the Calculator',
    categoryHi: 'गणक का उपयोग',
    icon: '🧮',
    items: [
      {
        q: 'How does the Simulator (Calculator) work?',
        a: 'Go to the Calculator tab. Use the abacus beads to set your investment amount — click the coloured rows to add beads (₹10L, ₹1L, ₹10K, ₹1K). Select an FD from the list on the right. The plant grows to show your return visually, and the numbers show your maturity amount and interest earned.',
      },
      {
        q: 'How is maturity amount calculated?',
        a: 'FD maturity uses compound interest formula: Maturity = Principal × (1 + Rate)^Years. For example, ₹1,00,000 at 9.10% for 1 year = ₹1,09,100. The interest compounds annually. This is the same formula used by banks.',
      },
      {
        q: 'What do the FD Tickets show?',
        a: 'Click "FD Tickets" in the Advisor tab to see all available FDs as railway-style tickets. Each ticket shows the bank name, interest rate, tenure, and your estimated maturity amount. Click any ticket to flip it and see more details. Filter by SFB, NBFC, or PSU Bank using the buttons.',
      },
    ],
  },
  {
    category: 'Safety & Trust',
    categoryHi: 'सुरक्षा',
    icon: '🔒',
    items: [
      {
        q: 'How safe is my money?',
        a: 'For DICGC-insured banks (all banks and SFBs), up to ₹5 lakh per depositor per bank is 100% government-guaranteed. If you have more to invest, consider spreading across multiple banks. For NBFC FDs (Shriram, Mahindra), the safety depends on the credit rating — AAA is the safest.',
      },
      {
        q: 'Is FD Saathi storing my data?',
        a: 'FD Saathi does not store any personal information. Your chat conversations are only used to generate AI responses and are not saved anywhere. No account or registration is required.',
      },
      {
        q: 'Are the interest rates shown accurate?',
        a: 'The rates shown are updated regularly and reflect current market rates as of 2025. However, banks change their rates frequently. Always verify the latest rate directly on the bank\'s official website before investing. FD Saathi is for guidance only — not financial advice.',
      },
    ],
  },
  {
    category: 'Senior Citizens',
    categoryHi: 'वरिष्ठ नागरिक',
    icon: '👴',
    items: [
      {
        q: 'Do senior citizens get better rates?',
        a: 'Yes! Most banks offer an additional 0.25% to 0.50% interest to senior citizens (aged 60+) on FD deposits. Toggle "Senior (+0.5%)" on the Notice Board to see senior citizen rates. This extra return can significantly increase your earnings over the tenure.',
      },
      {
        q: 'How can senior citizens avoid TDS?',
        a: 'Senior citizens can submit Form 15H at the start of each financial year to their bank if their total income is below the taxable limit (₹3 lakh for seniors, ₹5 lakh for super seniors above 80). This prevents TDS from being deducted on FD interest.',
      },
    ],
  },
];

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="faq-item"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <button className="faq-question" onClick={() => setOpen(o => !o)}>
        <span className="faq-q-text">{item.q}</span>
        <span className={`faq-toggle ${open ? 'open' : ''}`}>▼</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="faq-answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <p>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ({ language }) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="faq-container">
      {/* Header */}
      <div className="faq-header">
        <div className="faq-header-stamp">FAQ</div>
        <div className="faq-header-text">
          <h1 className="faq-title">सहायता केंद्र <span>/ Help Center</span></h1>
          <p className="faq-subtitle">Frequently Asked Questions about FD Saathi</p>
        </div>
        <div className="faq-header-seal">VERIFIED<br/>✓</div>
      </div>

      <div className="faq-layout">
        {/* Category sidebar */}
        <nav className="faq-sidebar">
          {FAQ_DATA.map((cat, i) => (
            <button
              key={i}
              className={`faq-cat-btn ${activeCategory === i ? 'active' : ''}`}
              onClick={() => setActiveCategory(i)}
            >
              <span className="faq-cat-icon">{cat.icon}</span>
              <span className="faq-cat-name">{cat.category}</span>
              <span className="faq-cat-hi">{cat.categoryHi}</span>
              <span className="faq-cat-count">{cat.items.length}</span>
            </button>
          ))}
        </nav>

        {/* Questions panel */}
        <div className="faq-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <div className="faq-content-header">
                <span className="faq-content-icon">{FAQ_DATA[activeCategory].icon}</span>
                <span className="faq-content-title">{FAQ_DATA[activeCategory].category}</span>
                <span className="faq-content-divider">/</span>
                <span className="faq-content-hi">{FAQ_DATA[activeCategory].categoryHi}</span>
              </div>
              <div className="faq-items-list">
                {FAQ_DATA[activeCategory].items.map((item, i) => (
                  <FAQItem key={i} item={item} index={i} />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer note */}
      <div className="faq-footer-note">
        <span className="rubber-stamp" style={{ transform: 'rotate(-2deg)', fontSize: '0.65rem' }}>INFORMATIONAL ONLY</span>
        <p>FD Saathi provides general information only. This is not personalized financial advice. Please consult a SEBI-registered investment advisor before making investment decisions.</p>
      </div>
    </div>
  );
}
