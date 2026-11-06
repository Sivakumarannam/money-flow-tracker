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

  const isPositive = summary.netSavingsRupees >= 0;

  return (
    <div className="grid-metrics">

      {/* ── 1. Total Income ─────────────────────────── */}
      <div className="card card-accent-blue metric-card">
        <div className="flex justify-between items-start">
          <div>
            <div className="metric-card-label">{periodLabel} Total Income</div>
            <div className="metric-card-value text-primary">
              {formatINR(summary.totalIncomeRupees, true)}
            </div>
          </div>
          <div
            className="metric-card-icon-box"
            style={{
              background: 'var(--blue-glow)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: 'var(--blue-light)',
            }}
          >
            <ArrowUpRight size={22} />
          </div>
        </div>
        <div className="metric-card-stat-row">
          <span>
            Job:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>
              {formatINR(summary.jobIncomeRupees)}
            </strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>
            Apps:{' '}
            <strong style={{ color: 'var(--blue-light)' }}>
              {formatINR(summary.rewardIncomeRupees)}
            </strong>
          </span>
        </div>
      </div>

      {/* ── 2. Rewards App Yield ─────────────────────── */}
      <div className="card card-accent-green metric-card">
        <div className="flex justify-between items-start">
          <div>
            <div className="metric-card-label">{periodLabel} Rewards</div>
            <div className="metric-card-value" style={{ color: 'var(--green-light)' }}>
              {formatINR(summary.rewardIncomeRupees, true)}
            </div>
          </div>
          <div
            className="metric-card-icon-box"
            style={{
              background: 'var(--green-glow)',
              border: '1px solid rgba(34,197,94,0.3)',
              color: 'var(--green-light)',
            }}
          >
            <Award size={22} />
          </div>
        </div>
        <div className="metric-card-stat-row">
          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
            <Sparkles size={10} /> {summary.totalRewardPoints.toLocaleString()} Points
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--green-light)' }}>
            Nielsen + Vtion
          </span>
        </div>
      </div>

      {/* ── 3. Total Outflow ─────────────────────────── */}
      <div className="card card-accent-rose metric-card">
        <div className="flex justify-between items-start">
          <div>
            <div className="metric-card-label">{periodLabel} Outflow</div>
            <div className="metric-card-value" style={{ color: 'var(--rose-light)' }}>
              {formatINR(summary.totalExpenseRupees + summary.investmentContributionRupees, true)}
            </div>
          </div>
          <div
            className="metric-card-icon-box"
            style={{
              background: 'var(--rose-glow)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: 'var(--rose-light)',
            }}
          >
            <ArrowDownRight size={22} />
          </div>
        </div>
        <div className="metric-card-stat-row">
          <span>
            Spend:{' '}
            <strong style={{ color: '#fca5a5' }}>
              {formatINR(summary.totalExpenseRupees)}
            </strong>
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>
            Invest:{' '}
            <strong style={{ color: 'var(--purple-light)' }}>
              {formatINR(summary.investmentContributionRupees)}
            </strong>
          </span>
        </div>
      </div>

      {/* ── 4. Net Surplus ───────────────────────────── */}
      <div
        className="card card-accent-purple metric-card"
        style={{
          background: isPositive
            ? 'linear-gradient(145deg, rgba(34,197,94,0.07) 0%, var(--bg-card) 60%)'
            : 'linear-gradient(145deg, rgba(239,68,68,0.07) 0%, var(--bg-card) 60%)',
        }}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="metric-card-label">{periodLabel} Net Surplus</div>
            <div
              className="metric-card-value"
              style={{ color: isPositive ? 'var(--green-light)' : 'var(--rose-light)' }}
            >
              {formatINR(summary.netSavingsRupees, true)}
            </div>
          </div>
          <div
            className="metric-card-icon-box"
            style={{
              background: 'var(--purple-glow)',
              border: '1px solid rgba(139,92,246,0.3)',
              color: 'var(--purple-light)',
            }}
          >
            <PiggyBank size={22} />
          </div>
        </div>
        <div className="metric-card-stat-row">
          <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
            Savings Rate: {summary.savingsRatePercent}%
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
            Free cash left
          </span>
        </div>
      </div>

    </div>
  );
};
