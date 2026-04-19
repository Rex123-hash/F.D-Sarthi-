import { useState } from 'react';
import { motion } from 'framer-motion';
import { FD_DATA, calcMaturity, calcInterestEarned } from '../data/fdData';
import { formatDualNumber, formatDualRate, t } from '../utils/language';
import './RailwayTickets.css';

// Convert months → "1 Yr 6 Mo" style
function tenureLabel(months) {
  const yr = Math.floor(months / 12);
  const mo = months % 12;
  if (mo === 0) return `${yr} YR`;
  if (yr === 0) return `${mo} MO`;
  return `${yr}Y ${mo}M`;
}

// Indian Railway ticket serial
function ticketSerial(fd) {
  return `FD${fd.id.split('-')[1] || '1'}/${new Date().getFullYear().toString().slice(2)}${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
}

// Type badge color
const typeColors = {
  'Small Finance Bank': { bg: '#E8841A', text: '#1A1A1A' },
  'NBFC': { bg: '#2A7A6F', text: '#F5F0E8' },
  'PSU Bank': { bg: '#1A1A1A', text: '#F5F0E8' },
};

function RailwayTicket({ fd, idx, language, principal }) {
  const [confirmed, setConfirmed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const maturity = calcMaturity(principal, fd.rate, fd.tenureMonths);
  const interest = calcInterestEarned(principal, fd.rate, fd.tenureMonths);
  const typeColor = typeColors[fd.type] || typeColors['PSU Bank'];
  const rotate = idx === 0 ? -2 : idx % 2 === 0 ? -1.5 : 1.8;

  return (
    <motion.div
      className="ticket-wrapper"
      style={{ '--rotate': `${rotate}deg`, '--delay': `${idx * 0.08}s` }}
      initial={{ opacity: 0, y: 24, rotate: rotate * 2 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: idx * 0.07 }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10, transition: { type: 'spring', stiffness: 400, damping: 22 } }}
    >
      <div
        className={`ticket ${confirmed ? 'ticket-confirmed' : ''} ${flipped ? 'ticket-flipped' : ''}`}
        onClick={() => setFlipped(f => !f)}
      >
        {/* ── FRONT ── */}
        <div className="ticket-front">
          {/* Red strip header */}
          <div className="ticket-header" style={{ background: typeColor.bg }}>
            <span className="ticket-org" style={{ color: typeColor.text }}>
              भारतीय निवेश / INDIAN FD ADVISORY
            </span>
            <span className="ticket-type" style={{ color: typeColor.text }}>
              {fd.type.toUpperCase()}
            </span>
          </div>

          {/* Main body */}
          <div className="ticket-body">
            {/* Left: From → To */}
            <div className="ticket-journey">
              <div className="ticket-station">
                <span className="ticket-station-label">FROM / बैंक</span>
                <span className="ticket-station-name">{fd.bankShort}</span>
              </div>
              <div className="ticket-arrow">→</div>
              <div className="ticket-station">
                <span className="ticket-station-label">TO / परिपक्वता</span>
                <span className="ticket-station-name ticket-maturity">
                  ₹{formatDualNumber(maturity, language)}
                </span>
              </div>
            </div>

            {/* Perforation */}
            <div className="ticket-perf">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="ticket-perf-dot" />
              ))}
            </div>

            {/* Right: Details */}
            <div className="ticket-details">
              <div className="ticket-detail-row">
                <span className="ticket-detail-label">DURATION / अवधि</span>
                <span className="ticket-detail-value">{tenureLabel(fd.tenureMonths)}</span>
              </div>
              <div className="ticket-detail-row">
                <span className="ticket-detail-label">RATE / दर</span>
                <span className="ticket-detail-value ticket-rate">
                  {formatDualRate(fd.rate, language)}
                </span>
              </div>
              <div className="ticket-detail-row">
                <span className="ticket-detail-label">MIN / न्यूनतम</span>
                <span className="ticket-detail-value">₹{fd.minAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="ticket-detail-row">
                <span className="ticket-detail-label">SAFETY</span>
                <span className="ticket-detail-value">{fd.safetyRating}</span>
              </div>
            </div>
          </div>

          {/* Footer strip */}
          <div className="ticket-footer">
            <span className="ticket-serial">{ticketSerial(fd)}</span>
            {fd.insured && <span className="ticket-insured">DICGC ✓</span>}
            {fd.highlight && <span className="rubber-stamp ticket-reco">RECOMMENDED</span>}
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="ticket-back">
          <div className="ticket-back-header">
            <span>INTEREST EARNED / अर्जित ब्याज</span>
          </div>
          <div className="ticket-back-body">
            <div className="tbb-row">
              <span>Principal / मूलधन</span>
              <span className="tbb-val">₹{formatDualNumber(principal, language)}</span>
            </div>
            <div className="tbb-row">
              <span>Interest / ब्याज</span>
              <span className="tbb-val tbb-green">+₹{formatDualNumber(interest, language)}</span>
            </div>
            <div className="tbb-divider" />
            <div className="tbb-row tbb-total">
              <span>Maturity / परिपक्वता</span>
              <span className="tbb-val">₹{formatDualNumber(maturity, language)}</span>
            </div>
            <div className="tbb-note">
              *After {fd.tenureMonths} months at {fd.rate}% p.a. (compound annual)
            </div>
          </div>
          <motion.button
            className="ticket-confirm-btn"
            whileTap={{ scale: 0.94 }}
            onClick={e => { e.stopPropagation(); setConfirmed(true); }}
          >
            {confirmed ? '✓ BOOKED / पुष्टि हो गई' : '▶ CONFIRM BOOKING / पुष्टि करें'}
          </motion.button>
        </div>
      </div>

      <div className="ticket-shadow" />
    </motion.div>
  );
}

export default function RailwayTickets({ language, principal = 100000 }) {
  const [filterType, setFilterType] = useState('all');
  const filtered = FD_DATA.filter(fd => filterType === 'all' || fd.type === filterType);

  return (
    <div className="tickets-container">
      {/* Filter row */}
      <div className="tickets-filter-row">
        <span className="tickets-title">
          <span className="tickets-title-hi">FD विकल्प</span>
          <span className="tickets-title-en"> / Pick Your FD</span>
        </span>
        <div className="tickets-filters">
          {['all', 'Small Finance Bank', 'NBFC', 'PSU Bank'].map(f => (
            <button
              key={f}
              className={`tickets-filter-btn ${filterType === f ? 'active' : ''}`}
              onClick={() => setFilterType(f)}
            >
              {f === 'all' ? 'सभी / All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets pile */}
      <div className="tickets-pile">
        {filtered.map((fd, i) => (
          <RailwayTicket
            key={fd.id}
            fd={fd}
            idx={i}
            language={language}
            principal={principal}
          />
        ))}
      </div>

      <p className="tickets-hint">← Click ticket to flip / back दिखाने के लिए क्लिक करें</p>
    </div>
  );
}
