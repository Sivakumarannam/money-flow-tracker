import type { AppState, ExpenseFrequency, RewardApp, TimeframeSummary } from '../types';

/**
 * Normalizes an expense amount to daily, weekly, monthly, and yearly
 */
export function normalizeExpense(amount: number, freq: ExpenseFrequency) {
  let yearly = 0;
  switch (freq) {
    case 'daily':
      yearly = amount * 365;
      break;
    case 'weekly':
      yearly = amount * 52;
      break;
    case 'monthly':
      yearly = amount * 12;
      break;
    case 'yearly':
      yearly = amount;
      break;
  }
  return {
    daily: yearly / 365,
    weekly: yearly / 52,
    monthly: yearly / 12,
    yearly: yearly,
  };
}

/**
 * Calculates reward points and cash value for a reward app across timeframes
 */
export function calculateRewardAppYield(app: RewardApp) {
  if (!app.enabled) {
    return {
      daily: { points: 0, rupees: 0 },
      weekly: { points: 0, rupees: 0 },
      monthly: { points: 0, rupees: 0 },
      yearly: { points: 0, rupees: 0 },
    };
  }

  const ratio = app.pointToRupeeRatio;
  let yearlyPoints = 0;

  switch (app.frequency) {
    case 'daily':
      yearlyPoints = app.pointsPerCycle * 365;
      break;
    case 'weekly':
      yearlyPoints = app.pointsPerCycle * 52;
      break;
    case 'monthly':
      yearlyPoints = app.pointsPerCycle * 12;
      break;
    case 'custom':
      yearlyPoints = app.pointsPerCycle * 52; // Default to weekly cycle
      break;
  }

  const yearlyRupees = yearlyPoints * ratio;

  return {
    daily: {
      points: yearlyPoints / 365,
      rupees: yearlyRupees / 365,
    },
    weekly: {
      points: yearlyPoints / 52,
      rupees: yearlyRupees / 52,
    },
    monthly: {
      points: yearlyPoints / 12,
      rupees: yearlyRupees / 12,
    },
    yearly: {
      points: yearlyPoints,
      rupees: yearlyRupees,
    },
  };
}

/**
 * Generates timeframe summary (daily, weekly, monthly, yearly)
 */
export function getTimeframeSummary(state: AppState, period: 'daily' | 'weekly' | 'monthly' | 'yearly'): TimeframeSummary {
  const pointsMap: { [appId: string]: number } = {};
  const breakdown: { appId: string; appName: string; points: number; rupees: number }[] = [];
  let totalRewardPoints = 0;
  let totalRewardRupees = 0;

  state.rewardApps.forEach((app) => {
    if (app.enabled) {
      const yields = calculateRewardAppYield(app)[period];
      pointsMap[app.id] = yields.points;
      totalRewardPoints += yields.points;
      totalRewardRupees += yields.rupees;

      breakdown.push({
        appId: app.id,
        appName: app.name,
        points: Math.round(yields.points * 10) / 10,
        rupees: Math.round(yields.rupees * 100) / 100,
      });
    }
  });

  // Job Income
  const jobActive = state.jobIncome.enabled;
  const baseMonthly = jobActive ? state.jobIncome.monthlySalary + (state.jobIncome.monthlyBonus || 0) : 0;
  const yearlyJob = baseMonthly * 12;

  let jobIncomeRupees = 0;
  if (period === 'daily') jobIncomeRupees = yearlyJob / 365;
  else if (period === 'weekly') jobIncomeRupees = yearlyJob / 52;
  else if (period === 'monthly') jobIncomeRupees = baseMonthly;
  else jobIncomeRupees = yearlyJob;

  // Expenses
  let totalExpenseRupees = 0;
  state.expenses.forEach((item) => {
    const norm = normalizeExpense(item.amount, item.frequency);
    totalExpenseRupees += norm[period];
  });

  // Investments
  const monthlyInv = state.investments.reduce((sum, inv) => sum + inv.monthlyAmount, 0);
  const yearlyInv = monthlyInv * 12;
  let investmentContributionRupees = 0;
  if (period === 'daily') investmentContributionRupees = yearlyInv / 365;
  else if (period === 'weekly') investmentContributionRupees = yearlyInv / 52;
  else if (period === 'monthly') investmentContributionRupees = monthlyInv;
  else investmentContributionRupees = yearlyInv;

  const totalIncomeRupees = totalRewardRupees + jobIncomeRupees;
  const netSavingsRupees = totalIncomeRupees - totalExpenseRupees - investmentContributionRupees;
  const savingsRatePercent = totalIncomeRupees > 0 
    ? Math.max(0, Math.min(100, ((totalIncomeRupees - totalExpenseRupees) / totalIncomeRupees) * 100))
    : 0;

  return {
    period,
    rewardPoints: pointsMap,
    totalRewardPoints: Math.round(totalRewardPoints),
    rewardIncomeRupees: Math.round(totalRewardRupees * 100) / 100,
    rewardBreakdown: breakdown,
    jobIncomeRupees: Math.round(jobIncomeRupees * 100) / 100,
    totalIncomeRupees: Math.round(totalIncomeRupees * 100) / 100,
    totalExpenseRupees: Math.round(totalExpenseRupees * 100) / 100,
    investmentContributionRupees: Math.round(investmentContributionRupees * 100) / 100,
    netSavingsRupees: Math.round(netSavingsRupees * 100) / 100,
    savingsRatePercent: Math.round(savingsRatePercent * 10) / 10,
  };
}

/**
 * Calculates compound future wealth projection for investments
 */
export function projectFutureWealth(currentVal: number, monthlyDeposit: number, annualReturnPct: number, years: number) {
  const r = annualReturnPct / 100 / 12;
  const n = years * 12;
  
  // Future value of existing lumpsum
  const lumpsumFV = currentVal * Math.pow(1 + r, n);
  
  // Future value of series of monthly deposits
  let sipFV = 0;
  if (r > 0) {
    sipFV = monthlyDeposit * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  } else {
    sipFV = monthlyDeposit * n;
  }
  
  const totalWealth = lumpsumFV + sipFV;
  const totalInvested = currentVal + (monthlyDeposit * n);
  const totalGains = Math.max(0, totalWealth - totalInvested);

  return {
    years,
    totalWealth: Math.round(totalWealth),
    totalInvested: Math.round(totalInvested),
    totalGains: Math.round(totalGains),
  };
}

/**
 * Format currency with Indian grouping (e.g. ₹1,50,000)
 */
export function formatINR(val: number, includeDecimals = false): string {
  if (isNaN(val)) return '₹0';
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  
  const formatted = absVal.toLocaleString('en-IN', {
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
}
