import type { AppState } from '../types';

export const INITIAL_STATE: AppState = {
  currencySymbol: '₹',
  bankAccount: {
    accountName: 'Primary Bank Account',
    bankName: 'Savings Account',
    balance: 1921, // User's exact balance: 1,921 rupees!
    lastUpdated: new Date().toISOString(),
  },
  goldHolding: {
    platform: 'Paytm Digital Gold',
    grams: 0.0017, // 0.0017g
    investedAmount: 26.17, // Invested: ₹26.17
    currentValue: 24.80, // Current Value: ₹24.80
    pnlAmount: -1.37, // Return: -₹1.37
    pnlPercentage: -5.23, // Growth down: -5.23%
    pricePerGram24K: 24.80 / 0.0017, // ~₹14,588.24/g
    liveMarketSimulation: true,
    lastUpdated: new Date().toISOString(),
  },
  rewardApps: [
    {
      id: 'nielsen-more',
      name: 'Nielsen More',
      frequency: 'daily',
      pointsPerCycle: 50,
      currentBalancePoints: 2450, // Real balance: 2,450 points!
      pointToRupeeRatio: 100 / 1100, // 1100 points = ₹100 UPI (11 points = ₹1)
      pointConversionFormula: {
        points: 1100,
        rupees: 100,
      },
      ruleDescription: '50 points daily. 1,100 pts = ₹100 UPI (11 pts = ₹1).',
      accentColor: '#38bdf8', // Sky Cyan
      badge: '2,450 Pts (₹222.73) — ₹200 UPI Ready!',
      enabled: true,
      notes: 'Current balance: 2,450 points. You are eligible for ₹200 UPI redemption (2200 pts) right now!',
    },
    {
      id: 'vtion-digital',
      name: 'VTION Digital',
      frequency: 'weekly',
      pointsPerCycle: 10,
      dayOfWeek: 2, // Tuesday (0=Sun, 1=Mon, 2=Tue, ...)
      currentBalancePoints: 60, // Real balance: 60 points!
      pointToRupeeRatio: 1.0, // 1 point = 1 Rupee!
      pointConversionFormula: {
        points: 1,
        rupees: 1,
      },
      ruleDescription: 'Points added every Tuesday. 1 Point = ₹1. Min 50 points to redeem via UPI.',
      accentColor: '#10b981', // Emerald Green
      badge: '60 Pts (₹60) — Ready to Redeem!',
      enabled: true,
      notes: 'Current balance: 60 points. Ready to redeem via UPI (min 50 pts threshold met)!',
    },
    {
      id: 'pawns-app',
      name: 'Pawns.app (IPRoyal)',
      frequency: 'daily',
      pointsPerCycle: 0.05,
      currentBalancePoints: 1.447, // User's exact balance: $1.447 USD!
      pointToRupeeRatio: 84.0, // 1 USD ≈ ₹84 INR
      pointConversionFormula: {
        points: 1,
        rupees: 84,
      },
      ruleDescription: 'Shares unused Wi-Fi bandwidth. Current balance: $1.447 (≈ ₹121.55). Minimum payout is $5.',
      accentColor: '#a855f7',
      badge: '$1.447 (₹121.55) — 29% to $5',
      enabled: true,
      notes: 'Current balance: $1.447 (≈ ₹121.55). Progress: 29% toward $5 (₹420) PayPal/Bitcoin cashout.',
    },
  ],
  jobIncome: {
    jobTitle: '',
    company: '',
    monthlySalary: 0,
    workDaysPerWeek: 5,
    payDay: 1,
    monthlyBonus: 0,
    enabled: false,
    notes: '',
  },
  expenses: [],
  investments: [
    {
      id: 'inv-paytm-gold',
      title: 'Paytm 24K Digital Gold (0.0017g)',
      category: 'Gold & Commodities',
      monthlyAmount: 0,
      currentValue: 24.80,
      investedAmount: 26.17,
      expectedAnnualReturn: 12,
      notes: 'Paytm Digital Gold 0.0017g. Invested ₹26.17, Returns -₹1.37 (-5.23%).',
    },
  ],
  manualTransactions: [
    {
      id: 'tx-initial-bank',
      type: 'credit',
      amount: 1921,
      category: 'Bank Account Balance',
      date: new Date().toISOString().split('T')[0],
      notes: 'Current Bank Account Opening Balance',
      timestamp: Date.now(),
    },
  ],
  cryptoHoldings: [
    {
      id: 'crypto-binance-inr',
      name: 'Binance Portfolio',
      symbol: 'INR/USDT',
      platform: 'Binance',
      category: 'Exchange',
      balance: 375,
      currentPriceInr: 1,
      valueInr: 375,
      notes: 'Total balance held in Binance App',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'crypto-sweat',
      name: 'Sweat Economy',
      symbol: 'SWEAT',
      platform: 'Sweat Wallet',
      category: 'Move-to-Earn',
      balance: 398,
      availableBalance: 412,
      currentPriceInr: 0.70,
      valueInr: 278.60,
      notes: 'Total 398 SWEAT in Sweat Wallet (412 SWEAT available)',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'crypto-uprock',
      name: 'UpRock DePIN AI',
      symbol: 'UPT',
      platform: 'Phantom',
      category: 'DePIN',
      balance: 347,
      currentPriceInr: 1.10,
      valueInr: 381.70,
      notes: 'AI bandwidth sharing token on Solana in Phantom wallet',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'crypto-grass',
      name: 'Grass DePIN Network',
      symbol: 'GRASS',
      platform: 'Phantom',
      category: 'DePIN',
      balance: 1486, // User has 1,486 GRASS!
      currentPriceInr: 0.85, // ~₹0.85 per token/point
      valueInr: 1263.10,
      notes: '1,486 GRASS earned from Solana AI web scraping bandwidth sharing',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'crypto-solana',
      name: 'Solana',
      symbol: 'SOL',
      platform: 'Phantom',
      category: 'Layer 1',
      balance: 0.00257,
      currentPriceInr: 14800,
      valueInr: 38.04,
      notes: 'Native Solana balance for network fees in Phantom',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'crypto-brave-bat',
      name: 'Brave Browser Rewards',
      symbol: 'BAT',
      platform: 'ZebPay',
      category: 'Ad Rewards',
      balance: 0.6021, // User's exact balance from Brave snapshot!
      currentPriceInr: 16.50, // ~₹16.50 per BAT (~$0.19 USD)
      valueInr: 9.93,
      notes: 'Verified payout account: ZebPay (Next payout: Nov 7)',
      lastUpdated: new Date().toISOString(),
    },
  ],
  claimLogs: [],
  redemptions: [],
};
