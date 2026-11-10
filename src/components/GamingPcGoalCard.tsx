import React from 'react';
import { Gamepad2, ArrowUpRight, Sparkles, Monitor, Cpu, Trophy, Target } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface GamingPcGoalCardProps {
  currentWealth: number;
  onOpenModal: () => void;
}

export const GamingPcGoalCard: React.FC<GamingPcGoalCardProps> = ({ currentWealth, onOpenModal }) => {
  const targetGoalInr = 508000; // Complete turn-key 20-part gaming setup (₹5,08,000 / ~$6,100)
  const remainingNeeded = Math.max(0, targetGoalInr - currentWealth);
  const percentAchieved = Math.min(100, Math.round((currentWealth / targetGoalInr) * 1000) / 10);

  return (
    <section className="card card-purple mb-10" style={{
      padding: '1.75rem',
      background: 'linear-gradient(135deg, rgba(30, 20, 50, 0.6) 0%, rgba(13, 21, 38, 0.95) 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow accent */}
      <div style={{
        position: 'absolute',
        top: -60,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top Banner Row */}
      <div className="flex justify-between items-start flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 18px rgba(139, 92, 246, 0.4)',
            flexShrink: 0,
          }}>
            <Gamepad2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 style={{ fontSize: '1.3rem', color: '#f8fafc', margin: 0, fontWeight: 800 }}>
                Dream Target Goal: Complete Pro Gaming PC Setup
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                <Trophy size={10} /> Ultimate Battlestation
              </span>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.82rem', marginTop: '0.15rem' }}>
              Full 20-component blueprint: Ryzen 7 7800X3D · RTX 4070 Ti Super · 240Hz OLED · Secretlab Magnus Pro XL
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onOpenModal}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            borderColor: 'rgba(139, 92, 246, 0.5)',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)',
            padding: '0.6rem 1.15rem',
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <Sparkles size={14} /> Open Full Setup &amp; Price Details
          <ArrowUpRight size={15} />
        </button>
      </div>

      {/* Financial Gap Summary Matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '0.9rem',
        marginBottom: '1.25rem',
      }}>
        {/* 1. Target Budget */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Target size={12} color="#a855f7" /> Total Setup Budget
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {formatINR(targetGoalInr, true)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#a855f7' }}>
            ~$6,100 USD (All 20 Parts Included)
          </span>
        </div>

        {/* 2. Current Available Net Wealth */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(34, 197, 94, 0.25)',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Your Current Net Wealth
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80', marginTop: '0.2rem' }}>
            {formatINR(currentWealth, true)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#86efac' }}>
            Bank + Gold + Crypto + Rewards
          </span>
        </div>

        {/* 3. Still Remaining Price Gap */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.35)',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            ⚡ Still How Much Price We Want
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171', marginTop: '0.2rem' }}>
            {formatINR(remainingNeeded, true)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#fca5a5' }}>
            Remaining Gap to 100% Fund Setup
          </span>
        </div>

        {/* 4. Progress % */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid rgba(168, 85, 247, 0.25)',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Goal Completion
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
            {percentAchieved}%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {percentAchieved >= 100 ? '🎉 Goal Achieved!' : `${(100 - percentAchieved).toFixed(1)}% to go`}
          </span>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div>
        <div className="flex justify-between items-center text-xs text-secondary mb-1">
          <span>Current Savings: <strong className="text-primary">{formatINR(currentWealth, true)}</strong></span>
          <span>Still Needed: <strong style={{ color: '#f87171' }}>{formatINR(remainingNeeded, true)}</strong></span>
        </div>
        <div style={{
          height: 10,
          borderRadius: 999,
          background: 'rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.max(1, percentAchieved)}%`,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 50%, #38bdf8 100%)',
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.5)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Quick Component Spec Pills */}
      <div style={{
        marginTop: '1.1rem',
        paddingTop: '0.9rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>Includes:</span>
        <span className="tag" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.25)' }}>
          <Cpu size={11} /> Ryzen 7 7800X3D (₹36,500)
        </span>
        <span className="tag" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderColor: 'rgba(34, 197, 94, 0.25)' }}>
          RTX 4070 Ti Super 16GB (₹82,000)
        </span>
        <span className="tag" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.25)' }}>
          <Monitor size={11} /> LG 27" 240Hz OLED (₹64,000)
        </span>
        <span className="tag" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          Secretlab Magnus Pro XL (₹68,000)
        </span>
        <span className="tag" style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.25)' }}>
          Arctis Nova Pro Wireless (₹32,000)
        </span>
      </div>
    </section>
  );
};
