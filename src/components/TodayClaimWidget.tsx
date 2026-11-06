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
  const vtion   = apps.find((a) => a.id === 'vtion-digital');

  const nielsenClaimed = nielsen ? todayClaims[nielsen.id] : false;
  const vtionClaimed   = vtion   ? todayClaims[vtion.id]   : false;

  return (
    <div className="card claim-widget">

      {/* ── Top Row ───────────────────────────────────── */}
      <div className="flex justify-between flex-wrap gap-4">

        {/* Left: Status Banner */}
        <div className="claim-status-banner">
          <div className="claim-flame-icon">
            <Flame size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                Today's Claim Center
              </h3>
              <span className="badge badge-amber">
                <Clock size={10} /> {dayName} Check-in
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
              {isTuesday
                ? '🔥 Tuesday alert! Both Nielsen More (50 pts) & Vtion Digital (10 pts = ₹10) are active today!'
                : `Nielsen More 50 points ready. Vtion Digital credits on Tuesday (${daysUntilTuesday} days away).`}
            </p>
          </div>
        </div>

        {/* Right: Claim Buttons */}
        <div className="flex items-center gap-3 flex-wrap">

          {/* Nielsen */}
          {nielsen && (
            nielsenClaimed ? (
              <div className="claimed-pill claimed-pill-blue">
                <CheckCircle2 size={15} />
                <span>Nielsen +50 Claimed</span>
                {onUnclaim && (
                  <button
                    onClick={() => onUnclaim(nielsen)}
                    className="undo-btn"
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
              >
                <Sparkles size={13} /> Claim Nielsen 50 Pts
              </button>
            )
          )}

          {/* Vtion */}
          {vtion && (
            vtionClaimed ? (
              <div className="claimed-pill claimed-pill-green">
                <CheckCircle2 size={15} />
                <span>Vtion +10 Claimed</span>
                {onUnclaim && (
                  <button
                    onClick={() => onUnclaim(vtion)}
                    className="undo-btn"
                    title="Undo claim"
                  >
                    Undo
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onClaim(vtion)}
                className={isTuesday ? 'btn-green' : 'btn-secondary'}
              >
                <Gift size={13} />
                {isTuesday ? 'Claim Tuesday Vtion 10 Pts (₹10)' : 'Log Vtion (₹10)'}
              </button>
            )
          )}

        </div>
      </div>

      {/* ── Recent Logs Row ───────────────────────────── */}
      {recentLogs.length > 0 && (
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <div className="recent-logs-row">
            <span
              className="flex items-center gap-1"
              style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.78rem', flexShrink: 0 }}
            >
              <History size={12} /> Recent:
            </span>
            {recentLogs.slice(0, 4).map((log) => (
              <span key={log.id} className="log-chip">
                <strong style={{ color: 'var(--text-primary)' }}>{log.appName}</strong>
                +{log.points} pts ({formatINR(log.rupees, true)})
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
