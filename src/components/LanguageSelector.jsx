import { useState } from 'react';
import { motion } from 'framer-motion';
import { LANGUAGES } from '../utils/language';
import './LanguageSelector.css';

// Folk art SVG motifs rendered inline
const FolkMotif = ({ langCode }) => {
  const motifs = {
    hi: ( // Madhubani — fish + lotus geometry
      <svg viewBox="0 0 60 60" className="folk-svg">
        <ellipse cx="30" cy="30" rx="18" ry="10" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M12,30 Q6,20 12,14 Q18,25 12,30Z" fill="currentColor" opacity="0.6"/>
        <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.4"/>
        <line x1="20" y1="30" x2="40" y2="30" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2,2"/>
        <ellipse cx="30" cy="18" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="26" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    mr: ( // Warli — triangle figures
      <svg viewBox="0 0 60 60" className="folk-svg">
        {/* Village — triangular hut */}
        <polygon points="30,10 20,30 40,30" fill="none" stroke="currentColor" strokeWidth="2"/>
        <rect x="25" y="30" width="10" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        {/* People — triangle bodies */}
        <circle cx="15" cy="42" r="3" fill="currentColor" opacity="0.7"/>
        <polygon points="15,45 11,54 19,54" fill="currentColor" opacity="0.6"/>
        <circle cx="45" cy="42" r="3" fill="currentColor" opacity="0.7"/>
        <polygon points="45,45 41,54 49,54" fill="currentColor" opacity="0.6"/>
        {/* Sun */}
        <circle cx="48" cy="12" r="4" fill="currentColor" opacity="0.5"/>
      </svg>
    ),
    ta: ( // Kolam — dot-and-curve pattern
      <svg viewBox="0 0 60 60" className="folk-svg">
        {[10,20,30,40,50].map(x =>
          [10,20,30,40,50].map(y => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill="currentColor" opacity="0.5"/>
          ))
        )}
        <path d="M20,10 Q30,5 40,10 Q50,20 45,30 Q40,40 30,45 Q20,40 15,30 Q10,20 20,10Z"
          fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M25,20 Q30,16 35,20 Q38,27 35,33 Q30,37 25,33 Q22,27 25,20Z"
          fill="none" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    te: ( // Kalamkari — peacock/lotus
      <svg viewBox="0 0 60 60" className="folk-svg">
        {/* Lotus base */}
        <path d="M30,50 Q20,35 30,25 Q40,35 30,50Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M30,50 Q15,38 22,25 Q30,35 30,50Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <path d="M30,50 Q45,38 38,25 Q30,35 30,50Z" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        {/* Peacock eye */}
        <circle cx="30" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="30" cy="15" r="3" fill="currentColor" opacity="0.5"/>
        {/* Feathers */}
        {[0,45,90,135,180,225,270,315].map((a, i) => (
          <line key={i} x1="30" y1="15"
            x2={30 + 10*Math.cos(a*Math.PI/180)}
            y2={15 + 10*Math.sin(a*Math.PI/180)}
            stroke="currentColor" strokeWidth="1" opacity="0.4"/>
        ))}
      </svg>
    ),
    bn: ( // Kantha — concentric geometric
      <svg viewBox="0 0 60 60" className="folk-svg">
        <rect x="8" y="8" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="16" y="16" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <rect x="24" y="24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="30" cy="30" r="4" fill="currentColor" opacity="0.5"/>
        {/* Corner flowers */}
        {[[8,8],[52,8],[8,52],[52,52]].map(([cx,cy],i) => (
          <circle key={i} cx={cx} cy={cy} r="3" fill="currentColor" opacity="0.6"/>
        ))}
      </svg>
    ),
    en: ( // Block print — geometric repeat
      <svg viewBox="0 0 60 60" className="folk-svg">
        <polygon points="30,5 55,20 55,40 30,55 5,40 5,20" fill="none" stroke="currentColor" strokeWidth="2"/>
        <polygon points="30,15 45,22 45,38 30,45 15,38 15,22" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
        <circle cx="30" cy="30" r="6" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="30" cy="30" r="2" fill="currentColor"/>
      </svg>
    ),
  };
  return motifs[langCode] || motifs.en;
};

export default function LanguageSelector({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [pressed, setPressed] = useState(null);

  return (
    <div className="lang-screen">
      {/* Header stamp */}
      <div className="lang-header">
        <div className="lang-logo-stamp">
          <span className="lang-logo-en">FD</span>
          <span className="lang-logo-hi">एफ.डी.</span>
          <span className="lang-logo-saathi">SAATHI</span>
        </div>
        <p className="lang-subtitle">
          <span className="lang-subtitle-hi">आपका भरोसेमंद Fixed Deposit सलाहकार</span>
          <span className="lang-subtitle-en">Your Trusted Fixed Deposit Advisor</span>
        </p>
        <div className="lang-instruction">
          <span>▶ अपनी भाषा चुनें</span>
          <span className="lang-sep"> / </span>
          <span>Choose Your Language</span>
        </div>
      </div>

      {/* Stamp grid — asymmetric layout */}
      <div className="lang-grid">
        {LANGUAGES.map((lang, idx) => (
          <motion.button
            key={lang.code}
            className={`lang-stamp ${lang.folk} ${pressed === lang.code ? 'stamp-pressed' : ''}`}
            style={{
              '--stamp-idx': idx,
              gridColumn: idx === 0 ? 'span 2' : undefined,
            }}
            onHoverStart={() => setHovered(lang.code)}
            onHoverEnd={() => setHovered(null)}
            onTapStart={() => setPressed(lang.code)}
            onTap={() => {
              setPressed(null);
              setTimeout(() => onSelect(lang.code), 150);
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: '8px 8px 0px #1A1A1A',
              transition: { type: 'spring', stiffness: 500, damping: 20 },
            }}
            whileTap={{
              scale: 0.96,
              boxShadow: '2px 2px 0px #1A1A1A',
              transition: { type: 'spring', stiffness: 800, damping: 25 },
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Folk art motif */}
            <div className="stamp-motif" style={{ color: idx % 2 === 0 ? 'var(--primary)' : 'var(--teal)' }}>
              <FolkMotif langCode={lang.code} />
            </div>

            {/* Stamp impression ring */}
            <div className="stamp-ring" />

            {/* Language name */}
            <div className="stamp-content">
              <span className="stamp-native">{lang.nativeName}</span>
              {lang.name !== lang.nativeName && (
                <span className="stamp-latin">{lang.name}</span>
              )}
              <span className="stamp-region">{lang.region}</span>
            </div>

            {/* RECOMMENDED mark for Hindi */}
            {lang.code === 'hi' && (
              <div className="stamp-recommended">
                <span className="rubber-stamp">लोकप्रिय</span>
              </div>
            )}

            {/* Ink bleeding effect on hover */}
            {hovered === lang.code && (
              <motion.div
                className="stamp-ink-bleed"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Footer */}
      <div className="lang-footer">
        <span>DICGC बीमित · सुरक्षित · विश्वसनीय</span>
        <span className="lang-sep"> ◆ </span>
        <span>DICGC Insured · Safe · Trusted</span>
      </div>
    </div>
  );
}
