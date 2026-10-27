import React, { useState } from 'react';
import type { AppState } from '../types';
import { formatINR, projectFutureWealth } from '../utils/calculations';
import { Target, TrendingUp, Zap } from 'lucide-react';

interface PassiveIncomeSimulatorProps {
  state: AppState;
}

export const PassiveIncomeSimulator: React.FC<PassiveIncomeSimulatorProps> = ({ state }) => {
  const [targetCash, setTargetCash] = useState<number>(1000); // e.g. Target ₹1000 voucher

  const nielsen = state.rewardApps.find((a) => a.id === 'nielsen-more');
  const vtion = state.rewardApps.find((a) => a.id === 'vtion-digital');

  const nielsenRatio = nielsen?.pointToRupeeRatio || 0.1;
  const nielsenDailyCash = 50 * nielsenRatio;
  const vtionWeeklyCash = vtion && vtion.enabled ? vtion.pointsPerCycle * vtion.pointToRupeeRatio : 10;
  const vtionDailyCash = vtionWeeklyCash / 7;

  const combinedDailyCash = nielsenDailyCash + vtionDailyCash;

  // Days calculations
  const daysNielsenOnly = nielsenDailyCash > 0 ? Math.ceil(targetCash / nielsenDailyCash) : 0;
  const daysCombined = combinedDailyCash > 0 ? Math.ceil(targetCash / combinedDailyCash) : 0;

  const targetDateCombined = new Date();
  targetDateCombined.setDate(targetDateCombined.getDate() + daysCombined);
  const formattedTargetDate = targetDateCombined.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Passive App Monthly Yield
  const monthlyAppCash = combinedDailyCash * 30.416;

  // Reinvestment compounding projections
  const projection3Yr = projectFutureWealth(0, monthlyAppCash, 12, 3);
  const projection5Yr = projectFutureWealth(0, monthlyAppCash, 12, 5);

  const presets = [250, 500, 1000, 2500, 5000];

  return (
    <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'rgba(168, 85, 247, 0.15)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c084fc',
        }}>
          <Target size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
            Passive Earning Goal & Compounding Simulator
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
            Calculate target timelines to reach Amazon gift cards and SIP reinvestment growth
          </p>
        </div>
      </div>

      {/* Target Amount Input */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '1.25rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem', color: '#f1f5f9', fontWeight: 600, margin: 0 }}>
            Set Target Payout / Voucher Goal:
          </label>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {presets.map((val) => (
              <button
                key={val}
                onClick={() => setTargetCash(val)}
                style={{
                  background: targetCash === val ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: targetCash === val ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: targetCash === val ? '#ffffff' : '#94a3b8',
                  borderRadius: '8px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ₹{val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="number"
              min="10"
              step="50"
              value={targetCash}
              onChange={(e) => setTargetCash(Math.max(10, Number(e.target.value)))}
              style={{ fontSize: '1.2rem', fontWeight: 700, paddingLeft: '2rem' }}
            />
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>
              ₹
            </span>
          </div>
        </div>
      </div>

      {/* Target Achievement Results */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem',
      }}>
        {/* Combined Pace */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
            <Zap size={14} /> COMBINED PACE (NIELSEN + VTION)
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
            {daysCombined} Days
          </div>
          <span style={{ fontSize: '0.78rem', color: '#e2e8f0', display: 'block', marginTop: '0.2rem' }}>
            Reach {formatINR(targetCash)} around <strong>{formattedTargetDate}</strong>
          </span>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
            Earning ~{formatINR(combinedDailyCash, true)}/day passively
          </span>
        </div>

        {/* Nielsen More Alone */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>
            Nielsen More Alone (50 Pts/Day)
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {daysNielsenOnly} Days
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginTop: '0.2rem' }}>
            Needs {Math.round(targetCash / nielsenRatio).toLocaleString()} Nielsen points
          </span>
          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
            At current {nielsen?.pointConversionFormula.points} pts = ₹{nielsen?.pointConversionFormula.rupees} rate
          </span>
        </div>
      </div>

      {/* Secret Superpower: Reinvesting App Earnings into a 12% SIP */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '14px',
        padding: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <TrendingUp size={18} color="#c084fc" />
          <h4 style={{ fontSize: '1rem', color: '#f1f5f9', margin: 0 }}>
            💡 What If You Reinvest All App Cash Into an Index SIP (12% p.a.)?
          </h4>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.825rem', marginBottom: '1rem' }}>
          Instead of spending app points on small items, investing your monthly ~{formatINR(monthlyAppCash)} passive app yield builds real compounding wealth:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>In 3 Years</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
              {formatINR(projection3Yr.totalWealth)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#34d399' }}>
              +{formatINR(projection3Yr.totalGains)} free gains
            </span>
          </div>

          <div style={{ background: 'rgba(168, 85, 247, 0.12)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>In 5 Years</span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              {formatINR(projection5Yr.totalWealth)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>
              +{formatINR(projection5Yr.totalGains)} free gains!
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
