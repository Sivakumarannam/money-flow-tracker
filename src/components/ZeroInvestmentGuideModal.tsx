import React, { useState } from 'react';
import { 
  X, ShieldCheck, Smartphone, Wifi, CreditCard, FileText, Mail, 
  AlertTriangle, CheckCircle2, PlusCircle, Zap, 
  Clock, Award, DollarSign, Filter, Sparkles
} from 'lucide-react';
import type { RewardApp } from '../types';

interface ZeroInvestmentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppToTracker?: (app: RewardApp) => void;
  existingAppIds?: string[];
}

export const ZeroInvestmentGuideModal: React.FC<ZeroInvestmentGuideModalProps> = ({
  isOpen,
  onClose,
  onAddAppToTracker,
  existingAppIds = [],
}) => {
  const [activeTab, setActiveTab] = useState<'apps' | 'requirements' | 'process' | 'safety'>('apps');
  const [appFilter, setAppFilter] = useState<'all' | 'gmail_only' | 'bandwidth' | 'ads_browsing'>('all');

  if (!isOpen) return null;

  // Curated legitimate 2026 zero-investment earning apps for India
  const verifiedApps: Array<{
    id: string;
    name: string;
    category: string;
    difficulty: string;
    earningPotential: string;
    payoutMethod: string;
    minPayout: string;
    signupRequirement: 'Gmail Only (No Phone #)' | 'Phone Number Required';
    isBandwidthApp: boolean;
    isAdApp?: boolean;
    description: string;
    alreadyTracking: boolean;
    badgeColor?: string;
    badgeText?: string;
    appData?: RewardApp;
  }> = [
    {
      id: 'solpick-faucet',
      name: 'SolPick.io Solana Faucet',
      category: 'Hourly Faucet & Free Crypto Roll',
      difficulty: '100% Zero Investment (Hourly Claim)',
      earningPotential: '0.0025 - 0.0100 SOL / month',
      payoutMethod: 'Direct Solana Wallet (Phantom / On-Chain)',
      minPayout: '0.002500000 SOL (You have 0.0006 SOL — 24% reached)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: false,
      isAdApp: true,
      description: 'Free hourly Solana faucet (https://solpick.io/faucet.php). Enter captcha every hour to earn free SOL. Minimum withdrawal is 0.002500000 SOL directly to your Solana wallet (2qft***fWaa) with zero fees.',
      alreadyTracking: true,
      badgeColor: 'badge-emerald',
      badgeText: 'Active: 0.0006 SOL (24% to 0.0025 SOL)',
    },
    {
      id: 'coinpayu-ads',
      name: 'CoinPayU (PTC & Video Ads)',
      category: 'Watch Ads & Video Surfing',
      difficulty: 'Easy (10-30s per ad view)',
      earningPotential: '₹300 - ₹900 / month',
      payoutMethod: 'Crypto to Binance / Phantom (SOL, USDT, LTC)',
      minPayout: '$0.50 (≈ ₹42)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: false,
      isAdApp: true,
      description: 'Watch short 10-30 second sponsor video ads and surf websites. Instant crypto cashout directly into your Binance or Phantom wallet. 100% Gmail only, zero phone number required.',
      alreadyTracking: existingAppIds.includes('coinpayu-ads'),
      badgeColor: 'badge-cyan',
      appData: {
        id: 'coinpayu-ads',
        name: 'CoinPayU Ad Surfing',
        frequency: 'daily',
        pointsPerCycle: 20,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 10,
        ruleDescription: 'Surf ads & watch videos. Direct crypto payout to Binance.',
        accentColor: '#0ea5e9',
        badge: 'PTC Ads',
        enabled: true,
      },
    },
    {
      id: 'uprock-depin',
      name: 'UpRock DePIN AI (Solana)',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Runs on Wi-Fi/Data)',
      earningPotential: '₹400 - ₹1,200 / month (in UPT tokens)',
      payoutMethod: 'Phantom Wallet / Solana (UPT token)',
      minPayout: 'Instant on-chain stream',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'Shares unused internet bandwidth for real-time web AI intelligence on Solana. 1-click Google/Gmail login with ZERO phone number required! You already have 347 UPT in your Phantom wallet.',
      alreadyTracking: true,
      badgeColor: 'badge-purple',
      badgeText: 'Active in Your Phantom (347 UPT)',
    },
    {
      id: 'grass-solana',
      name: 'Grass (GetGrass.io / Wynd)',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Browser / Mobile)',
      earningPotential: '₹500 - ₹2,000 / month (in GRASS tokens)',
      payoutMethod: 'Solana Wallet (Phantom / Backpack)',
      minPayout: 'Airdrop / Solana DEX',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'The #1 decentralized web scraping network in the world. Sells unused internet bandwidth to AI companies. Register using ONLY Gmail + Password with ZERO phone number required!',
      alreadyTracking: existingAppIds.includes('grass-solana'),
      badgeColor: 'badge-emerald',
      appData: {
        id: 'grass-solana',
        name: 'Grass Solana Bandwidth',
        frequency: 'daily',
        pointsPerCycle: 100,
        pointToRupeeRatio: 0.25,
        pointConversionFormula: {
          points: 100,
          rupees: 25,
        },
        currentBalancePoints: 250,
        ruleDescription: 'Passive background internet bandwidth sharing on Solana. Gmail only signup.',
        accentColor: '#10b981',
        badge: 'Grass DePIN',
        enabled: true,
      },
    },
    {
      id: 'nodepay-ai',
      name: 'Nodepay (Nodepay.ai)',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Extension / Mobile)',
      earningPotential: '₹300 - ₹1,000 / month (Points/Tokens)',
      payoutMethod: 'Solana Wallet / Crypto',
      minPayout: 'Airdrop to Solana',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'Decentralized bandwidth network on Solana training AI foundation models. Register with 1-Click Google Sign-In with NO phone number needed.',
      alreadyTracking: existingAppIds.includes('nodepay-ai'),
      badgeColor: 'badge-cyan',
      appData: {
        id: 'nodepay-ai',
        name: 'Nodepay Solana Bandwidth',
        frequency: 'daily',
        pointsPerCycle: 50,
        pointToRupeeRatio: 0.2,
        pointConversionFormula: {
          points: 100,
          rupees: 20,
        },
        currentBalancePoints: 150,
        ruleDescription: 'Shares idle bandwidth for AI training. Sign up with Gmail only.',
        accentColor: '#0ea5e9',
        badge: 'Nodepay AI',
        enabled: true,
      },
    },
    {
      id: 'pawns-bandwidth',
      name: 'Pawns.app (IPRoyal - Not Honeygain)',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Android / PC)',
      earningPotential: '₹400 - ₹1,200 / month ($5 - $15)',
      payoutMethod: 'PayPal / Bitcoin / Virtual Visa Card',
      minPayout: '$5 (≈ ₹420)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'Legitimate bandwidth sharing app (not Honeygain). Shares unused internet with verified businesses for price comparison. Sign up with Gmail + password with ZERO phone number required.',
      alreadyTracking: existingAppIds.includes('pawns-bandwidth'),
      badgeColor: 'badge-emerald',
      appData: {
        id: 'pawns-bandwidth',
        name: 'Pawns.app Bandwidth Sharing',
        frequency: 'monthly',
        pointsPerCycle: 500,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 200,
        ruleDescription: 'Passive background internet sharing when connected to Wi-Fi. Payouts in USD/PayPal.',
        accentColor: '#10b981',
        badge: '100% Passive',
        enabled: true,
      },
    },
    {
      id: 'repocket-bandwidth',
      name: 'Repocket (Repocket.co)',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Android / Windows)',
      earningPotential: '₹350 - ₹900 / month ($4 - $10)',
      payoutMethod: 'PayPal / Wise Bank Transfer',
      minPayout: '$20 ($2 free welcome bonus)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'Another top alternative to Honeygain. Shares unused internet bandwidth safely. Registration requires ONLY Gmail + Password. NO phone number required.',
      alreadyTracking: existingAppIds.includes('repocket-bandwidth'),
      badgeColor: 'badge-blue',
      appData: {
        id: 'repocket-bandwidth',
        name: 'Repocket Bandwidth Sharing',
        frequency: 'monthly',
        pointsPerCycle: 400,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 165,
        ruleDescription: 'Shares idle bandwidth. Gmail registration only, no phone number required.',
        accentColor: '#3b82f6',
        badge: 'Repocket',
        enabled: true,
      },
    },
    {
      id: 'packetshare-bandwidth',
      name: 'PacketShare (PacketShare.io)',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Android & PC)',
      earningPotential: '₹300 - ₹800 / month',
      payoutMethod: 'PayPal / USDT (Crypto)',
      minPayout: '$10 (≈ ₹840)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'Runs silently on Android or Windows. Shares unused residential internet bandwidth. Sign up with Gmail only, no phone number needed.',
      alreadyTracking: existingAppIds.includes('packetshare-bandwidth'),
      badgeColor: 'badge-purple',
      appData: {
        id: 'packetshare-bandwidth',
        name: 'PacketShare Bandwidth',
        frequency: 'monthly',
        pointsPerCycle: 350,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 120,
        ruleDescription: 'Shares unused residential IP data. Sign up with Gmail only.',
        accentColor: '#8b5cf6',
        badge: 'PacketShare',
        enabled: true,
      },
    },
    {
      id: 'traffmonetizer',
      name: 'TraffMonetizer',
      category: 'Network Usage / Bandwidth Sharing',
      difficulty: '100% Zero Effort (Android / PC)',
      earningPotential: '₹350 - ₹1,000 / month',
      payoutMethod: 'USDT (TRC-20) / Payeer / Bitcoin',
      minPayout: '$10 (≈ ₹840)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: true,
      description: 'Distributed proxy network sharing unused residential bandwidth. Sign up using ONLY email (Gmail) with ZERO phone number required. Payouts sent directly in USDT crypto.',
      alreadyTracking: existingAppIds.includes('traffmonetizer'),
      badgeColor: 'badge-amber',
      appData: {
        id: 'traffmonetizer',
        name: 'TraffMonetizer Bandwidth',
        frequency: 'monthly',
        pointsPerCycle: 400,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 150,
        ruleDescription: 'Shares bandwidth for marketing analytics. Gmail only, crypto payouts.',
        accentColor: '#f59e0b',
        badge: 'TraffMonetizer',
        enabled: true,
      },
    },
    {
      id: 'google-opinion-rewards',
      name: 'Google Opinion Rewards',
      category: 'Instant Micro-Surveys',
      difficulty: 'Very Easy (10-30 secs/survey)',
      earningPotential: '₹100 - ₹350 / month',
      payoutMethod: 'Google Play Balance / Direct GPay UPI',
      minPayout: '₹10 (Instant per survey)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: false,
      description: 'Official Google app. Links directly to your existing Google/Gmail account. No phone number entry needed to answer surveys and earn ₹5 to ₹35 per survey.',
      alreadyTracking: existingAppIds.includes('google-opinion-rewards'),
      badgeColor: 'badge-cyan',
      appData: {
        id: 'google-opinion-rewards',
        name: 'Google Opinion Rewards',
        frequency: 'daily',
        pointsPerCycle: 5,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 25,
        ruleDescription: 'Short 20-second opinion surveys directly from Google. Instant credit.',
        accentColor: '#0ea5e9',
        badge: 'Instant Surveys',
        enabled: true,
      },
    },
    {
      id: 'attapoll-surveys',
      name: 'AttaPoll Surveys',
      category: 'High-Payout Surveys',
      difficulty: 'Easy (5-15 mins/survey)',
      earningPotential: '₹300 - ₹800 / month',
      payoutMethod: 'PayPal / Revolut / Amazon Vouchers',
      minPayout: '₹250 (Low payout threshold)',
      signupRequirement: 'Gmail Only (No Phone #)',
      isBandwidthApp: false,
      description: 'One of the highest rated survey apps in India. Supports 1-click Sign in with Google (Gmail only). You do not need to register a phone number.',
      alreadyTracking: existingAppIds.includes('attapoll-surveys'),
      badgeColor: 'badge-purple',
      appData: {
        id: 'attapoll-surveys',
        name: 'AttaPoll Surveys',
        frequency: 'weekly',
        pointsPerCycle: 75,
        pointToRupeeRatio: 1,
        pointConversionFormula: {
          points: 1,
          rupees: 1,
        },
        currentBalancePoints: 120,
        ruleDescription: 'High-rated consumer surveys paying ₹25 to ₹120 per completed survey.',
        accentColor: '#8b5cf6',
        badge: 'High Payout',
        enabled: true,
      },
    },
    {
      id: 'nielsen-more',
      name: 'Nielsen More Mobile App',
      category: 'Passive Background Meter',
      difficulty: '100% Zero Effort (Passive)',
      earningPotential: '₹136 / month (50 pts/day)',
      payoutMethod: 'UPI Direct Voucher (1,100 pts = ₹100)',
      minPayout: '1,100 pts (₹100)',
      signupRequirement: 'Phone Number Required',
      isBandwidthApp: false,
      description: 'Runs silently in background to measure anonymous mobile internet trends. Requires Indian mobile number for OTP.',
      alreadyTracking: true,
      badgeColor: 'badge-blue',
      badgeText: 'Active in Your Tracker (2,450 pts)',
    },
    {
      id: 'vtion-digital',
      name: 'VTION Digital Panel',
      category: 'Passive Background Meter',
      difficulty: '100% Zero Effort (Passive)',
      earningPotential: '₹40 - ₹60 / month (10 pts/wk)',
      payoutMethod: 'UPI Direct to Bank (1 pt = ₹1)',
      minPayout: '50 pts (₹50)',
      signupRequirement: 'Phone Number Required',
      isBandwidthApp: false,
      description: 'Awards 10 points every Tuesday for active device usage. Requires Indian mobile number for OTP.',
      alreadyTracking: true,
      badgeColor: 'badge-emerald',
      badgeText: 'Active in Your Tracker (60 pts)',
    },
  ];

  const filteredApps = verifiedApps.filter((app) => {
    if (appFilter === 'gmail_only') return app.signupRequirement === 'Gmail Only (No Phone #)';
    if (appFilter === 'bandwidth') return app.isBandwidthApp;
    if (appFilter === 'ads_browsing') return Boolean(app.isAdApp);
    return true;
  });

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 23, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1100,
      padding: '1rem',
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '20px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
      }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(139, 92, 246, 0.1) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
            }}>
              <DollarSign size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                  Zero-Investment Earning Hub (2026)
                </h2>
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  100% Free
                </span>
                <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                  Gmail-Only Apps Included
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
                Passive bandwidth sharing (Not Honeygain), Gmail-only signup apps, and daily routines
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: '#94a3b8',
              padding: '0.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: 'rgba(15, 23, 42, 0.6)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          overflowX: 'auto',
        }}>
          {[
            { id: 'apps', label: 'Verified Apps List', icon: Award },
            { id: 'requirements', label: 'What Is Required (Checklist)', icon: CheckCircle2 },
            { id: 'process', label: 'Step-by-Step Earning Process', icon: Zap },
            { id: 'safety', label: 'Scam Protection Rules', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  background: isActive ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* TAB 1: VERIFIED APPS */}
          {activeTab === 'apps' && (
            <div>
              {/* Highlight Banner about UpRock and Gmail-only */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '14px',
                padding: '0.95rem 1.25rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
              }}>
                <Sparkles size={24} color="#c084fc" />
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.45' }}>
                  <strong style={{ color: '#c084fc' }}>Active in Your Setup:</strong> You are tracking <strong>SolPick.io Faucet (0.0006 SOL)</strong>, <strong>347 UPT in Phantom</strong> from <strong>UpRock</strong>, and <strong>1,486 GRASS</strong>! All are <strong>100% GMAIL ONLY (NO Phone Number required)</strong>. Explore verified faucets, ads, and passive DePIN apps below:
                </div>
              </div>

              {/* Sub-Filters for Apps */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Filter size={12} /> Filter:
                </span>
                <button
                  onClick={() => setAppFilter('all')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: appFilter === 'all' ? 700 : 500,
                    border: appFilter === 'all' ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: appFilter === 'all' ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: appFilter === 'all' ? '#38bdf8' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  All Apps ({verifiedApps.length})
                </button>
                <button
                  onClick={() => setAppFilter('gmail_only')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: appFilter === 'gmail_only' ? 700 : 500,
                    border: appFilter === 'gmail_only' ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: appFilter === 'gmail_only' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: appFilter === 'gmail_only' ? '#34d399' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  ✉️ 100% GMAIL ONLY (No Phone #)
                </button>
                <button
                  onClick={() => setAppFilter('ads_browsing')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: appFilter === 'ads_browsing' ? 700 : 500,
                    border: appFilter === 'ads_browsing' ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: appFilter === 'ads_browsing' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: appFilter === 'ads_browsing' ? '#fbbf24' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  🚰 Faucets & Ads (SolPick + CoinPayU)
                </button>
                <button
                  onClick={() => setAppFilter('bandwidth')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: appFilter === 'bandwidth' ? 700 : 500,
                    border: appFilter === 'bandwidth' ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
                    background: appFilter === 'bandwidth' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: appFilter === 'bandwidth' ? '#c084fc' : '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  🌐 Network / Bandwidth Apps (Not Honeygain)
                </button>
              </div>

              {/* Grid of Apps */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '1rem',
              }}>
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.65)',
                      border: app.signupRequirement === 'Gmail Only (No Phone #)' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '14px',
                      padding: '1.2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s, border-color 0.2s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                            {app.name}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                            {app.category}
                          </span>
                        </div>
                        {app.alreadyTracking ? (
                          <span className={`badge ${app.badgeColor || 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                            <CheckCircle2 size={11} /> {app.badgeText || 'Tracking'}
                          </span>
                        ) : (
                          <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                            {app.signupRequirement === 'Gmail Only (No Phone #)' ? 'Gmail Only' : 'Phone Required'}
                          </span>
                        )}
                      </div>

                      {/* Requirement Tag Banner */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: app.signupRequirement === 'Gmail Only (No Phone #)' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        border: app.signupRequirement === 'Gmail Only (No Phone #)' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(234, 179, 8, 0.35)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.72rem',
                        color: app.signupRequirement === 'Gmail Only (No Phone #)' ? '#34d399' : '#facc15',
                        fontWeight: 600,
                        marginBottom: '0.6rem',
                      }}>
                        <Mail size={12} />
                        Signup: {app.signupRequirement}
                      </div>

                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.4', margin: '0.2rem 0 0.8rem 0' }}>
                        {app.description}
                      </p>

                      <div style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        borderRadius: '10px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.78rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.5rem',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                      }}>
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Monthly Potential</span>
                          <strong style={{ color: '#34d399' }}>{app.earningPotential}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>Payout Method</span>
                          <strong style={{ color: '#38bdf8' }}>{app.payoutMethod}</strong>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                          <span style={{ color: '#64748b', display: 'inline', fontSize: '0.7rem' }}>Minimum Cashout: </span>
                          <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{app.minPayout}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button */}
                    <div>
                      {app.alreadyTracking ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>
                          <CheckCircle2 size={14} /> Active in your Portfolio / Tracker
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            if (app.appData && onAddAppToTracker) {
                              onAddAppToTracker(app.appData);
                            }
                          }}
                          className="btn btn-primary"
                          style={{
                            width: '100%',
                            fontSize: '0.78rem',
                            padding: '0.5rem 0.85rem',
                            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                          }}
                        >
                          <PlusCircle size={14} /> Add to My Apps Tracker
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: REQUIREMENTS */}
          {activeTab === 'requirements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '1rem',
                color: '#cbd5e1',
                fontSize: '0.85rem',
              }}>
                <strong style={{ color: '#34d399' }}>Gmail-Only Strategy:</strong> Since you only want to use Gmail (no phone number), DePIN bandwidth apps like <strong>UpRock, Grass, Nodepay, Pawns, and Repocket</strong> are perfect! They only require an email address or Google OAuth, keeping your personal phone number 100% private.
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
              }}>
                {[
                  {
                    icon: Mail,
                    title: '1. Secondary Gmail Account',
                    desc: 'Create a free dedicated Gmail (e.g. yourname.depin@gmail.com). You will use this single email to log into Grass, UpRock, Nodepay, Pawns, and Repocket without entering any phone number.',
                    status: 'Essential (No Phone #)',
                  },
                  {
                    icon: Smartphone,
                    title: '2. Android Smartphone or PC',
                    desc: 'Android 8.0+ or PC. Keep battery optimization set to "Unrestricted" so background nodes like UpRock stay online.',
                    status: 'Ready',
                  },
                  {
                    icon: Wifi,
                    title: '3. Internet Connection',
                    desc: 'Home Wi-Fi or mobile data pack. DePIN apps only use spare, unused bandwidth (usually less than 50MB-100MB per day).',
                    status: 'Ready',
                  },
                  {
                    icon: CreditCard,
                    title: '4. Phantom Wallet (Solana)',
                    desc: 'You already have Phantom! It receives UpRock (UPT), Grass, and Solana with zero bank account or phone number required.',
                    status: 'Active (347 UPT & SOL)',
                  },
                  {
                    icon: Award,
                    title: '5. SolPick.io Solana Faucet',
                    desc: 'Free Solana hourly faucet hub (https://solpick.io/faucet.php). Accrues SOL directly to your balance, ready for 0.0025 SOL on-chain withdrawal to Phantom.',
                    status: 'Active (0.0006 SOL)',
                  },
                  {
                    icon: FileText,
                    title: '6. Free PayPal India Account',
                    desc: 'Used to withdraw cash from Pawns.app or Repocket. Links your USD earnings directly to your Indian bank account.',
                    status: 'Optional for USD',
                  },
                  {
                    icon: DollarSign,
                    title: '7. Zero Upfront Investment',
                    desc: 'None of these apps require any money. Never deposit any fees.',
                    status: '100% Free Forever',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '1.1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#38bdf8',
                        }}>
                          <Icon size={18} />
                        </div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                          {item.title}
                        </h4>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', lineHeight: '1.45', margin: '0 0 0.5rem 0' }}>
                        {item.desc}
                      </p>
                      <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP PROCESS */}
          {activeTab === 'process' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '1.25rem',
              }}>
                <h3 style={{ fontSize: '1.1rem', color: '#38bdf8', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} /> Step-by-Step Earning Process (Gmail-Only DePIN & SolPick Faucet)
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    {
                      step: 'Step 1: Setup Dedicated Gmail',
                      title: 'Prepare Dedicated Gmail Account',
                      action: 'Use 1 Gmail account to sign into UpRock, Grass, Nodepay, Pawns, and Repocket. Never enter a phone number on any of them.',
                      reward: '100% Privacy',
                    },
                    {
                      step: 'Step 2: Connect Phantom Wallet',
                      title: 'Link Your Solana Address',
                      action: 'In UpRock, Grass, and Nodepay, connect your Phantom wallet address. All earned tokens (like your 347 UPT) deposit directly to Phantom.',
                      reward: 'Instant On-Chain Crypto',
                    },
                    {
                      step: 'Step 3: Background Wi-Fi Running',
                      title: 'Keep Nodes Active While Charging',
                      action: 'When you are connected to Wi-Fi at home or charging your phone at night, keep UpRock and Grass running. They use less than 1% battery.',
                      reward: '+₹30 to +₹60 / day passive',
                    },
                    {
                      step: 'Step 4: Claim Hourly on SolPick & Surf CoinPayU',
                      title: 'Hourly Faucet Rolls & Ad Surfing',
                      action: 'Claim free SOL hourly on SolPick (https://solpick.io/faucet.php) and view CoinPayU ads to stack free crypto with zero deposits.',
                      reward: '0.0006 SOL (Min withdraw 0.0025 SOL)',
                    },
                    {
                      step: 'Step 5: Swap & Cashout to Bank via UPI',
                      title: 'Swap Tokens in Phantom to SOL / USDT & Withdraw',
                      action: 'When you reach 0.0025 SOL on SolPick or want to cash out UPT/GRASS, swap to SOL or USDT on Jupiter DEX, transfer to Binance (₹375), and withdraw directly to your bank account via UPI!',
                      reward: 'Direct Real INR into Bank',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start',
                        paddingBottom: '0.85rem',
                        borderBottom: idx < 4 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      }}
                    >
                      <div style={{
                        minWidth: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#fff',
                      }}>
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600, textTransform: 'uppercase' }}>
                            {item.step}
                          </span>
                          <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                            {item.reward}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '0.92rem', color: '#f8fafc', margin: '0 0 0.25rem 0' }}>
                          {item.title}
                        </h4>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, lineHeight: '1.4' }}>
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCAM PROTECTION */}
          {activeTab === 'safety' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '14px',
                padding: '1.25rem',
              }}>
                <h3 style={{ fontSize: '1.1rem', color: '#f87171', marginTop: 0, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={20} /> Critical Safety Rules: How to Spot Scams
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Since you want to protect your privacy and use only Gmail, keep these rules in mind:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                  {[
                    {
                      rule: 'RULE #1: NEVER PAY TO WORK OR REGISTER',
                      desc: 'If an app or Telegram admin asks for ANY "activation fee", "security deposit", "VIP upgrade fee", or "registration charge", it is a 100% SCAM. Real bandwidth sharing networks never charge money.',
                    },
                    {
                      rule: 'RULE #2: NEVER SHARE YOUR PHANTOM SEED PHRASE',
                      desc: 'Your 12-word recovery phrase in Phantom gives complete access to your 347 UPT and Solana. Legitimate apps like UpRock only ask for your public wallet address, NEVER your seed phrase or private key.',
                    },
                    {
                      rule: 'RULE #3: RECEIVING MONEY NEVER REQUIRES YOUR UPI PIN',
                      desc: 'When cashing out from Binance P2P into your bank, the buyer sends money to your UPI ID directly. You never have to enter your UPI PIN to receive money.',
                    },
                    {
                      rule: 'RULE #4: AVOID TELEGRAM "LIKE YOUTUBE VIDEOS" SCHEMES',
                      desc: 'Never deposit money into Telegram task bots or color prediction games.',
                    },
                  ].map((rule, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                      }}
                    >
                      <strong style={{ color: '#fca5a5', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>
                        {rule.rule}
                      </strong>
                      <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, lineHeight: '1.45' }}>
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.75rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.8)',
        }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            MoneyFlow OS • 2026 Free Apps Guide
          </span>
          <button
            onClick={onClose}
            className="btn btn-primary"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
