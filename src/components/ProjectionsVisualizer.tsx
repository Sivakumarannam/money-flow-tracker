import React from 'react';
import type { TimeframeSummary } from '../types';
import { formatINR } from '../utils/calculations';
import { PieChart, BarChart3 } from 'lucide-react';

interface ProjectionsVisualizerProps {
  summary: TimeframeSummary;
}

export const ProjectionsVisualizer: React.FC<ProjectionsVisualizerProps> = ({ summary }) => {
  const totalInflow = Math.max(1, summary.totalIncomeRupees);

  const jobPct = Math.round((summary.jobIncomeRupees / totalInflow) * 100);
  const rewardsPct = Math.max(0, 100 - jobPct);

  // Expense breakdown percentages
  const expensePct = Math.round((summary.totalExpenseRupees / totalInflow) * 100);
  const invPct = Math.round((summary.investmentContributionRupees / totalInflow) * 100);
  const surplusPct = Math.max(0, 100 - expensePct - invPct);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2.5rem',
    }}>
      {/* 1. Cashflow Allocation Visualizer */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <BarChart3 size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>
              Where Does Every Rupee Go?
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {summary.period.toUpperCase()} Cashflow Allocation
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div style={{
          height: '22px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '1rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          <div
            title={`Living Expenses: ${expensePct}%`}
            style={{
              width: `${Math.min(100, expensePct)}%`,
              background: 'linear-gradient(90deg, #f43f5e, #fb7185)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            title={`Investments: ${invPct}%`}
            style={{
              width: `${Math.min(100, invPct)}%`,
              background: 'linear-gradient(90deg, #9333ea, #c084fc)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            title={`Free Savings: ${surplusPct}%`}
            style={{
              width: `${Math.min(100, surplusPct)}%`,
              background: 'linear-gradient(90deg, #059669, #34d399)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.08)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
            <span style={{ fontSize: '0.7rem', color: '#fca5a5', display: 'block' }}>Spent ({expensePct}%)</span>
            <strong style={{ color: '#f87171', fontSize: '0.9rem' }}>{formatINR(summary.totalExpenseRupees)}</strong>
          </div>
          <div style={{ background: 'rgba(168, 85, 247, 0.08)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <span style={{ fontSize: '0.7rem', color: '#d8b4fe', display: 'block' }}>Invested ({invPct}%)</span>
            <strong style={{ color: '#c084fc', fontSize: '0.9rem' }}>{formatINR(summary.investmentContributionRupees)}</strong>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7', display: 'block' }}>Surplus ({surplusPct}%)</span>
            <strong style={{ color: '#34d399', fontSize: '0.9rem' }}>{formatINR(summary.netSavingsRupees)}</strong>
          </div>
        </div>
      </div>

      {/* 2. Income Diversification Engine */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PieChart size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>
              Income Sources & Passive Apps
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Active vs Passive Reward Streams
            </span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div style={{
          height: '22px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '1rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          <div
            title={`Primary Job: ${jobPct}%`}
            style={{
              width: `${jobPct}%`,
              background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            title={`Reward Apps: ${rewardsPct}%`}
            style={{
              width: `${rewardsPct}%`,
              background: 'linear-gradient(90deg, #059669, #34d399)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.08)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <span style={{ fontSize: '0.72rem', color: '#7dd3fc', display: 'block' }}>Primary Job Career</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.1rem' }}>
              {formatINR(summary.jobIncomeRupees)}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{jobPct}% of total income</span>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <span style={{ fontSize: '0.72rem', color: '#6ee7b7', display: 'block' }}>Passive Apps Yield</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', marginTop: '0.1rem' }}>
              {formatINR(summary.rewardIncomeRupees)}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              {summary.totalRewardPoints.toLocaleString()} points earned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
