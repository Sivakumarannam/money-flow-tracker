import React from 'react';
import { Sun, Calendar, CalendarDays, TrendingUp } from 'lucide-react';

interface TimeframeTabsProps {
  activePeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onChange: (period: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
}

export const TimeframeTabs: React.FC<TimeframeTabsProps> = ({ activePeriod, onChange }) => {
  const tabs = [
    { id: 'daily',   label: 'Daily',   icon: Sun,         subtitle: 'Per-Day Inflow & Net' },
    { id: 'weekly',  label: 'Weekly',  icon: Calendar,    subtitle: 'Includes Tuesday Vtion' },
    { id: 'monthly', label: 'Monthly', icon: CalendarDays, subtitle: 'Job Payday & Totals' },
    { id: 'yearly',  label: 'Yearly',  icon: TrendingUp,  subtitle: 'Annual Power & Growth' },
  ] as const;

  return (
    <div className="card" style={{ padding: '0.5rem', marginBottom: '1.75rem', borderRadius: '999px' }}>
      <div className="tab-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePeriod === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`tab-btn${isActive ? ' tab-btn-active' : ''}`}
              title={tab.subtitle}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
