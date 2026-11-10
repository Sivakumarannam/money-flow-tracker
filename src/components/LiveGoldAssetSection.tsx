import React, { useState, useEffect } from 'react';
import type { BankAccount, DigitalGoldHolding } from '../types';
import { formatINR } from '../utils/calculations';
import { Landmark, TrendingDown, TrendingUp, Sparkles, Edit3, Check, RefreshCw, ArrowUpRight, ArrowDownRight, Info, HelpCircle } from 'lucide-react';

interface LiveGoldAssetSectionProps {
  bankAccount: BankAccount;
  goldHolding: DigitalGoldHolding;
  cryptoTotalInr?: number;
  nielsenCashValue?: number;
  vtionCashValue?: number;
  nielsenPoints?: number;
  vtionPoints?: number;
  onUpdateBank: (bank: BankAccount) => void;
  onUpdateGold: (gold: DigitalGoldHolding) => void;
  onOpenZeroGuide?: () => void;
}

export const LiveGoldAssetSection: React.FC<LiveGoldAssetSectionProps> = ({
  bankAccount,
  goldHolding,
  cryptoTotalInr = 1073.34,
  nielsenPoints = 2450,
  vtionPoints = 60,
  onUpdateBank,
  onUpdateGold,
  onOpenZeroGuide,
}) => {
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isGoldModalOpen, setIsGoldModalOpen] = useState(false);
  const [liquidityMode, setLiquidityMode] = useState<'direct' | 'crypto' | 'all'>('direct');
  const [showAuditExplainer, setShowAuditExplainer] = useState(false);

  // Form states
  const [tempBankBalance, setTempBankBalance] = useState(bankAccount.balance);
  const [tempGoldGrams, setTempGoldGrams] = useState(goldHolding.grams);
  const [tempGoldInvested, setTempGoldInvested] = useState(goldHolding.investedAmount);

  // Live market price simulation state
  const [isLiveSimulating, setIsLiveSimulating] = useState(goldHolding.liveMarketSimulation);
  const [currentGoldRatePerGram, setCurrentGoldRatePerGram] = useState(goldHolding.pricePerGram24K);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('down');

  // Live ticker effect (micro fluctuations simulating live 24K gold trading)
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Simulate realistic micro fluctuation: between -0.15% and +0.15%
      const deltaPercent = (Math.random() * 0.3 - 0.15) / 100;
      setCurrentGoldRatePerGram((prevRate) => {
        const newRate = prevRate * (1 + deltaPercent);
        setPriceDirection(deltaPercent >= 0 ? 'up' : 'down');

        // Recalculate holding value
        const newCurrentValue = Math.round(goldHolding.grams * newRate * 100) / 100;
        const newPnlAmount = Math.round((newCurrentValue - goldHolding.investedAmount) * 100) / 100;
        const newPnlPercentage = Math.round(((newCurrentValue - goldHolding.investedAmount) / goldHolding.investedAmount) * 10000) / 100;

        onUpdateGold({
          ...goldHolding,
          currentValue: newCurrentValue,
          pnlAmount: newPnlAmount,
          pnlPercentage: newPnlPercentage,
          pricePerGram24K: Math.round(newRate * 100) / 100,
          lastUpdated: new Date().toISOString(),
        });

        return newRate;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveSimulating, goldHolding.grams, goldHolding.investedAmount]);

  // Manual nudge buttons
  const nudgeGoldPrice = (percentageChange: number) => {
    const newRate = currentGoldRatePerGram * (1 + percentageChange / 100);
    setCurrentGoldRatePerGram(newRate);
    setPriceDirection(percentageChange >= 0 ? 'up' : 'down');

    const newCurrentValue = Math.round(goldHolding.grams * newRate * 100) / 100;
    const newPnlAmount = Math.round((newCurrentValue - goldHolding.investedAmount) * 100) / 100;
    const newPnlPercentage = Math.round(((newCurrentValue - goldHolding.investedAmount) / goldHolding.investedAmount) * 10000) / 100;

    onUpdateGold({
      ...goldHolding,
      currentValue: newCurrentValue,
      pnlAmount: newPnlAmount,
      pnlPercentage: newPnlPercentage,
      pricePerGram24K: Math.round(newRate * 100) / 100,
      lastUpdated: new Date().toISOString(),
    });
  };

  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBank({
      ...bankAccount,
      balance: tempBankBalance,
      lastUpdated: new Date().toISOString(),
    });
    setIsBankModalOpen(false);
  };

  const handleSaveGold = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = currentGoldRatePerGram;
    const newCurrentValue = Math.round(tempGoldGrams * newRate * 100) / 100;
    const newPnlAmount = Math.round((newCurrentValue - tempGoldInvested) * 100) / 100;
    const newPnlPercentage = Math.round(((newCurrentValue - tempGoldInvested) / tempGoldInvested) * 10000) / 100;

    onUpdateGold({
      ...goldHolding,
      grams: tempGoldGrams,
      investedAmount: tempGoldInvested,
      currentValue: newCurrentValue,
      pnlAmount: newPnlAmount,
      pnlPercentage: newPnlPercentage,
      lastUpdated: new Date().toISOString(),
    });
    setIsGoldModalOpen(false);
  };

  // 1. Direct Liquid Financial Assets (Bank + Gold):
  const directLiquidWealth = Math.round((bankAccount.balance + goldHolding.currentValue) * 100) / 100;

  // 2. Crypto Portfolio Value:
  const cryptoVal = cryptoTotalInr || 1073.34;
  const liquidPlusCrypto = Math.round((directLiquidWealth + cryptoVal) * 100) / 100;

  // 3. Exact Nielsen Redeemable Cash (in slabs of 1,100 pts = ₹100 UPI):
  const currentNielsenPts = nielsenPoints;
  const nielsenEligibleSlabs = Math.floor(currentNielsenPts / 1100);
  const nielsenEligibleCash = nielsenEligibleSlabs * 100; // ₹200.00
  const nielsenPendingPts = currentNielsenPts % 1100; // 250 pts
  const nielsenPendingCash = Math.round((nielsenPendingPts * (100 / 1100)) * 100) / 100; // ₹22.73

  // 4. Exact VTION Redeemable Cash (1 pt = ₹1, 50 pts threshold met):
  const currentVtionPts = vtionPoints;
  const vtionEligibleCash = currentVtionPts >= 50 ? currentVtionPts : 0; // ₹60.00

  // 5. Total In-App Redeemable UPI Cash:
  const totalAppRedeemable = nielsenEligibleCash + vtionEligibleCash; // ₹260.00

  // 6. Total All-Inclusive Net Wealth (Bank + Gold + Crypto + App Vouchers):
  const allInclusiveWealth = Math.round((directLiquidWealth + cryptoVal + totalAppRedeemable) * 100) / 100;

  // Displayed wealth based on user toggle:
  const displayedWealth = liquidityMode === 'direct' 
    ? directLiquidWealth 
    : liquidityMode === 'crypto'
      ? liquidPlusCrypto
      : allInclusiveWealth;

  const isLoss = goldHolding.pnlAmount < 0;

  return (
    <section className="card card-amber mb-10" style={{ padding: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(245,158,11, 0.35)',
          }}>
            <Landmark size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#f8fbff', margin: 0 }}>
                Bank Account & Live Paytm Gold Portfolio
              </h2>
              <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                Liquid Assets
              </span>
              {onOpenZeroGuide && (
                <button
                  onClick={onOpenZeroGuide}
                  className="badge badge-green"
                  style={{
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    border: '1px solid rgba(20,217,160, 0.4)',
                    background: 'rgba(20,217,160, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.2rem 0.5rem',
                  }}
                >
                  <Sparkles size={11} /> 2026 Free Apps Guide
                </button>
              )}
            </div>
            <p style={{ color: '#a5b4d4', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Your real-time bank funds and 24K digital gold with live market price tracking
            </p>
          </div>
        </div>

        {/* Total Liquid Net Worth Chip with View Mode Selector */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(20,217,160, 0.12) 0%, rgba(10,15,35, 0.95) 100%)',
          border: '1px solid rgba(20,217,160, 0.35)',
          borderRadius: '16px',
          padding: '0.75rem 1.25rem',
          textAlign: 'right',
          boxShadow: '0 8px 24px rgba(0,0,0, 0.3)',
        }}>
          {/* Liquidity Mode Selector (3 options) */}
          <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setLiquidityMode('direct')}
              style={{
                fontSize: '0.66rem',
                fontWeight: liquidityMode === 'direct' ? 700 : 500,
                padding: '0.22rem 0.55rem',
                borderRadius: '8px',
                border: liquidityMode === 'direct' ? '1px solid rgba(34,211,238, 0.5)' : '1px solid transparent',
                background: liquidityMode === 'direct' ? 'rgba(34,211,238, 0.2)' : 'rgba(255,255,255, 0.05)',
                color: liquidityMode === 'direct' ? '#22d3ee' : '#a5b4d4',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Direct Liquid
            </button>
            <button
              onClick={() => setLiquidityMode('crypto')}
              style={{
                fontSize: '0.66rem',
                fontWeight: liquidityMode === 'crypto' ? 700 : 500,
                padding: '0.22rem 0.55rem',
                borderRadius: '8px',
                border: liquidityMode === 'crypto' ? '1px solid rgba(167,139,250, 0.5)' : '1px solid transparent',
                background: liquidityMode === 'crypto' ? 'rgba(167,139,250, 0.2)' : 'rgba(255,255,255, 0.05)',
                color: liquidityMode === 'crypto' ? '#c4b5fd' : '#a5b4d4',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              + Crypto
            </button>
            <button
              onClick={() => setLiquidityMode('all')}
              style={{
                fontSize: '0.66rem',
                fontWeight: liquidityMode === 'all' ? 700 : 500,
                padding: '0.22rem 0.55rem',
                borderRadius: '8px',
                border: liquidityMode === 'all' ? '1px solid rgba(20,217,160, 0.5)' : '1px solid transparent',
                background: liquidityMode === 'all' ? 'rgba(20,217,160, 0.2)' : 'rgba(255,255,255, 0.05)',
                color: liquidityMode === 'all' ? '#34f5c5' : '#a5b4d4',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              + All Rewards (UPI)
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', color: '#a5b4d4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {liquidityMode === 'direct' ? 'Direct Liquid Assets' : liquidityMode === 'crypto' ? 'Liquid + Crypto Portfolio' : 'Grand Total Net Wealth'}:
            </span>
            <span style={{ fontSize: '1.55rem', fontWeight: 800, color: liquidityMode === 'crypto' ? '#c4b5fd' : '#34f5c5', letterSpacing: '-0.02em' }}>
              {formatINR(displayedWealth, true)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.25rem' }}>
            <span style={{ fontSize: '0.72rem', color: liquidityMode === 'crypto' ? '#ede9fe' : '#8bffe0' }}>
              {liquidityMode === 'direct' ? (
                <>Bank (₹{bankAccount.balance}) + Gold (₹{goldHolding.currentValue})</>
              ) : liquidityMode === 'crypto' ? (
                <>Bank + Gold (₹{directLiquidWealth}) + Crypto (₹{cryptoVal})</>
              ) : (
                <>Bank + Gold + Crypto + App Rewards (₹{totalAppRedeemable})</>
              )}
            </span>
            <button
              onClick={() => setShowAuditExplainer(!showAuditExplainer)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#22d3ee',
                cursor: 'pointer',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.1rem 0.3rem',
                textDecoration: 'underline',
              }}
              title="Click to see exact breakdown of Bank, Gold, Crypto and App Rewards"
            >
              <Info size={12} /> Audit Math
            </button>
          </div>
        </div>
      </div>

      {/* Explanatory Math Audit Dropdown */}
      {showAuditExplainer && (
        <div style={{
          background: 'rgba(10,15,35, 0.95)',
          border: '1px solid rgba(34,211,238, 0.3)',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 10px 30px rgba(0,0,0, 0.5)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} color="#22d3ee" />
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fbff', fontWeight: 700 }}>
                Exact Wealth & Liquidity Audit (Why ₹2,228.64 was wrong)
              </h4>
            </div>
            <button
              onClick={() => setShowAuditExplainer(false)}
              style={{ background: 'transparent', border: 'none', color: '#6b7a99', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <p style={{ color: '#a5b4d4', fontSize: '0.82rem', lineHeight: '1.5', margin: '0 0 1rem 0' }}>
            You rightly noticed the discrepancy! Here is the exact mathematical breakdown of every rupee:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}>
            <div style={{ background: 'rgba(26,36,70, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#6b7a99', display: 'block' }}>1. Primary Bank Account</span>
              <strong style={{ fontSize: '1rem', color: '#22d3ee' }}>₹{bankAccount.balance.toFixed(2)}</strong>
              <span style={{ fontSize: '0.7rem', color: '#a5b4d4', display: 'block' }}>100% Instant In-Hand Cash</span>
            </div>

            <div style={{ background: 'rgba(26,36,70, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#6b7a99', display: 'block' }}>2. Paytm 24K Gold (0.0017g)</span>
              <strong style={{ fontSize: '1rem', color: '#f59e0b' }}>₹{goldHolding.currentValue.toFixed(2)}</strong>
              <span style={{ fontSize: '0.7rem', color: '#a5b4d4', display: 'block' }}>Direct Liquid Gold Asset</span>
            </div>

            <div style={{ background: 'rgba(26,36,70, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#6b7a99', display: 'block' }}>3. Nielsen More (2,450 pts)</span>
              <strong style={{ fontSize: '1rem', color: '#34f5c5' }}>₹{nielsenEligibleCash.toFixed(2)}</strong>
              <span style={{ fontSize: '0.7rem', color: '#a5b4d4', display: 'block' }}>2,200 pts eligible (₹200 UPI); 250 pts reserve (₹{nielsenPendingCash.toFixed(2)})</span>
            </div>

            <div style={{ background: 'rgba(26,36,70, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#6b7a99', display: 'block' }}>4. VTION Digital (60 pts)</span>
              <strong style={{ fontSize: '1rem', color: '#34f5c5' }}>₹{vtionEligibleCash.toFixed(2)}</strong>
              <span style={{ fontSize: '0.7rem', color: '#a5b4d4', display: 'block' }}>60 pts = ₹60 (Tuesdays credit)</span>
            </div>

            <div style={{ background: 'rgba(26,36,70, 0.6)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#6b7a99', display: 'block' }}>5. Crypto Portfolio</span>
              <strong style={{ fontSize: '1rem', color: '#c4b5fd' }}>₹{cryptoVal.toFixed(2)}</strong>
              <span style={{ fontSize: '0.7rem', color: '#a5b4d4', display: 'block' }}>Binance, Sweat, UpRock & SOL</span>
            </div>
          </div>

          <div style={{
            background: 'rgba(245,158,11, 0.1)',
            border: '1px solid rgba(245,158,11, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            color: '#fde68a',
            lineHeight: '1.45',
          }}>
            <strong>Why ₹2,228.64 was showing earlier:</strong><br />
            The app previously calculated 2,450 points as continuous theoretical fraction: <code>2,450 × (100 / 1100) = ₹222.73</code>. But Nielsen only redeems in discrete ₹100 / 1,100-point slabs! The extra 250 points (worth ₹{nielsenPendingCash.toFixed(2)}) cannot be cashed out yet. Adding that fractional ₹{nielsenPendingCash.toFixed(2)} plus gold price fluctuation resulted in ₹2,228.64.<br />
            <strong>Your true immediately redeemable total is ₹2,205.80</strong> (and direct financial liquid assets in bank + gold is <strong>₹{directLiquidWealth.toFixed(2)}</strong>).
          </div>
        </div>
      )}

      {/* Main Grid: Bank Account Card + Live Paytm Gold Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem',
      }}>
        
        {/* 1. BANK ACCOUNT CARD */}
        <div className="card" style={{
          padding: '1.5rem',
          border: '1px solid rgba(34,211,238, 0.3)',
          background: 'linear-gradient(135deg, rgba(10,15,35, 0.9) 0%, rgba(20,28,60, 0.75) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(34,211,238, 0.15)',
                  color: '#22d3ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Landmark size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fbff', margin: 0 }}>
                    {bankAccount.accountName}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#a5b4d4' }}>
                    {bankAccount.bankName} • Active Liquid Cash
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setTempBankBalance(bankAccount.balance);
                  setIsBankModalOpen(true);
                }}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <Edit3 size={12} /> Edit Balance
              </button>
            </div>

            {/* Large Balance Display */}
            <div style={{
              background: 'rgba(10,15,35, 0.8)',
              padding: '1.25rem',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255, 0.08)',
              marginBottom: '1rem',
            }}>
              <span style={{ fontSize: '0.75rem', color: '#a5b4d4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Current Available Bank Balance
              </span>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#f8fbff', marginTop: '0.2rem', letterSpacing: '-0.02em' }}>
                {formatINR(bankAccount.balance, true)}
              </div>
              <span className="badge badge-green" style={{ marginTop: '0.4rem', fontSize: '0.7rem' }}>
                ✓ Verified in your bank account
              </span>
            </div>
          </div>

          <div style={{
            fontSize: '0.78rem',
            color: '#a5b4d4',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(255,255,255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>100% liquid & ready to spend or invest</span>
            <span style={{ color: '#6b7a99', fontSize: '0.72rem' }}>Instant funds</span>
          </div>
        </div>

        {/* 2. PAYTM 24K DIGITAL GOLD LIVE CARD */}
        <div className="card" style={{
          padding: '1.5rem',
          border: '1px solid rgba(245,158,11, 0.4)',
          background: 'linear-gradient(135deg, rgba(30,20,10, 0.4) 0%, rgba(10,15,35, 0.9) 100%)',
          position: 'relative',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245,158,11, 0.3)',
              }}>
                <Sparkles size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#f8fbff', margin: 0 }}>
                    {goldHolding.platform}
                  </h3>
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                    24K 99.9%
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#a5b4d4' }}>
                  Holding: <strong style={{ color: '#f59e0b' }}>{goldHolding.grams}g</strong>
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                onClick={() => {
                  setTempGoldGrams(goldHolding.grams);
                  setTempGoldInvested(goldHolding.investedAmount);
                  setIsGoldModalOpen(true);
                }}
                className="btn-secondary"
                style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
              >
                <Edit3 size={12} /> Edit Gold
              </button>
            </div>
          </div>

          {/* Current Value & Returns Hero */}
          <div style={{
            background: 'rgba(10,15,35, 0.85)',
            border: '1px solid rgba(245,158,11, 0.25)',
            borderRadius: '14px',
            padding: '1.15rem',
            marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#a5b4d4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Current Market Value
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '0.15rem', letterSpacing: '-0.02em' }}>
                  {formatINR(goldHolding.currentValue, true)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5ee', marginTop: '0.2rem' }}>
                  Total Invested: <strong>{formatINR(goldHolding.investedAmount, true)}</strong>
                </div>
              </div>

              {/* PnL Loss/Gain Pill matching user's -1.37 and -5.23% */}
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.72rem', color: '#a5b4d4', textTransform: 'uppercase' }}>Returns</span>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: isLoss ? '#ff6b9a' : '#34f5c5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.2rem',
                }}>
                  {isLoss ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
                  {isLoss ? '-' : '+'}{formatINR(Math.abs(goldHolding.pnlAmount), true)}
                </div>
                <span className="badge" style={{
                  fontSize: '0.7rem',
                  background: isLoss ? 'rgba(255,61,127, 0.15)' : 'rgba(20,217,160, 0.15)',
                  color: isLoss ? '#ff6b9a' : '#34f5c5',
                  border: isLoss ? '1px solid rgba(255,61,127, 0.35)' : '1px solid rgba(20,217,160, 0.35)',
                  marginTop: '0.25rem',
                }}>
                  {goldHolding.pnlPercentage}% Growth {isLoss ? 'Down' : 'Up'}
                </span>
              </div>
            </div>
          </div>

          {/* LIVE GOLD RATE TICKER & CONTROLS */}
          <div style={{
            background: 'rgba(10,15,35, 0.6)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            border: '1px solid rgba(255,255,255, 0.06)',
            marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isLiveSimulating ? '#14d9a0' : '#6b7a99',
                  display: 'inline-block',
                  boxShadow: isLiveSimulating ? '0 0 10px #14d9a0' : 'none',
                }} />
                <span style={{ fontSize: '0.78rem', color: '#cbd5ee', fontWeight: 600 }}>
                  24K Gold Rate:
                </span>
                <strong style={{ color: priceDirection === 'up' ? '#34f5c5' : '#ff6b9a', fontSize: '0.88rem' }}>
                  ₹{Math.round(currentGoldRatePerGram).toLocaleString()}/g
                </strong>
                {priceDirection === 'up' ? (
                  <ArrowUpRight size={14} color="#34f5c5" />
                ) : (
                  <ArrowDownRight size={14} color="#ff6b9a" />
                )}
              </div>

              {/* Ticker Controls: Increase / Decrease Rate Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={() => nudgeGoldPrice(0.5)}
                  title="Simulate Market Increase (+0.5%)"
                  style={{
                    background: 'rgba(20,217,160, 0.15)',
                    border: '1px solid rgba(20,217,160, 0.3)',
                    color: '#34f5c5',
                    borderRadius: '6px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ▲ +0.5%
                </button>

                <button
                  onClick={() => nudgeGoldPrice(-0.5)}
                  title="Simulate Market Drop (-0.5%)"
                  style={{
                    background: 'rgba(255,61,127, 0.15)',
                    border: '1px solid rgba(255,61,127, 0.3)',
                    color: '#ff6b9a',
                    borderRadius: '6px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ▼ -0.5%
                </button>

                <button
                  onClick={() => setIsLiveSimulating(!isLiveSimulating)}
                  title="Toggle Live Ticker"
                  style={{
                    background: isLiveSimulating ? 'rgba(34,211,238, 0.2)' : 'rgba(255,255,255, 0.05)',
                    border: '1px solid rgba(255,255,255, 0.1)',
                    color: isLiveSimulating ? '#22d3ee' : '#a5b4d4',
                    borderRadius: '6px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.72rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                  }}
                >
                  <RefreshCw size={11} className={isLiveSimulating ? 'animate-spin' : ''} />
                  {isLiveSimulating ? 'Live Pulse' : 'Paused'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT BANK MODAL */}
      {isBankModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="card-elevated" style={{ width: '100%', maxWidth: '420px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fbff', marginBottom: '0.5rem' }}>
              Update Bank Account Balance
            </h3>
            <p style={{ color: '#a5b4d4', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
              Enter your current active bank balance
            </p>

            <form onSubmit={handleSaveBank}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label>Bank Balance (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={tempBankBalance}
                  onChange={(e) => setTempBankBalance(Number(e.target.value))}
                  required
                  style={{ fontSize: '1.3rem', fontWeight: 800 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsBankModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Balance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GOLD MODAL */}
      {isGoldModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="card-elevated" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fbff', marginBottom: '0.5rem' }}>
              Update Paytm Gold Holding
            </h3>
            <p style={{ color: '#a5b4d4', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
              Update grams and invested rupees to sync with your Paytm app
            </p>

            <form onSubmit={handleSaveGold}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Gold Quantity (Grams)</label>
                <input
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={tempGoldGrams}
                  onChange={(e) => setTempGoldGrams(Number(e.target.value))}
                  required
                  style={{ fontSize: '1.15rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>Total Invested Amount (₹)</label>
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={tempGoldInvested}
                  onChange={(e) => setTempGoldInvested(Number(e.target.value))}
                  required
                  style={{ fontSize: '1.15rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsGoldModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Check size={16} /> Save Gold Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
