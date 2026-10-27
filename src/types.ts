export type AppFrequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface RewardApp {
  id: string;
  name: string;
  frequency: AppFrequency;
  pointsPerCycle: number;
  dayOfWeek?: number; // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wed, etc.
  pointToRupeeRatio: number; // ₹ earned per 1 point (1100 pts = ₹100 => 0.090909 ₹/pt for Nielsen, 1.0 for Vtion)
  pointConversionFormula: {
    points: number;
    rupees: number;
  };
  currentBalancePoints: number; // e.g. 2450 for Nielsen, 60 for Vtion
  ruleDescription: string;
  accentColor: string;
  badge: string;
  enabled: boolean;
  notes?: string;
}

export interface JobIncome {
  jobTitle: string;
  company?: string;
  monthlySalary: number;
  workDaysPerWeek: number;
  payDay: number; // Day of month
  monthlyBonus: number;
  enabled: boolean;
  notes?: string;
}

export type ExpenseCategory = 
  | 'Food & Groceries'
  | 'Rent & Housing'
  | 'Bills & Utilities'
  | 'Travel & Commute'
  | 'Shopping'
  | 'Entertainment'
  | 'Health & Fitness'
  | 'Miscellaneous';

export type ExpenseFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  frequency: ExpenseFrequency;
  category: ExpenseCategory;
  dateAdded: string;
}

export type InvestmentCategory = 
  | 'Mutual Funds / SIP'
  | 'Stocks & Equity'
  | 'Fixed Deposit / RD'
  | 'Emergency Fund / Savings'
  | 'Gold & Commodities'
  | 'Crypto'
  | 'PPF / EPF';

export interface InvestmentItem {
  id: string;
  title: string;
  category: InvestmentCategory;
  monthlyAmount: number;
  currentValue: number;
  investedAmount?: number;
  expectedAnnualReturn: number; // in percentage e.g. 12 = 12%
  notes?: string;
}

export interface BankAccount {
  accountName: string;
  bankName: string;
  balance: number; // e.g. 1921
  lastUpdated: string;
}

export interface DigitalGoldHolding {
  platform: string; // "Paytm Gold"
  grams: number; // e.g. 0.0017
  investedAmount: number; // e.g. 26.17
  currentValue: number; // e.g. 24.80
  pnlAmount: number; // -1.37
  pnlPercentage: number; // -5.23
  pricePerGram24K: number; // 24.8 / 0.0017 ≈ 14588.24
  liveMarketSimulation: boolean;
  lastUpdated: string;
}

export interface DailyClaimLog {
  id: string;
  date: string; // YYYY-MM-DD
  appId: string;
  appName: string;
  points: number;
  rupees: number;
  timestamp: number;
}

export interface TimeframeSummary {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  rewardPoints: { [appId: string]: number };
  totalRewardPoints: number;
  rewardIncomeRupees: number;
  rewardBreakdown: { appId: string; appName: string; points: number; rupees: number }[];
  jobIncomeRupees: number;
  totalIncomeRupees: number;
  totalExpenseRupees: number;
  investmentContributionRupees: number;
  netSavingsRupees: number;
  savingsRatePercent: number;
}

export interface RedemptionLog {
  id: string;
  appId: string;
  appName: string;
  pointsRedeemed: number;
  cashValueRupees: number;
  method: string; // Amazon Pay, UPI, Bank Transfer, Flipkart, etc.
  date: string; // YYYY-MM-DD
  notes?: string;
  timestamp: number;
}

export interface ManualTransaction {
  id: string;
  type: 'credit' | 'debit'; // 'credit' = added money, 'debit' = debited money
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  notes?: string;
  timestamp: number;
}

export interface CryptoHolding {
  id: string;
  name: string;
  symbol: string;
  platform: 'Binance' | 'Phantom' | 'Sweat Wallet' | 'ZebPay' | 'Other';
  category: 'DePIN' | 'Move-to-Earn' | 'Layer 1' | 'Exchange' | 'Ad Rewards';
  balance: number;
  availableBalance?: number;
  currentPriceInr: number;
  valueInr: number;
  notes?: string;
  lastUpdated: string;
}

export interface AppState {
  rewardApps: RewardApp[];
  jobIncome: JobIncome;
  expenses: ExpenseItem[];
  investments: InvestmentItem[];
  manualTransactions: ManualTransaction[];
  bankAccount: BankAccount;
  goldHolding: DigitalGoldHolding;
  cryptoHoldings?: CryptoHolding[];
  claimLogs: DailyClaimLog[];
  redemptions: RedemptionLog[];
  currencySymbol: string;
}


