import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FD_DATA, calcMaturity, calcInterestEarned } from '../data/fdData';
import { formatDualNumber, formatDualRate, t } from '../utils/language';
import './Simulator.css';

// ── Abacus Column ──
const BEAD_COUNTS = [1, 2, 5, 10, 20]; // multiplier weights
const COLS = [
  { label: '₹1000', value: 1000 },
  { label: '₹5000', value: 5000 },
  { label: '₹10K', value: 10000 },
  { label: '₹50K', value: 50000 },
  { label: '₹1L', value: 100000 },
];
const MAX_BEADS = 9;

function AbacusColumn({ col, active, onToggle }) {
  return (
    <div className="ab-col">
      <div className="ab-rod">
        {Array.from({ length: MAX_BEADS }).map((_, i) => {
          const isActive = i < active;
          return (
            <motion.div
              key={i}
              className={`abacus-bead ${isActive ? 'active' : ''}`}
              whileTap={{ scale: 0.9 }}
              animate={isActive
                ? { y: 0, boxShadow: 'inset -3px -3px 6px rgba(0,0,0,0.3), 2px 2px 4px rgba(0,0,0,0.2)' }
                : { y: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              onClick={() => onToggle(i + 1 === active ? i : i + 1)}
              title={`Set ${col.label} × ${i + 1}`}
            />
          );
        })}
      </div>
      <div className="ab-label">{col.label}</div>
      <div className="ab-count">{active}</div>
    </div>
  );
}

// ── Growing Plant SVG ──
function PlantGrowth({ returnPercent }) {
  // returnPercent: 0–100 (capped)
  const pct = Math.min(returnPercent, 100);
  const stemHeight = 20 + pct * 1.2; // 20–140px
  const leafScale = 0.3 + pct / 140;
  const hasFruit = pct > 40;
  const hasFlower = pct > 25;

  const soilLayers = [
    { color: '#5C3A1E', height: 14, label: 'Principal / मूलधन' },
    { color: '#7A5C2E', height: Math.max(0, pct * 0.08), label: 'Year 1' },
    { color: '#8B6914', height: Math.max(0, pct * 0.06), label: 'Year 2' },
    { color: '#9A7A28', height: Math.max(0, pct * 0.05), label: 'Interest' },
  ];

  return (
    <div className="plant-container">
      <svg className="plant-svg" viewBox="0 0 120 220" preserveAspectRatio="xMidYMax meet">
        {/* Soil pot */}
        <rect x="25" y="180" width="70" height="35" rx="4" fill="#8B4513" />
        <rect x="20" y="175" width="80" height="10" rx="2" fill="#A0522D" />

        {/* Soil layers (stacking from bottom) */}
        {(() => {
          let y = 180;
          return soilLayers.map((layer, i) => {
            const h = layer.height;
            y -= h;
            return (
              <motion.rect
                key={i}
                x="25" y={y} width="70" height={h} fill={layer.color}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                style={{ transformOrigin: `60px ${y + h}px` }}
                transition={{ delay: i * 0.15, duration: 0.4, ease: 'easeOut' }}
              />
            );
          });
        })()}

        {/* Stem */}
        <motion.line
          x1="60" y1="175"
          x2="60" y2={175 - stemHeight}
          stroke="#2D5A0A"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Left leaf */}
        {pct > 5 && (
          <motion.ellipse
            cx={60 - 18 * leafScale * 2}
            cy={175 - stemHeight * 0.5}
            rx={18 * leafScale}
            ry={8 * leafScale}
            fill="#4A8C1A"
            style={{ transformOrigin: `60px ${175 - stemHeight * 0.5}px` }}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: -25 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          />
        )}

        {/* Right leaf */}
        {pct > 10 && (
          <motion.ellipse
            cx={60 + 18 * leafScale * 2}
            cy={175 - stemHeight * 0.65}
            rx={18 * leafScale}
            ry={8 * leafScale}
            fill="#5AAD1E"
            style={{ transformOrigin: `60px ${175 - stemHeight * 0.65}px` }}
            initial={{ scale: 0, rotate: 30 }}
            animate={{ scale: 1, rotate: 28 }}
            transition={{ delay: 0.55, type: 'spring', stiffness: 300 }}
          />
        )}

        {/* Top flower / fruit */}
        {hasFlower && (
          <motion.circle
            cx="60" cy={175 - stemHeight - 6}
            r={hasFruit ? 10 : 7}
            fill={hasFruit ? '#E8841A' : '#FFD700'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 400 }}
          />
        )}
        {hasFruit && (
          <motion.text
            x="60" y={175 - stemHeight - 2}
            textAnchor="middle"
            fontSize="9"
            fill="#1A1A1A"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >₹</motion.text>
        )}

        {/* Return % label on stem */}
        {pct > 0 && (
          <text
            x="74" y={175 - stemHeight * 0.5}
            fontSize="8"
            fill="#2D5A0A"
            fontFamily="monospace"
            fontWeight="bold"
          >+{pct.toFixed(1)}%</text>
        )}
      </svg>

      {/* Soil layer legend */}
      <div className="plant-legend">
        <div className="pl-row">
          <span className="pl-dot" style={{ background: '#5C3A1E' }} />
          <span>मूलधन / Principal</span>
        </div>
        <div className="pl-row">
          <span className="pl-dot" style={{ background: '#9A7A28' }} />
          <span>ब्याज / Interest (compound)</span>
        </div>
      </div>
    </div>
  );
}

export default function Simulator({ language, rates }) {
  const [beadCounts, setBeadCounts] = useState([0, 0, 1, 0, 0]); // default 10K
  const [selectedFdIdx, setSelectedFdIdx] = useState(0);

  const fdList = rates || FD_DATA;
  const principal = beadCounts.reduce((sum, count, i) => sum + count * COLS[i].value, 0);
  const fd = fdList[Math.min(selectedFdIdx, fdList.length - 1)];
  const maturity = principal > 0 ? calcMaturity(principal, fd.rate, fd.tenureMonths) : 0;
  const interest = principal > 0 ? calcInterestEarned(principal, fd.rate, fd.tenureMonths) : 0;
  const returnPct = principal > 0 ? (interest / principal) * 100 : 0;

  const updateBead = useCallback((colIdx, val) => {
    setBeadCounts(prev => {
      const next = [...prev];
      next[colIdx] = Math.max(0, Math.min(MAX_BEADS, val));
      return next;
    });
  }, []);

  return (
    <div className="sim-container">
      <div className="sim-header">
        <div className="sim-title">
          <span className="sim-title-hi">निवेश गणक</span>
          <span className="sim-title-en"> / Investment Simulator</span>
        </div>
        <div className="sim-stamp">
          <span className="rubber-stamp" style={{ color: 'var(--teal)', borderColor: 'var(--teal)' }}>
            ABACUS MODE
          </span>
        </div>
      </div>

      <div className="sim-body">
        {/* LEFT: Abacus */}
        <div className="sim-left">
          <div className="sim-abacus-label">
            <span className="sim-ab-hi">मनके हिलाएं = राशि बदलें</span>
            <span className="sim-ab-en">Move beads to set your amount</span>
          </div>

          <div className="sim-abacus">
            <div className="ab-frame">
              <div className="ab-top-bar" />
              <div className="ab-cols">
                {COLS.map((col, i) => (
                  <AbacusColumn
                    key={col.label}
                    col={col}
                    active={beadCounts[i]}
                    onToggle={val => updateBead(i, val)}
                  />
                ))}
              </div>
              <div className="ab-bottom-bar" />
            </div>
          </div>

          {/* Principal display */}
          <div className="sim-principal-display">
            <span className="sim-principal-label">
              <span className="font-hindi">मूलधन</span> / Principal
            </span>
            <motion.span
              key={principal}
              className="sim-principal-value"
              initial={{ scale: 1.15, color: '#E8841A' }}
              animate={{ scale: 1, color: '#F5F0E8' }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              ₹{principal > 0 ? formatDualNumber(principal, language) : '—'}
            </motion.span>
          </div>

          {/* FD selector */}
          <div className="sim-fd-select">
            <span className="sim-fd-select-label font-hindi">FD चुनें / Select FD:</span>
            <div className="sim-fd-options">
              {fdList.map((f, i) => (
                <button
                  key={f.id}
                  className={`sim-fd-opt ${selectedFdIdx === i ? 'active' : ''}`}
                  onClick={() => setSelectedFdIdx(i)}
                >
                  <span className="sim-fd-opt-bank">{f.bankShort}</span>
                  <span className="sim-fd-opt-rate">{f.rate}%</span>
                  <span className="sim-fd-opt-tenure">{f.tenureMonths}mo</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Plant + Results */}
        <div className="sim-right">
          <PlantGrowth returnPercent={returnPct} />

          <AnimatePresence mode="wait">
            {principal > 0 && (
              <motion.div
                key={`${principal}-${selectedFdIdx}`}
                className="sim-results"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <div className="sim-result-row">
                  <span className="sim-result-label font-hindi">बैंक / Bank</span>
                  <span className="sim-result-value">{fd.bankShort}</span>
                </div>
                <div className="sim-result-row">
                  <span className="sim-result-label font-hindi">दर / Rate</span>
                  <span className="sim-result-value sim-rate">
                    {formatDualRate(fd.rate, language)}
                  </span>
                </div>
                <div className="sim-result-row">
                  <span className="sim-result-label font-hindi">अवधि / Tenure</span>
                  <span className="sim-result-value">{fd.tenure}</span>
                </div>
                <div className="sim-divider" />
                <div className="sim-result-row">
                  <span className="sim-result-label font-hindi">ब्याज / Interest</span>
                  <motion.span
                    key={interest}
                    className="sim-result-value sim-interest"
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500 }}
                  >
                    +₹{formatDualNumber(interest, language)}
                  </motion.span>
                </div>
                <div className="sim-result-row sim-total-row">
                  <span className="sim-result-label font-hindi">परिपक्वता / Maturity</span>
                  <motion.span
                    key={maturity}
                    className="sim-result-value sim-maturity"
                    initial={{ scale: 1.1, color: 'var(--primary)' }}
                    animate={{ scale: 1, color: 'var(--teal)' }}
                    transition={{ type: 'spring', stiffness: 350 }}
                  >
                    ₹{formatDualNumber(maturity, language)}
                  </motion.span>
                </div>

                {fd.insured && (
                  <div className="sim-insured-note">
                    🔒 DICGC बीमित — सरकारी गारंटी ₹5 लाख तक
                  </div>
                )}
              </motion.div>
            )}

            {principal === 0 && (
              <motion.div
                key="empty"
                className="sim-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="font-hindi">मनके हिलाएं →</span>
                <span>Move beads to start</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
