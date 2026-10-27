import React from 'react';
import { ArrowDownRight, ArrowUpRight, Award, PiggyBank, Sparkles } from 'lucide-react';
import type { TimeframeSummary } from '../types';
import { formatINR } from '../utils/calculations';

interface MetricCardsProps {
  summary: TimeframeSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  const periodLabel = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Annual',
  }[summary.period];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '1.25rem',
      marginBottom: '1.75rem',
    }}>
      {/* 1. Total Inflow */}
      <div className="glass-panel" style={{ padding: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {periodLabel} Total Income
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
              {formatINR(summary.totalIncomeRupees, true)}
            </div>
          </div>
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
            <ArrowUpRight size={22} />
          </div>
        </div>
        <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Job: <strong style={{ color: '#e2e8f0' }}>{formatINR(summary.jobIncomeRupees)}</strong></span>
          <span>•</span>
          <span>Apps: <strong style={{ color: '#38bdf8' }}>{formatINR(summary.rewardIncomeRupees)}</strong></span>
        </div>
      </div>

      {/* 2. Rewards App Yield */}
      <div className="glass-panel" style={{ padding: '1.4rem', borderLeft: '3px solid #10b981' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {periodLabel} Rewards
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#34d399', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
              {formatINR(summary.rewardIncomeRupees, true)}
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
          }}>
            <Award size={22} />
          </div>
        </div>
        <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
            <Sparkles size={11} /> {summary.totalRewardPoints.toLocaleString()} Points
          </span>
          <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Nielsen + Vtion</span>
        </div>
      </div>

      {/* 3. Expenses */}
      <div className="glass-panel" style={{ padding: '1.4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {periodLabel} Outflow
            </span>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f87171', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>
              {formatINR(summary.totalExpenseRupees + summary.investmentContributionRupees, true)}
            </div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e',
          }}>
            <ArrowDownRight size={22} />
          </div>
        </div>
        <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>Spend: <strong style={{ color: '#fca5a5' }}>{formatINR(summary.totalExpenseRupees)}</strong></span>
          <span>•</span>
          <span>Invest: <strong style={{ color: '#c084fc' }}>{formatINR(summary.investmentContributionRupees)}</strong></span>
        </div>
      </div>

      {/* 4. Net Savings & Rate */}
      <div className="glass-panel" style={{
        padding: '1.4rem',
        background: summary.netSavingsRupees >= 0 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)' 
          : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {periodLabel} Net Surplus
            </span>
            <div style={{
              fontSize: '1.85rem',
              fontWeight: 800,
              color: summary.netSavingsRupees >= 0 ? '#34d399' : '#f87171',
              marginTop: '0.4rem',
              letterSpacing: '-0.02em',
            }}>
              {formatINR(summary.netSavingsRupees, true)}
            </div>
          </div>
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
            <PiggyBank size={22} />
          </div>
        </div>
        <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>
            Savings Rate: {summary.savingsRatePercent}%
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Free cash left</span>
        </div>
      </div>
    </div>
  );
};
