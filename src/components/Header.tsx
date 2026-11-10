import React from 'react';
import { Coins, Sparkles, Download, Upload, RotateCcw, CalendarCheck, Gamepad2, Lock } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onExportCsv: () => void;
  onImport: () => void;
  onReset: () => void;
  onOpenZeroGuide?: () => void;
  onOpenGamingPc?: () => void;
  onLock?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExport,
  onExportCsv,
  onImport,
  onReset,
  onOpenZeroGuide,
  onOpenGamingPc,
  onLock,
}) => {
  const today = new Date();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[today.getDay()];
  const isTuesday = today.getDay() === 2;

  const dateStr = today.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="app-header">
      <div className="flex items-center justify-between flex-wrap gap-4">

        {/* ── Brand ─────────────────────────────────────── */}
        <div className="header-brand">
          <div className="header-logo-pill">
            <Coins size={24} color="#ffffff" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="header-title">
                MoneyFlow <span>OS</span>
              </h1>
              <span className="badge badge-blue">
                <Sparkles size={10} /> Multi-Stream Tracker
              </span>
            </div>
            <p className="header-subtitle">
              Track Nielsen More, Vtion Digital, Job Earnings, Expenses &amp; Long-Term Wealth
            </p>
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────── */}
        <div className="header-actions">

          {/* Date Badge */}
          <div
            className="header-date-badge"
            style={isTuesday ? { borderColor: 'rgba(34,197,94, 0.4)' } : undefined}
          >
            <CalendarCheck size={15} color={isTuesday ? '#4ade80' : '#67e8f9'} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Today
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {dayName}, {dateStr}
                {isTuesday && (
                  <span className="badge badge-green" style={{ fontSize: '0.62rem', padding: '0.12rem 0.4rem' }}>
                    Vtion Day!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gaming PC Setup Goal Button */}
          {onOpenGamingPc && (
            <button
              onClick={onOpenGamingPc}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                borderColor: 'rgba(167,139,250, 0.5)',
                boxShadow: '0 4px 14px rgba(167,139,250, 0.35)',
              }}
              title="Track Dream Gaming PC Setup Goal (₹5,08,000)"
            >
              <Gamepad2 size={13} /> 🎮 Gaming PC Goal
            </button>
          )}

          {/* Zero Guide Button */}
          {onOpenZeroGuide && (
            <button
              onClick={onOpenZeroGuide}
              className="btn-primary"
              style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', borderColor: 'rgba(34,197,94,0.5)', boxShadow: 'var(--shadow-green)' }}
              title="2026 Zero Investment Earning Guide"
            >
              <Sparkles size={13} /> Free Apps Guide
            </button>
          )}

          {/* CSV Export */}
          <button
            onClick={onExportCsv}
            className="btn-secondary"
            title="Download Excel / CSV Report"
            style={{ color: '#4ade80', borderColor: 'rgba(34,197,94,0.3)' }}
          >
            <Download size={13} /> Excel CSV
          </button>

          {/* JSON Export */}
          <button
            onClick={onExport}
            className="btn-secondary"
            title="Download JSON Backup"
          >
            JSON
          </button>

          {/* Import */}
          <button
            onClick={onImport}
            className="btn-secondary"
            title="Import Backup Data"
          >
            <Upload size={13} />
          </button>

          {/* Lock */}
          {onLock && (
            <button onClick={onLock} className="btn-secondary" title="Lock the app">
              <Lock size={13} /> Lock
            </button>
          )}

          {/* Reset */}
          <button
            onClick={onReset}
            className="btn-ghost"
            title="Reset to Defaults"
          >
            <RotateCcw size={13} />
          </button>

        </div>
      </div>
    </header>
  );
};
