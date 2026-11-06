import React, { useState } from 'react';
import type { AppState, DailyClaimLog, RewardApp } from '../types';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatINR } from '../utils/calculations';

interface AttendanceCalendarProps {
  state: AppState;
  onToggleClaimDate: (dateStr: string, app: RewardApp) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  state,
  onToggleClaimDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0=Sunday, 1=Monday...

  const todayStr = new Date().toISOString().split('T')[0];

  // Map of claims by date
  const claimsByDate: { [date: string]: DailyClaimLog[] } = {};
  state.claimLogs.forEach((log) => {
    if (!claimsByDate[log.date]) {
      claimsByDate[log.date] = [];
    }
    claimsByDate[log.date].push(log);
  });

  // Calculate monthly stats
  let monthPoints = 0;
  let monthRupees = 0;
  let daysClaimedCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const padDay = String(day).padStart(2, '0');
    const padMonth = String(month + 1).padStart(2, '0');
    const dateKey = `${year}-${padMonth}-${padDay}`;
    const dayClaims = claimsByDate[dateKey] || [];
    if (dayClaims.length > 0) {
      daysClaimedCount++;
      dayClaims.forEach((c) => {
        monthPoints += c.points;
        monthRupees += c.rupees;
      });
    }
  }

  const nielsen = state.rewardApps.find((a) => a.id === 'nielsen-more');
  const vtion = state.rewardApps.find((a) => a.id === 'vtion-digital');

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className="card mb-10" style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
          }}>
            <CalendarIcon size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
              Reward Streak & Attendance Calendar
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
              Track daily Nielsen 50-point check-ins & Tuesday Vtion credit streaks
            </p>
          </div>
        </div>

        {/* Month Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={prevMonth} className="btn-secondary" style={{ padding: '0.4rem 0.65rem' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', minWidth: '130px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="btn-secondary" style={{ padding: '0.4rem 0.65rem' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Month Stats Ribbon */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Check-in Attendance</span>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.1rem' }}>
            {daysClaimedCount} / {daysInMonth} Days
          </div>
          <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
            {Math.round((daysClaimedCount / daysInMonth) * 100)}% monthly consistency
          </span>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem 1rem', borderRadius: '12px' }}>
          <span style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase' }}>Points Collected This Month</span>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399', marginTop: '0.1rem' }}>
            {monthPoints.toLocaleString()} Pts
          </div>
          <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>
            ≈ {formatINR(monthRupees, true)} earned
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '16px',
        padding: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        {/* Day of Week Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '0.65rem', textAlign: 'center' }}>
          {dayLabels.map((lbl, idx) => (
            <div
              key={lbl}
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: idx === 2 ? '#34d399' : '#94a3b8',
                padding: '0.35rem',
              }}
            >
              {lbl} {idx === 2 && '🌟'}
            </div>
          ))}
        </div>

        {/* Days Cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: '70px', opacity: 0.15 }} />
          ))}

          {/* Month Day Cells */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const padDay = String(dayNum).padStart(2, '0');
            const padMonth = String(month + 1).padStart(2, '0');
            const dateKey = `${year}-${padMonth}-${padDay}`;
            const dayOfWeek = new Date(year, month, dayNum).getDay();
            const isTue = dayOfWeek === 2;
            const isToday = dateKey === todayStr;

            const dayClaims = claimsByDate[dateKey] || [];
            const hasNielsen = dayClaims.some((c) => c.appId === 'nielsen-more');
            const hasVtion = dayClaims.some((c) => c.appId === 'vtion-digital');

            return (
              <div
                key={dateKey}
                style={{
                  height: '76px',
                  borderRadius: '10px',
                  background: isToday
                    ? 'rgba(56, 189, 248, 0.12)'
                    : dayClaims.length > 0
                    ? 'rgba(15, 23, 42, 0.85)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isToday
                    ? '1px solid #38bdf8'
                    : isTue
                    ? '1px solid rgba(16, 185, 129, 0.35)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                  padding: '0.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Date Number & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: isToday ? 800 : 600,
                    color: isToday ? '#38bdf8' : isTue ? '#34d399' : '#cbd5e1',
                  }}>
                    {dayNum}
                  </span>
                  {isTue && (
                    <span style={{ fontSize: '0.62rem', color: '#34d399', fontWeight: 600 }}>
                      Tue
                    </span>
                  )}
                </div>

                {/* Claim Badges or Quick Click */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {hasNielsen && (
                    <span style={{
                      fontSize: '0.62rem',
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      borderRadius: '4px',
                      padding: '1px 3px',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}>
                      +50 Pts
                    </span>
                  )}

                  {hasVtion && (
                    <span style={{
                      fontSize: '0.62rem',
                      background: 'rgba(16, 185, 129, 0.25)',
                      color: '#34d399',
                      borderRadius: '4px',
                      padding: '1px 3px',
                      fontWeight: 600,
                      textAlign: 'center',
                    }}>
                      Vtion ₹10
                    </span>
                  )}

                  {dayClaims.length === 0 && (
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                      <button
                        onClick={() => nielsen && onToggleClaimDate(dateKey, nielsen)}
                        title="Log Nielsen 50 pts"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#475569',
                          fontSize: '0.62rem',
                          cursor: 'pointer',
                          padding: '1px 2px',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
                      >
                        +Nielsen
                      </button>
                      {isTue && vtion && (
                        <button
                          onClick={() => onToggleClaimDate(dateKey, vtion)}
                          title="Log Vtion 10 pts (₹10)"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#059669',
                            fontSize: '0.62rem',
                            cursor: 'pointer',
                            padding: '1px 2px',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#34d399')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#059669')}
                        >
                          +Vtion
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
