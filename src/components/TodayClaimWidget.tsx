import React from 'react';
import type { RewardApp, DailyClaimLog } from '../types';
import { CheckCircle2, Flame, Gift, Sparkles, Clock, History } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface TodayClaimWidgetProps {
  apps: RewardApp[];
  todayClaims: { [appId: string]: boolean };
  onClaim: (app: RewardApp) => void;
  onUnclaim?: (app: RewardApp) => void;
  recentLogs: DailyClaimLog[];
}

export const TodayClaimWidget: React.FC<TodayClaimWidgetProps> = ({
  apps,
  todayClaims,
  onClaim,
  onUnclaim,
  recentLogs,
}) => {
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[today.getDay()];
  const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;

  const nielsen = apps.find((a) => a.id === 'nielsen-more');
  const vtion = apps.find((a) => a.id === 'vtion-digital');

  const nielsenClaimed = nielsen ? todayClaims[nielsen.id] : false;
  const vtionClaimed = vtion ? todayClaims[vtion.id] : false;

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem 1.5rem',
      marginBottom: '1.75rem',
      background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(22, 33, 59, 0.7) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.2)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Left: Today's Status Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
          }}>
            <Flame size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', margin: 0 }}>
                Today's Claim Center
              </h3>
              <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                <Clock size={10} /> {dayName} Check-in
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.15rem' }}>
              {isTuesday 
                ? '🔥 Tuesday alert! Both Nielsen More (50 pts) & Vtion Digital (10 pts = ₹10) are active today!' 
                : `Nielsen More 50 points ready. Vtion Digital credits on Tuesday (${daysUntilTuesday} days away).`}
            </p>
          </div>
        </div>

        {/* Right: Quick Action Buttons for Today */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Nielsen Claim Button */}
          {nielsen && (
            nielsenClaimed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'rgba(56, 189, 248, 0.12)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                color: '#38bdf8',
                padding: '0.45rem 0.8rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} /> Nielsen +50 Claimed
                </span>
                {onUnclaim && (
                  <button
                    onClick={() => onUnclaim(nielsen)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.45rem',
                      cursor: 'pointer',
                    }}
                    title="Undo claim"
                  >
                    Undo
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onClaim(nielsen)}
                className="btn-primary"
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                <Sparkles size={14} /> Claim Nielsen 50 Pts
              </button>
            )
          )}

          {/* Vtion Claim Button */}
          {vtion && (
            vtionClaimed ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                padding: '0.45rem 0.8rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={16} /> Vtion +10 Claimed
                </span>
                {onUnclaim && (
                  <button
                    onClick={() => onUnclaim(vtion)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      color: '#cbd5e1',
                      fontSize: '0.72rem',
                      padding: '0.2rem 0.45rem',
                      cursor: 'pointer',
                    }}
                    title="Undo claim"
                  >
                    Undo
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onClaim(vtion)}
                className={isTuesday ? 'btn-emerald' : 'btn-secondary'}
                style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                <Gift size={14} />
                {isTuesday ? 'Claim Tuesday Vtion 10 Pts (₹10)' : `Log Vtion (₹10)`}
              </button>
            )
          )}

        </div>

      </div>

      {recentLogs.length > 0 && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          flexWrap: 'wrap',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1', fontWeight: 600 }}>
            <History size={13} /> Recent Claimed Points:
          </span>
          {recentLogs.slice(0, 4).map((log) => (
            <span
              key={log.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.2rem 0.5rem',
                borderRadius: '6px',
                color: '#e2e8f0',
                fontSize: '0.72rem',
              }}
            >
              <strong>{log.appName}</strong>: +{log.points} pts ({formatINR(log.rupees, true)})
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
