import type { AppState } from '../types';
import { calculateRewardAppYield, getTimeframeSummary, normalizeExpense } from './calculations';

export function exportFullDataCsv(state: AppState) {
  const daily = getTimeframeSummary(state, 'daily');
  const weekly = getTimeframeSummary(state, 'weekly');
  const monthly = getTimeframeSummary(state, 'monthly');
  const yearly = getTimeframeSummary(state, 'yearly');

  const rows: string[][] = [];

  // Title
  rows.push(['MONEYFLOW OS — MASTER FINANCIAL & REWARDS REPORT']);
  rows.push([`Generated on: ${new Date().toLocaleString('en-IN')}`]);
  // BANK & GOLD ASSETS
  if (state.bankAccount) {
    rows.push(['--- LIQUID BANK & GOLD ASSETS ---']);
    rows.push(['Asset', 'Holding / Account', 'Invested ₹', 'Current Value ₹', 'PnL / Growth']);
    rows.push(['Bank Account', state.bankAccount.accountName, String(state.bankAccount.balance), String(state.bankAccount.balance), 'Liquid Cash']);
    if (state.goldHolding) {
      rows.push([state.goldHolding.platform, `${state.goldHolding.grams}g 24K`, String(state.goldHolding.investedAmount), String(state.goldHolding.currentValue), `${state.goldHolding.pnlAmount} (${state.goldHolding.pnlPercentage}%)`]);
    }
    rows.push([]);
  }

  // SECTION 1: MASTER COMPARISON MATRIX
  rows.push(['--- 1. MASTER TIMEFRAME COMPARISON (IN RUPEES ₹) ---']);
  rows.push(['Metric / Stream', 'Daily (1 Day)', 'Weekly (7 Days)', 'Monthly (30 Days)', 'Yearly (365 Days)']);
  rows.push(['Total Gross Inflow', daily.totalIncomeRupees.toFixed(2), weekly.totalIncomeRupees.toFixed(2), monthly.totalIncomeRupees.toFixed(2), yearly.totalIncomeRupees.toFixed(2)]);
  rows.push(['Job Income', daily.jobIncomeRupees.toFixed(2), weekly.jobIncomeRupees.toFixed(2), monthly.jobIncomeRupees.toFixed(2), yearly.jobIncomeRupees.toFixed(2)]);
  rows.push(['Reward Apps Revenue', daily.rewardIncomeRupees.toFixed(2), weekly.rewardIncomeRupees.toFixed(2), monthly.rewardIncomeRupees.toFixed(2), yearly.rewardIncomeRupees.toFixed(2)]);
  rows.push(['Living Expenses', daily.totalExpenseRupees.toFixed(2), weekly.totalExpenseRupees.toFixed(2), monthly.totalExpenseRupees.toFixed(2), yearly.totalExpenseRupees.toFixed(2)]);
  rows.push(['Investment Allocation', daily.investmentContributionRupees.toFixed(2), weekly.investmentContributionRupees.toFixed(2), monthly.investmentContributionRupees.toFixed(2), yearly.investmentContributionRupees.toFixed(2)]);
  rows.push(['Net Free Surplus / Savings', daily.netSavingsRupees.toFixed(2), weekly.netSavingsRupees.toFixed(2), monthly.netSavingsRupees.toFixed(2), yearly.netSavingsRupees.toFixed(2)]);
  rows.push([]);

  // SECTION 2: REWARD APPS DETAILED
  rows.push(['--- 2. REWARD APPS BREAKDOWN ---']);
  rows.push(['App Name', 'Cycle Frequency', 'Points/Cycle', 'Conversion Ratio', 'Daily ₹', 'Weekly ₹', 'Monthly ₹', 'Yearly ₹', 'Yearly Points']);
  state.rewardApps.forEach((app) => {
    const yields = calculateRewardAppYield(app);
    rows.push([
      app.name,
      app.frequency,
      String(app.pointsPerCycle),
      `${app.pointConversionFormula.points} pts = ₹${app.pointConversionFormula.rupees} (₹${app.pointToRupeeRatio.toFixed(3)}/pt)`,
      yields.daily.rupees.toFixed(2),
      yields.weekly.rupees.toFixed(2),
      yields.monthly.rupees.toFixed(2),
      yields.yearly.rupees.toFixed(2),
      String(Math.round(yields.yearly.points)),
    ]);
  });
  rows.push([]);

  // SECTION 3: LIVING EXPENSES
  rows.push(['--- 3. LIVING EXPENSES ---']);
  rows.push(['Expense Title', 'Category', 'Base Amount', 'Base Frequency', 'Daily ₹', 'Monthly ₹', 'Yearly ₹']);
  state.expenses.forEach((exp) => {
    const norm = normalizeExpense(exp.amount, exp.frequency);
    rows.push([
      exp.title,
      exp.category,
      String(exp.amount),
      exp.frequency,
      norm.daily.toFixed(2),
      norm.monthly.toFixed(2),
      norm.yearly.toFixed(2),
    ]);
  });
  rows.push([]);

  // SECTION 4: INVESTMENTS
  rows.push(['--- 4. INVESTMENTS & SIP PORTFOLIO ---']);
  rows.push(['Investment Name', 'Category', 'Monthly Deposit ₹', 'Current Value ₹', 'Expected Return (% p.a.)']);
  state.investments.forEach((inv) => {
    rows.push([
      inv.title,
      inv.category,
      String(inv.monthlyAmount),
      String(inv.currentValue),
      `${inv.expectedAnnualReturn}%`,
    ]);
  });
  rows.push([]);

  // SECTION 5: MANUAL TRANSACTIONS (ADDED & DEBITED)
  if (state.manualTransactions && state.manualTransactions.length > 0) {
    rows.push(['--- 5. MANUAL MONEY TRANSACTIONS (ADDED & DEBITED) ---']);
    rows.push(['Date', 'Type (Credit / Debit)', 'Category', 'Amount ₹', 'Notes']);
    state.manualTransactions.forEach((tx) => {
      rows.push([
        tx.date,
        tx.type === 'credit' ? 'Money Added (+)' : 'Money Debited (-)',
        tx.category,
        String(tx.amount),
        tx.notes || '-',
      ]);
    });
    rows.push([]);
  }

  // SECTION 6: REDEMPTIONS
  if (state.redemptions && state.redemptions.length > 0) {
    rows.push(['--- 6. REDEMPTION & CASHOUT HISTORY ---']);
    rows.push(['Date', 'App', 'Points Redeemed', 'Cash Received ₹', 'Payout Method', 'Notes']);
    state.redemptions.forEach((red) => {
      rows.push([
        red.date,
        red.appName,
        String(red.pointsRedeemed),
        String(red.cashValueRupees),
        red.method,
        red.notes || '-',
      ]);
    });
    rows.push([]);
  }

  // Convert to CSV string with escaping
  const csvContent = rows
    .map((row) =>
      row
        .map((cell) => {
          const str = String(cell ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(',')
    )
    .join('\r\n');

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `moneyflow-report-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
