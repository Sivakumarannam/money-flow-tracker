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
      <div className="card card-blue" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div className="section-icon section-icon-blue" style={{ width: 36, height: 36 }}>
            <BarChart3 size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#f8fbff', margin: 0 }}>
              Where Does Every Rupee Go?
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#a5b4d4' }}>
              {summary.period.toUpperCase()} Cashflow Allocation
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div style={{
          height: '22px',
          borderRadius: '999px',
          background: 'rgba(255,255,255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '1rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          <div
            title={`Living Expenses: ${expensePct}%`}
            style={{
              width: `${Math.min(100, expensePct)}%`,
              background: 'linear-gradient(90deg, #ff3d7f, #ff7aa8)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            title={`Investments: ${invPct}%`}
            style={{
              width: `${Math.min(100, invPct)}%`,
              background: 'linear-gradient(90deg, #9333ea, #c4b5fd)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            title={`Free Savings: ${surplusPct}%`}
            style={{
              width: `${Math.min(100, surplusPct)}%`,
              background: 'linear-gradient(90deg, #0fb98a, #34f5c5)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        {/* Legend */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,61,127, 0.08)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(255,61,127, 0.2)' }}>
            <span style={{ fontSize: '0.7rem', color: '#ffb3cc', display: 'block' }}>Spent ({expensePct}%)</span>
            <strong style={{ color: '#ff6b9a', fontSize: '0.9rem' }}>{formatINR(summary.totalExpenseRupees)}</strong>
          </div>
          <div style={{ background: 'rgba(167,139,250, 0.08)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(167,139,250, 0.2)' }}>
            <span style={{ fontSize: '0.7rem', color: '#ddd6fe', display: 'block' }}>Invested ({invPct}%)</span>
            <strong style={{ color: '#c4b5fd', fontSize: '0.9rem' }}>{formatINR(summary.investmentContributionRupees)}</strong>
          </div>
          <div style={{ background: 'rgba(20,217,160, 0.08)', padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(20,217,160, 0.2)' }}>
            <span style={{ fontSize: '0.7rem', color: '#8bffe0', display: 'block' }}>Surplus ({surplusPct}%)</span>
            <strong style={{ color: '#34f5c5', fontSize: '0.9rem' }}>{formatINR(summary.netSavingsRupees)}</strong>
          </div>
        </div>
      </div>

      {/* 2. Income Diversification Engine */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(20,217,160, 0.15)',
            color: '#34f5c5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PieChart size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', color: '#f8fbff', margin: 0 }}>
              Income Sources & Passive Apps
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#a5b4d4' }}>
              Active vs Passive Reward Streams
            </span>
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div style={{
          height: '22px',
          borderRadius: '999px',
          background: 'rgba(255,255,255, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '1rem',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
        }}>
          <div
            title={`Primary Job: ${jobPct}%`}
            style={{
              width: `${jobPct}%`,
              background: 'linear-gradient(90deg, #0891b2, #22d3ee)',
              transition: 'width 0.4s ease',
            }}
          />
          <div
            title={`Reward Apps: ${rewardsPct}%`}
            style={{
              width: `${rewardsPct}%`,
              background: 'linear-gradient(90deg, #0fb98a, #34f5c5)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(34,211,238, 0.08)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(34,211,238, 0.2)' }}>
            <span style={{ fontSize: '0.72rem', color: '#7dd3fc', display: 'block' }}>Primary Job Career</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#22d3ee', marginTop: '0.1rem' }}>
              {formatINR(summary.jobIncomeRupees)}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#a5b4d4' }}>{jobPct}% of total income</span>
          </div>

          <div style={{ background: 'rgba(20,217,160, 0.08)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(20,217,160, 0.2)' }}>
            <span style={{ fontSize: '0.72rem', color: '#8bffe0', display: 'block' }}>Passive Apps Yield</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34f5c5', marginTop: '0.1rem' }}>
              {formatINR(summary.rewardIncomeRupees)}
            </div>
            <span style={{ fontSize: '0.68rem', color: '#a5b4d4' }}>
              {summary.totalRewardPoints.toLocaleString()} points earned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
