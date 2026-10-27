import React, { useState } from 'react';
import { X, Sparkles, Check, HelpCircle, ArrowRight } from 'lucide-react';
import type { RewardApp } from '../types';
import { formatINR } from '../utils/calculations';

interface NielsenFormulaModalProps {
  app: RewardApp;
  isOpen: boolean;
  onClose: () => void;
  onSave: (points: number, rupees: number) => void;
}

export const NielsenFormulaModal: React.FC<NielsenFormulaModalProps> = ({
  app,
  isOpen,
  onClose,
  onSave,
}) => {
  const [pointsInput, setPointsInput] = useState<number>(app.pointConversionFormula.points || 100);
  const [rupeesInput, setRupeesInput] = useState<number>(app.pointConversionFormula.rupees || 10);

  if (!isOpen) return null;

  const calculatedRatio = pointsInput > 0 ? rupeesInput / pointsInput : 0;
  const dailyYieldRupees = 50 * calculatedRatio;
  const weeklyYieldRupees = 350 * calculatedRatio;
  const monthlyYieldRupees = (18250 / 12) * calculatedRatio;
  const yearlyYieldRupees = 18250 * calculatedRatio;

  const presets = [
    { label: '₹100 for 1,100 Pts (Official 11 pts = ₹1)', pts: 1100, rs: 100 },
    { label: '₹150 for 1,650 Pts (11 pts = ₹1)', pts: 1650, rs: 150 },
    { label: '₹200 for 2,200 Pts (11 pts = ₹1)', pts: 2200, rs: 200 },
    { label: '₹250 for 2,750 Pts (11 pts = ₹1)', pts: 2750, rs: 250 },
    { label: '₹300 for 3,300 Pts (11 pts = ₹1)', pts: 3300, rs: 300 },
    { label: '₹500 for 5,500 Pts (11 pts = ₹1)', pts: 5500, rs: 500 },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsInput > 0 && rupeesInput >= 0) {
      onSave(pointsInput, rupeesInput);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div className="glass-panel-elevated" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '1.75rem',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.2)',
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
                Configure {app.name} Point Conversion
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
                Set your exact redemption rules (gift vouchers, UPI cash, etc.)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '0.35rem',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Info Banner */}
        <div style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          marginBottom: '1.25rem',
          fontSize: '0.85rem',
          color: '#bae6fd',
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'flex-start',
        }}>
          <HelpCircle size={18} style={{ flexShrink: 0, marginTop: '2px', color: '#38bdf8' }} />
          <div>
            <strong>How it works:</strong> You earn <strong>50 points daily</strong> on Nielsen More.
            When you know how many points are needed for cash or vouchers, type it here! All calculations will instantly update.
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <label htmlFor="ptsInput">Points Required</label>
              <input
                id="ptsInput"
                type="number"
                min="1"
                step="1"
                value={pointsInput}
                onChange={(e) => setPointsInput(Math.max(1, Number(e.target.value)))}
                required
                style={{ fontSize: '1.1rem', fontWeight: 700 }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                e.g. 1,000 points
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>EQUALS</span>
              <ArrowRight size={20} color="#38bdf8" />
            </div>

            <div>
              <label htmlFor="rsInput">Cash / Voucher Value (₹)</label>
              <input
                id="rsInput"
                type="number"
                min="0"
                step="any"
                value={rupeesInput}
                onChange={(e) => setRupeesInput(Math.max(0, Number(e.target.value)))}
                required
                style={{ fontSize: '1.1rem', fontWeight: 700 }}
              />
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                e.g. ₹100 Rupees
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
              POPULAR QUICK PRESETS:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {presets.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setPointsInput(p.pts);
                    setRupeesInput(p.rs);
                  }}
                  style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    fontSize: '0.75rem',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>EFFECTIVE VALUE</span>
              <span className="badge badge-cyan">
                1 Point = ₹{calculatedRatio.toFixed(3)}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Daily (50 pts)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{formatINR(dailyYieldRupees, true)}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Weekly (350 pts)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{formatINR(weeklyYieldRupees, true)}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Monthly (~1.5k)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>{formatINR(monthlyYieldRupees, true)}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Yearly (18.2k)</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399' }}>{formatINR(yearlyYieldRupees)}</div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={16} /> Save Conversion Formula
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
