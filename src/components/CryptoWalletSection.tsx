import React, { useState } from 'react';
import type { CryptoHolding } from '../types';
import { formatINR } from '../utils/calculations';
import { Coins, Edit3, Plus, X, Sparkles, Wifi, Trash2 } from 'lucide-react';

interface CryptoWalletSectionProps {
  holdings: CryptoHolding[];
  onUpdateHolding: (holding: CryptoHolding) => void;
  onAddHolding: (holding: CryptoHolding) => void;
  onDeleteHolding: (id: string) => void;
  onOpenZeroGuide?: () => void;
}

export const CryptoWalletSection: React.FC<CryptoWalletSectionProps> = ({
  holdings,
  onUpdateHolding,
  onAddHolding,
  onDeleteHolding,
  onOpenZeroGuide,
}) => {
  const [editingHolding, setEditingHolding] = useState<CryptoHolding | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for editing
  const [editBalance, setEditBalance] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<number | undefined>(undefined);
  const [editPriceInr, setEditPriceInr] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');

  // Form states for adding new coin
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newPlatform, setNewPlatform] = useState<'Binance' | 'Phantom' | 'Sweat Wallet' | 'SolPick' | 'Pi Browser' | 'Other'>('Phantom');
  const [newCategory, setNewCategory] = useState<'DePIN' | 'Move-to-Earn' | 'Layer 1' | 'Exchange'>('DePIN');
  const [newBalance, setNewBalance] = useState<number>(0);
  const [newPriceInr, setNewPriceInr] = useState<number>(1);
  const [newNotes, setNewNotes] = useState('');

  // Total Portfolio Value
  const totalCryptoValueInr = holdings.reduce((sum, h) => sum + (h.valueInr || (h.balance * h.currentPriceInr)), 0);

  const handleStartEdit = (h: CryptoHolding) => {
    setEditingHolding(h);
    setEditBalance(h.balance);
    setEditAvailable(h.availableBalance);
    setEditPriceInr(h.currentPriceInr);
    setEditNotes(h.notes || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHolding) return;

    const updatedValue = Math.round(editBalance * editPriceInr * 100) / 100;

    onUpdateHolding({
      ...editingHolding,
      balance: editBalance,
      availableBalance: editAvailable,
      currentPriceInr: editPriceInr,
      valueInr: updatedValue,
      notes: editNotes,
      lastUpdated: new Date().toISOString(),
    });

    setEditingHolding(null);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newSymbol) return;

    const newId = `crypto-${Date.now()}`;
    const value = Math.round(newBalance * newPriceInr * 100) / 100;

    onAddHolding({
      id: newId,
      name: newName,
      symbol: newSymbol.toUpperCase(),
      platform: newPlatform,
      category: newCategory,
      balance: newBalance,
      currentPriceInr: newPriceInr,
      valueInr: value,
      notes: newNotes,
      lastUpdated: new Date().toISOString(),
    });

    setNewName('');
    setNewSymbol('');
    setNewBalance(0);
    setNewPriceInr(1);
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'Binance':
        return { bg: 'rgba(234,179,8, 0.15)', color: '#facc15', border: 'rgba(234,179,8, 0.3)' };
      case 'Phantom':
        return { bg: 'rgba(167,139,250, 0.15)', color: '#c4b5fd', border: 'rgba(167,139,250, 0.3)' };
      case 'Sweat Wallet':
        return { bg: 'rgba(236,72,153, 0.15)', color: '#f472b6', border: 'rgba(236,72,153, 0.3)' };
      case 'SolPick':
        return { bg: 'rgba(20,217,160, 0.15)', color: '#34f5c5', border: 'rgba(20,217,160, 0.3)' };
      case 'ZebPay':
        return { bg: 'rgba(34,211,238, 0.15)', color: '#67e8f9', border: 'rgba(34,211,238, 0.3)' };
      case 'Pi Browser':
        return { bg: 'rgba(245,158,11, 0.15)', color: '#f59e0b', border: 'rgba(245,158,11, 0.3)' };
      default:
        return { bg: 'rgba(34,211,238, 0.15)', color: '#22d3ee', border: 'rgba(34,211,238, 0.3)' };
    }
  };

  return (
    <section className="card mb-10" style={{ padding: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #a78bfa 0%, #ec4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(167,139,250, 0.35)',
          }}>
            <Coins size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#f8fbff', margin: 0 }}>
                Crypto, Web3 & DePIN Portfolio
              </h2>
              <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                Binance • Phantom • Sweat
              </span>
            </div>
            <p style={{ color: '#a5b4d4', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Binance cash balance, Sweat M2E tokens & UpRock AI bandwidth sharing on Solana
            </p>
          </div>
        </div>

        {/* Total Crypto Portfolio Value & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-secondary"
            style={{
              padding: '0.55rem 0.9rem',
              fontSize: '0.8rem',
              borderColor: 'rgba(167,139,250, 0.3)',
              color: '#c4b5fd',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Plus size={14} /> Add Coin
          </button>

          <div style={{
            background: 'linear-gradient(135deg, rgba(167,139,250, 0.15) 0%, rgba(10,15,35, 0.95) 100%)',
            border: '1px solid rgba(167,139,250, 0.35)',
            borderRadius: '14px',
            padding: '0.65rem 1.25rem',
            textAlign: 'right',
          }}>
            <span style={{ fontSize: '0.7rem', color: '#a5b4d4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Crypto Valuation
            </span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#c4b5fd', letterSpacing: '-0.02em' }}>
              {formatINR(totalCryptoValueInr, true)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#ede9fe' }}>
              {holdings.length} Active Holdings
            </span>
          </div>
        </div>
      </div>

      {/* UpRock DePIN Callout Banner */}
      <div style={{
        background: 'rgba(167,139,250, 0.08)',
        border: '1px solid rgba(167,139,250, 0.25)',
        borderRadius: '12px',
        padding: '0.85rem 1.2rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Wifi size={18} color="#c4b5fd" />
          <span style={{ fontSize: '0.825rem', color: '#cbd5ee' }}>
            <strong style={{ color: '#c4b5fd' }}>UpRock (347 UPT):</strong> You are already running an AI Bandwidth Sharing DePIN node! It operates using <strong>only Gmail</strong> on Solana with zero phone number required.
          </span>
        </div>
        {onOpenZeroGuide && (
          <button
            onClick={onOpenZeroGuide}
            style={{
              background: 'rgba(167,139,250, 0.2)',
              border: '1px solid rgba(167,139,250, 0.4)',
              color: '#c4b5fd',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <Sparkles size={12} /> View More Gmail-Only Apps
          </button>
        )}
      </div>

      {/* Main Grid: 4 Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.15rem',
      }}>
        {holdings.map((h) => {
          const badgeStyle = getPlatformBadge(h.platform);
          return (
            <div
              key={h.id}
              className="card"
              style={{
                padding: '1.25rem',
                border: '1px solid rgba(255,255,255, 0.08)',
                background: 'linear-gradient(135deg, rgba(10,15,35, 0.9) 0%, rgba(18,24,52, 0.8) 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s',
              }}
            >
              <div>
                {/* Card Top: Name + Platform Badge + Edit Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fbff', margin: 0 }}>
                      {h.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          background: badgeStyle.bg,
                          color: badgeStyle.color,
                          border: `1px solid ${badgeStyle.border}`,
                          fontWeight: 600,
                        }}
                      >
                        {h.platform}
                      </span>
                      <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                        {h.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEdit(h)}
                    style={{
                      background: 'rgba(255,255,255, 0.06)',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#a5b4d4',
                      padding: '0.35rem 0.6rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                </div>

                {/* Token Balance */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#6b7a99', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Token / Currency Balance
                  </span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f1f5ff', letterSpacing: '-0.02em' }}>
                    {h.balance.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#a5b4d4' }}>{h.symbol}</span>
                  </div>
                  {h.availableBalance !== undefined && (
                    <span style={{ fontSize: '0.72rem', color: h.category === 'Faucet' ? '#34f5c5' : '#22d3ee' }}>
                      {h.category === 'Faucet'
                        ? `Target / Min Payout: ${h.availableBalance} ${h.symbol} (${Math.round((h.balance / h.availableBalance) * 100)}% reached)`
                        : `Available to trade: ${h.availableBalance.toLocaleString()} ${h.symbol}`}
                    </span>
                  )}
                </div>

                {/* Current Price and Estimated Value */}
                <div style={{
                  background: 'rgba(10,15,35, 0.6)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.78rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(255,255,255, 0.04)',
                }}>
                  <div>
                    <span style={{ color: '#6b7a99', display: 'block', fontSize: '0.68rem' }}>Current Rate</span>
                    <strong style={{ color: '#cbd5ee' }}>
                      {h.symbol === 'INR/USDT' ? '₹1 = ₹1' : `₹${h.currentPriceInr} / ${h.symbol}`}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#6b7a99', display: 'block', fontSize: '0.68rem' }}>INR Valuation</span>
                    <strong style={{ color: '#34f5c5', fontSize: '1.05rem' }}>
                      {formatINR(h.valueInr || (h.balance * h.currentPriceInr), true)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Note / Source */}
              <div style={{ marginTop: '0.75rem', paddingTop: '0.6rem', borderTop: '1px solid rgba(255,255,255, 0.05)', fontSize: '0.72rem', color: '#6b7a99' }}>
                {h.notes?.includes('http') ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{h.notes.split('(')[0]}</span>
                    <a
                      href="https://solpick.io/faucet.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#22d3ee', textDecoration: 'underline', fontWeight: 600 }}
                    >
                      Open Faucet ↗
                    </a>
                  </div>
                ) : (
                  h.notes || `Held in ${h.platform}`
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT MODAL */}
      {editingHolding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5,8,20, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0b1020',
            border: '1px solid rgba(167,139,250, 0.3)',
            borderRadius: '18px',
            maxWidth: '460px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0, 0.7)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#f8fbff', margin: 0 }}>
                  Edit {editingHolding.name}
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#a5b4d4' }}>
                  Platform: {editingHolding.platform} ({editingHolding.symbol})
                </span>
              </div>
              <button
                onClick={() => setEditingHolding(null)}
                style={{ background: 'transparent', border: 'none', color: '#a5b4d4', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5ee', marginBottom: '0.35rem' }}>
                  Total Balance ({editingHolding.symbol})
                </label>
                <input
                  type="number"
                  step="any"
                  value={editBalance}
                  onChange={(e) => setEditBalance(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: '#1b2440',
                    border: '1px solid rgba(255,255,255, 0.1)',
                    color: '#f8fbff',
                    fontSize: '0.95rem',
                  }}
                  required
                />
              </div>

              {editingHolding.availableBalance !== undefined && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5ee', marginBottom: '0.35rem' }}>
                    Available / Unlocked Balance ({editingHolding.symbol})
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editAvailable ?? ''}
                    onChange={(e) => setEditAvailable(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '10px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.95rem',
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5ee', marginBottom: '0.35rem' }}>
                  Current Price in INR (₹ per 1 {editingHolding.symbol})
                </label>
                <input
                  type="number"
                  step="any"
                  value={editPriceInr}
                  onChange={(e) => setEditPriceInr(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: '#1b2440',
                    border: '1px solid rgba(255,255,255, 0.1)',
                    color: '#f8fbff',
                    fontSize: '0.95rem',
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5ee', marginBottom: '0.35rem' }}>
                  Notes / Source
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    background: '#1b2440',
                    border: '1px solid rgba(255,255,255, 0.1)',
                    color: '#f8fbff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{
                background: 'rgba(34,211,238, 0.1)',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                color: '#22d3ee',
                marginBottom: '1.25rem',
              }}>
                Calculated INR Value: <strong>{formatINR(editBalance * editPriceInr, true)}</strong>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${editingHolding.name} from portfolio?`)) {
                      onDeleteHolding(editingHolding.id);
                      setEditingHolding(null);
                    }
                  }}
                  style={{
                    background: 'rgba(239,68,68, 0.12)',
                    border: '1px solid rgba(239,68,68, 0.3)',
                    color: '#ff6b9a',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginRight: 'auto',
                  }}
                >
                  <Trash2 size={13} /> Delete Coin
                </button>
                <button
                  type="button"
                  onClick={() => setEditingHolding(null)}
                  className="btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD COIN MODAL */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5,8,20, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: '1rem',
        }}>
          <div style={{
            background: '#0b1020',
            border: '1px solid rgba(167,139,250, 0.3)',
            borderRadius: '18px',
            maxWidth: '460px',
            width: '100%',
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0, 0.7)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#f8fbff', margin: 0 }}>
                Add Crypto / DePIN Token
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#a5b4d4', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                    Coin Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Grass Token"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.85rem',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                    Symbol
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. GRASS"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.85rem',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                    Platform / Wallet
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.85rem',
                    }}
                  >
                    <option value="Phantom">Phantom Wallet (Solana)</option>
                    <option value="Pi Browser">Pi Browser (Pi Network)</option>
                    <option value="SolPick">SolPick Faucet</option>
                    <option value="Binance">Binance App</option>
                    <option value="Sweat Wallet">Sweat Wallet</option>
                    <option value="Other">Other Wallet</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.85rem',
                    }}
                  >
                    <option value="DePIN">DePIN (Bandwidth/Hardware)</option>
                    <option value="Faucet">Faucet (Free Hourly Roll)</option>
                    <option value="Move-to-Earn">Move-to-Earn</option>
                    <option value="Layer 1">Layer 1 Crypto</option>
                    <option value="Exchange">Exchange Cash/Crypto</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                    Token Quantity
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newBalance}
                    onChange={(e) => setNewBalance(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.85rem',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                    Price in INR (₹ per token)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newPriceInr}
                    onChange={(e) => setNewPriceInr(parseFloat(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: '#1b2440',
                      border: '1px solid rgba(255,255,255, 0.1)',
                      color: '#f8fbff',
                      fontSize: '0.85rem',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5ee', marginBottom: '0.3rem' }}>
                  Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free network usage airdrop"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '8px',
                    background: '#1b2440',
                    border: '1px solid rgba(255,255,255, 0.1)',
                    color: '#f8fbff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.85rem',
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                  }}
                >
                  Add Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
