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
      id: 'pi-network',
      name: 'Pi Network (Pi Coin)',
      frequency: 'daily',
      pointsPerCycle: 0.48, // Daily mining session (~0.02 Pi/hr)
      currentBalancePoints: 125.50, // Active mined Pi coins balance
      pointToRupeeRatio: 6.0, // CoinGecko market price (₹6.00 INR per PI)
      pointConversionFormula: {
        points: 1,
        rupees: 6,
      },
      ruleDescription: '24-hour daily mobile mining session. Tap the lightning bolt every 24 hours to mine Pi.',
      accentColor: '#f59e0b',
      badge: '125.5 PI (₹753.00)',
      enabled: true,
      notes: 'Active daily mobile mining. 125.5 PI balance. Valued at ₹6.00 per PI on CoinGecko.',
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
      id: 'crypto-solpick',
      name: 'SolPick Solana Faucet',
      symbol: 'SOL',
      platform: 'SolPick',
      category: 'Faucet',
      balance: 0.0006, // User has 0.0006 SOL on SolPick!
      availableBalance: 0.0025, // Minimum withdrawal: 0.0025 SOL (24% progress)
      currentPriceInr: 14800, // ~₹14,800 per SOL
      valueInr: 8.88, // 0.0006 * 14800
      notes: 'Hourly Faucet (https://solpick.io/faucet.php). Min withdraw: 0.0025 SOL (24% reached, 0.0019 SOL left)',
      lastUpdated: new Date().toISOString(),
    },
    {
      id: 'crypto-pi-network',
      name: 'Pi Network Coin',
      symbol: 'PI',
      platform: 'Pi Browser',
      category: 'Layer 1',
      balance: 125.50,
      availableBalance: 125.50,
      currentPriceInr: 6, // CoinGecko live rate: ₹6.00 per PI
      valueInr: 753.00, // 125.5 * 6
      notes: 'Pi Network non-custodial wallet (Pi Browser). CoinGecko rate: ₹6.00/PI.',
      lastUpdated: new Date().toISOString(),
    },
  ],
  claimLogs: [],
  redemptions: [],
};
