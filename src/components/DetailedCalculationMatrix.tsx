import React from 'react';
import type { AppState } from '../types';
import { calculateRewardAppYield, formatINR, getTimeframeSummary } from '../utils/calculations';

interface DetailedCalculationMatrixProps {
  state: AppState;
}

export const DetailedCalculationMatrix: React.FC<DetailedCalculationMatrixProps> = ({ state }) => {
  const dailySummary = getTimeframeSummary(state, 'daily');
  const weeklySummary = getTimeframeSummary(state, 'weekly');
  const monthlySummary = getTimeframeSummary(state, 'monthly');
  const yearlySummary = getTimeframeSummary(state, 'yearly');

  const enabledApps = state.rewardApps.filter((a) => a.enabled);

  return (
    <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: 0 }}>
              Master Cashflow & Projections Matrix
            </h2>
            <span className="badge badge-cyan">
              All 4 Timeframes Side-by-Side
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Compare daily daily earnings, weekly Tuesday cycles, monthly salary, and full yearly compounding
          </p>
        </div>
      </div>

      {/* Overflow wrapper for mobile responsiveness */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0',
          fontSize: '0.875rem',
          textAlign: 'left',
        }}>
          <thead>
            <tr style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
              <th style={{ padding: '0.9rem 1.1rem', color: '#94a3b8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px 0 0 0', minWidth: '220px' }}>
                Income & Outflow Streams
              </th>
              <th style={{ padding: '0.9rem 1rem', color: '#38bdf8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', minWidth: '130px', textAlign: 'right' }}>
                🌞 Daily (1 Day)
              </th>
              <th style={{ padding: '0.9rem 1rem', color: '#38bdf8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', minWidth: '130px', textAlign: 'right' }}>
                📅 Weekly (7 Days)
              </th>
              <th style={{ padding: '0.9rem 1rem', color: '#38bdf8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', minWidth: '140px', textAlign: 'right' }}>
                📊 Monthly (Avg 30d)
              </th>
              <th style={{ padding: '0.9rem 1.1rem', color: '#34d399', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0 12px 0 0', minWidth: '150px', textAlign: 'right' }}>
                🚀 Yearly (365 Days)
              </th>
            </tr>
          </thead>
          <tbody>
            
            {/* --- SECTION 1: REWARD APPS --- */}
            <tr style={{ background: 'rgba(56, 189, 248, 0.05)' }}>
              <td colSpan={5} style={{ padding: '0.65rem 1.1rem', fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🪙 Reward Apps & Passive Stream Yields
              </td>
            </tr>

            {enabledApps.map((app) => {
              const yields = calculateRewardAppYield(app);
              const isVtion = app.id === 'vtion-digital';
              const isNielsen = app.id === 'nielsen-more';

              return (
                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '0.75rem 1.1rem', color: '#e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: app.accentColor,
                        display: 'inline-block',
                      }} />
                      <strong>{app.name}</strong>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {isNielsen && '(50 pts/day)'}
                        {isVtion && '(10 pts on Tue, 1pt=₹1)'}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#f1f5f9' }}>
                    <div>{formatINR(yields.daily.rupees, true)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{Math.round(yields.daily.points * 10) / 10} pts</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#f1f5f9' }}>
                    <div>{formatINR(yields.weekly.rupees, true)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{Math.round(yields.weekly.points)} pts</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#f1f5f9' }}>
                    <div>{formatINR(yields.monthly.rupees, true)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{Math.round(yields.monthly.points)} pts</div>
                  </td>
                  <td style={{ padding: '0.75rem 1.1rem', textAlign: 'right', color: '#34d399', fontWeight: 600 }}>
                    <div>{formatINR(yields.yearly.rupees)}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>{Math.round(yields.yearly.points).toLocaleString()} pts</div>
                  </td>
                </tr>
              );
            })}

            {/* Total Reward Row */}
            <tr style={{ background: 'rgba(16, 185, 129, 0.08)', fontWeight: 700 }}>
              <td style={{ padding: '0.75rem 1.1rem', color: '#34d399' }}>
                Total Apps Revenue
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#34d399' }}>
                {formatINR(dailySummary.rewardIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#34d399' }}>
                {formatINR(weeklySummary.rewardIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#34d399' }}>
                {formatINR(monthlySummary.rewardIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1.1rem', textAlign: 'right', color: '#34d399', fontSize: '1rem' }}>
                {formatINR(yearlySummary.rewardIncomeRupees)}
              </td>
            </tr>

            {/* --- SECTION 2: JOB SALARY --- */}
            <tr style={{ background: 'rgba(56, 189, 248, 0.05)' }}>
              <td colSpan={5} style={{ padding: '0.65rem 1.1rem', fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                💼 Career & Employment
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '0.75rem 1.1rem', color: '#e2e8f0' }}>
                <strong>{state.jobIncome.jobTitle}</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Base Salary + Bonus</div>
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#f1f5f9' }}>
                {formatINR(dailySummary.jobIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#f1f5f9' }}>
                {formatINR(weeklySummary.jobIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#f1f5f9' }}>
                {formatINR(monthlySummary.jobIncomeRupees)}
              </td>
              <td style={{ padding: '0.75rem 1.1rem', textAlign: 'right', color: '#f1f5f9', fontWeight: 700 }}>
                {formatINR(yearlySummary.jobIncomeRupees)}
              </td>
            </tr>

            {/* Total Gross Income */}
            <tr style={{ background: 'rgba(56, 189, 248, 0.12)', fontWeight: 800 }}>
              <td style={{ padding: '0.85rem 1.1rem', color: '#38bdf8', fontSize: '0.95rem' }}>
                🔥 TOTAL GROSS INFLOW
              </td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#38bdf8' }}>
                {formatINR(dailySummary.totalIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#38bdf8' }}>
                {formatINR(weeklySummary.totalIncomeRupees, true)}
              </td>
              <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#38bdf8' }}>
                {formatINR(monthlySummary.totalIncomeRupees)}
              </td>
              <td style={{ padding: '0.85rem 1.1rem', textAlign: 'right', color: '#38bdf8', fontSize: '1.05rem' }}>
                {formatINR(yearlySummary.totalIncomeRupees)}
              </td>
            </tr>

            {/* --- SECTION 3: EXPENSES & OUTFLOWS --- */}
            <tr style={{ background: 'rgba(244, 63, 94, 0.05)' }}>
              <td colSpan={5} style={{ padding: '0.65rem 1.1rem', fontSize: '0.78rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                🔻 Living Costs & Total Expenses
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '0.75rem 1.1rem', color: '#e2e8f0' }}>
                <strong>All Living Expenses</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {state.expenses.length} tracked items (Food, Rent, Bills, Travel...)
                </div>
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#fca5a5' }}>
                -{formatINR(dailySummary.totalExpenseRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#fca5a5' }}>
                -{formatINR(weeklySummary.totalExpenseRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#fca5a5' }}>
                -{formatINR(monthlySummary.totalExpenseRupees)}
              </td>
              <td style={{ padding: '0.75rem 1.1rem', textAlign: 'right', color: '#fca5a5', fontWeight: 700 }}>
                -{formatINR(yearlySummary.totalExpenseRupees)}
              </td>
            </tr>

            {/* --- SECTION 4: INVESTMENTS --- */}
            <tr style={{ background: 'rgba(168, 85, 247, 0.05)' }}>
              <td colSpan={5} style={{ padding: '0.65rem 1.1rem', fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                📈 Investments & Wealth Building
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
              <td style={{ padding: '0.75rem 1.1rem', color: '#e2e8f0' }}>
                <strong>SIP & Liquid Savings Contribution</strong>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {state.investments.length} portfolios compounding for your future
                </div>
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#d8b4fe' }}>
                {formatINR(dailySummary.investmentContributionRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#d8b4fe' }}>
                {formatINR(weeklySummary.investmentContributionRupees, true)}
              </td>
              <td style={{ padding: '0.75rem 1rem', textAlign: 'right', color: '#d8b4fe' }}>
                {formatINR(monthlySummary.investmentContributionRupees)}
              </td>
              <td style={{ padding: '0.75rem 1.1rem', textAlign: 'right', color: '#d8b4fe', fontWeight: 700 }}>
                {formatINR(yearlySummary.investmentContributionRupees)}
              </td>
            </tr>

            {/* --- FINAL NET SURPLUS ROW --- */}
            <tr style={{
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 78, 59, 0.25) 100%)',
              fontWeight: 800,
            }}>
              <td style={{ padding: '1rem 1.1rem', color: '#34d399', fontSize: '1rem', borderRadius: '0 0 0 12px' }}>
                🎯 NET FREE SURPLUS (SAVINGS)
                <div style={{ fontSize: '0.72rem', color: '#6ee7b7', fontWeight: 500 }}>
                  After all expenses & investments are paid
                </div>
              </td>
              <td style={{ padding: '1rem 1rem', textAlign: 'right', color: '#34d399', fontSize: '1rem' }}>
                {formatINR(dailySummary.netSavingsRupees, true)}
              </td>
              <td style={{ padding: '1rem 1rem', textAlign: 'right', color: '#34d399', fontSize: '1rem' }}>
                {formatINR(weeklySummary.netSavingsRupees, true)}
              </td>
              <td style={{ padding: '1rem 1rem', textAlign: 'right', color: '#34d399', fontSize: '1.05rem' }}>
                {formatINR(monthlySummary.netSavingsRupees)}
              </td>
              <td style={{ padding: '1rem 1.1rem', textAlign: 'right', color: '#34d399', fontSize: '1.2rem', borderRadius: '0 0 12px 0' }}>
                {formatINR(yearlySummary.netSavingsRupees)}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </section>
  );
};
