import React from 'react';
import { X, CheckCircle, Clock } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface NielsenTiersModalProps {
  currentPoints: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectTier: (points: number, rupees: number) => void;
}

export const NielsenTiersModal: React.FC<NielsenTiersModalProps> = ({
  currentPoints,
  isOpen,
  onClose,
  onSelectTier,
}) => {
  if (!isOpen) return null;

  const tiers = [
    { inr: 100, points: 1100 },
    { inr: 150, points: 1650 },
    { inr: 200, points: 2200 },
    { inr: 250, points: 2750 },
    { inr: 300, points: 3300 },
    { inr: 350, points: 3850 },
    { inr: 400, points: 4400 },
    { inr: 450, points: 4950 },
    { inr: 500, points: 5500 },
  ];

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
        maxWidth: '520px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.75rem',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Nielsen Official App Rates
              </span>
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', margin: '0.35rem 0 0 0' }}>
              Please Select UPI Amount
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94a3b8', margin: '0.15rem 0 0 0' }}>
              Your current balance: <strong style={{ color: '#38bdf8' }}>{currentPoints.toLocaleString()} Points</strong> (≈ {formatINR((currentPoints / 1100) * 100, true)})
            </p>
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

        {/* Scrollable Tiers List */}
        <div style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          paddingRight: '0.35rem',
          marginBottom: '1.25rem',
        }}>
          {tiers.map((tier) => {
            const isEligible = currentPoints >= tier.points;
            const pointsNeeded = tier.points - currentPoints;
            const daysNeeded = Math.ceil(pointsNeeded / 50);

            return (
              <div
                key={tier.inr}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: isEligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(15, 23, 42, 0.6)',
                  border: isEligible ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: isEligible ? '#34d399' : '#f1f5f9' }}>
                      INR {tier.inr}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      ({tier.points.toLocaleString()} points)
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    {isEligible ? (
                      <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <CheckCircle size={13} /> Ready to redeem! ({currentPoints - tier.points} pts left over)
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> Needs {pointsNeeded.toLocaleString()} more pts (~{daysNeeded} days at 50 pts/day)
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  {isEligible ? (
                    <button
                      onClick={() => {
                        onSelectTier(tier.points, tier.inr);
                        onClose();
                      }}
                      className="btn-emerald"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    >
                      Redeem ₹{tier.inr}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
