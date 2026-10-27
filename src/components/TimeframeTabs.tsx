import React from 'react';
import { Sun, Calendar, CalendarDays, TrendingUp } from 'lucide-react';

interface TimeframeTabsProps {
  activePeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onChange: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

export const TimeframeTabs: React.FC<TimeframeTabsProps> = ({ activePeriod, onChange }) => {
  const tabs = [
    { id: 'daily', label: 'Daily Breakdown', icon: Sun, subtitle: 'Per-Day Inflow & Net' },
    { id: 'weekly', label: 'Weekly Flow', icon: Calendar, subtitle: 'Includes Tuesday Vtion' },
    { id: 'monthly', label: 'Monthly Overview', icon: CalendarDays, subtitle: 'Job Payday & Totals' },
    { id: 'yearly', label: 'Yearly & Wealth', icon: TrendingUp, subtitle: 'Annual Power & Growth' },
  ] as const;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '0.85rem',
      marginBottom: '1.75rem',
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePeriod === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.95rem 1.25rem',
              borderRadius: '16px',
              border: isActive 
                ? '1px solid rgba(56, 189, 248, 0.45)' 
                : '1px solid rgba(255, 255, 255, 0.07)',
              background: isActive 
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.25) 0%, rgba(15, 23, 42, 0.85) 100%)' 
                : 'rgba(15, 23, 42, 0.6)',
              boxShadow: isActive ? '0 8px 24px rgba(2, 132, 199, 0.2)' : 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              color: isActive ? '#38bdf8' : '#94a3b8',
              flexShrink: 0,
            }}>
              <Icon size={20} />
            </div>

            <div>
              <div style={{
                fontWeight: 700,
                fontSize: '0.975rem',
                color: isActive ? '#ffffff' : '#cbd5e1',
              }}>
                {tab.label}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: isActive ? '#7dd3fc' : '#64748b',
                marginTop: '0.1rem',
              }}>
                {tab.subtitle}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
