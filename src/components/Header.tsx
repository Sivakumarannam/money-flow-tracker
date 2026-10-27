import React from 'react';
import { Coins, Sparkles, Download, Upload, RotateCcw, CalendarCheck } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onExportCsv: () => void;
  onImport: () => void;
  onReset: () => void;
  onOpenZeroGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onExportCsv, onImport, onReset, onOpenZeroGuide }) => {
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
    <header className="glass-panel" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
          }}>
            <Coins size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                MoneyFlow <span style={{ color: '#38bdf8' }}>OS</span>
              </h1>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                <Sparkles size={11} /> Multi-Stream Tracker
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.15rem' }}>
              Track Nielsen More, Vtion Digital, Job Earnings, Expenses & Long-Term Wealth
            </p>
          </div>
        </div>

        {/* Date and actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          
          {/* Day & Date Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '0.5rem 0.9rem',
            borderRadius: '12px',
            border: isTuesday ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <CalendarCheck size={16} color={isTuesday ? '#34d399' : '#38bdf8'} />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Today
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5f9' }}>
                {dayName}, {dateStr}
                {isTuesday && (
                  <span className="badge badge-emerald" style={{ marginLeft: '0.4rem', fontSize: '0.65rem', padding: '0.15rem 0.4rem' }}>
                    Vtion Day!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2026 Zero Investment Free Apps Guide */}
          {onOpenZeroGuide && (
            <button
              onClick={onOpenZeroGuide}
              className="btn btn-primary"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                border: 'none',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                padding: '0.55rem 0.95rem',
                fontSize: '0.825rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <Sparkles size={14} /> 2026 Free Apps Guide
            </button>
          )}

          {/* Action Buttons */}
          <button 
            onClick={onExportCsv}
            className="btn-secondary"
            title="Download Excel / CSV Report"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.825rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <Download size={13} /> Excel CSV
          </button>

          <button 
            onClick={onExport}
            className="btn-secondary"
            title="Download JSON Backup"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.825rem' }}
          >
            JSON
          </button>

          <button 
            onClick={onImport}
            className="btn-secondary"
            title="Import Backup Data"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.825rem' }}
          >
            <Upload size={13} />
          </button>

          <button 
            onClick={onReset}
            className="btn-secondary"
            title="Reset to Defaults"
            style={{ padding: '0.55rem 0.75rem', color: '#94a3b8' }}
          >
            <RotateCcw size={13} />
          </button>
        </div>

      </div>
    </header>
  );
};
