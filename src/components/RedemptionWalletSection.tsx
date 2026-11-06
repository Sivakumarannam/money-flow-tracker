import React, { useState } from 'react';
import type { AppState, RedemptionLog } from '../types';
import { formatINR } from '../utils/calculations';
import { Wallet, Gift, Trash2, Plus, CheckCircle } from 'lucide-react';

interface RedemptionWalletSectionProps {
  state: AppState;
  onAddRedemption: (redemption: RedemptionLog) => void;
  onDeleteRedemption: (id: string) => void;
}

export const RedemptionWalletSection: React.FC<RedemptionWalletSectionProps> = ({
  state,
  onAddRedemption,
  onDeleteRedemption,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedAppId, setSelectedAppId] = useState<string>(state.rewardApps[0]?.id || 'nielsen-more');
  const [pointsRedeemed, setPointsRedeemed] = useState<number>(1000);
  const [cashValue, setCashValue] = useState<number>(100);
  const [method, setMethod] = useState<string>('Amazon Pay');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const redemptions = state.redemptions || [];

  // Calculate totals
  const totalPointsClaimed = state.claimLogs.reduce((sum, log) => sum + log.points, 0);
  const totalPointsRedeemed = redemptions.reduce((sum, r) => sum + r.pointsRedeemed, 0);
  const totalCashRealized = redemptions.reduce((sum, r) => sum + r.cashValueRupees, 0);
  const currentPointsBalance = Math.max(0, totalPointsClaimed - totalPointsRedeemed);

  // Estimate rupee value of balance (using average ratio)
  const nielsen = state.rewardApps.find((a) => a.id === 'nielsen-more');
  const estimatedBalanceRupees = currentPointsBalance * (nielsen?.pointToRupeeRatio || 0.1);

  // When app selection changes in form, auto-update default cash calculation
  const handleAppChange = (appId: string) => {
    setSelectedAppId(appId);
    const app = state.rewardApps.find((a) => a.id === appId);
    if (app) {
      setCashValue(Math.round(pointsRedeemed * app.pointToRupeeRatio));
    }
  };

  const handlePointsChange = (pts: number) => {
    setPointsRedeemed(pts);
    const app = state.rewardApps.find((a) => a.id === selectedAppId);
    if (app) {
      setCashValue(Math.round(pts * app.pointToRupeeRatio * 100) / 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = state.rewardApps.find((a) => a.id === selectedAppId);
    if (!app || pointsRedeemed <= 0 || cashValue <= 0) return;

    const newRedemption: RedemptionLog = {
      id: `red-${Date.now()}`,
      appId: app.id,
      appName: app.name,
      pointsRedeemed,
      cashValueRupees: cashValue,
      method,
      date,
      notes: notes.trim() || undefined,
      timestamp: Date.now(),
    };

    onAddRedemption(newRedemption);
    setIsModalOpen(false);
    setNotes('');
  };

  return (
    <section className="card mb-10" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
          }}>
            <Wallet size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
              Points Wallet & Cashout Ledger
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
              Track real-life Amazon Pay vouchers, UPI payouts, and unredeemed point balances
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-green"
          style={{ padding: '0.5rem 0.95rem', fontSize: '0.825rem' }}
        >
          <Plus size={14} /> Log Cashout / Voucher
        </button>
      </div>

      {/* Wallet Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.5rem',
      }}>
        {/* Unredeemed Balance */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>
            Unredeemed Balance
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
            {currentPointsBalance.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Pts</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
            ≈ {formatINR(estimatedBalanceRupees, true)} cash value
          </span>
        </div>

        {/* Realized Cash Received */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Cashed Out
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
            {formatINR(totalCashRealized, true)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {totalPointsRedeemed.toLocaleString()} points redeemed
          </span>
        </div>

        {/* Total Lifetime Points Claimed */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
            Lifetime Points Collected
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#e2e8f0', marginTop: '0.2rem' }}>
            {totalPointsClaimed.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Pts</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {state.claimLogs.length} total check-ins logged
          </span>
        </div>
      </div>

      {/* Redemption History List */}
      <div>
        <h4 style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '0.75rem', fontWeight: 600 }}>
          Redemption History ({redemptions.length})
        </h4>

        {redemptions.length === 0 ? (
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.85rem',
          }}>
            No vouchers or cashouts recorded yet. Click <strong>"Log Cashout / Voucher"</strong> when you redeem points from Nielsen More or Vtion Digital!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {redemptions.map((red) => (
              <div
                key={red.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Gift size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.925rem' }}>
                      {red.appName} — {red.method}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{red.date}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {red.pointsRedeemed.toLocaleString()} points redeemed
                      </span>
                      {red.notes && (
                        <>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{red.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>
                      +{formatINR(red.cashValueRupees, true)}
                    </div>
                    <span className="badge badge-green" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      Claimed
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteRedemption(red.id)}
                    title="Delete entry"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '0.35rem',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#f43f5e')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Redemption Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="card-elevated" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1rem' }}>
              Log Points Redemption / Cashout
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Select App</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => handleAppChange(e.target.value)}
                >
                  {state.rewardApps.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Ratio: {a.pointConversionFormula.points} pts = ₹{a.pointConversionFormula.rupees})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label>Points Redeemed</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={pointsRedeemed}
                    onChange={(e) => handlePointsChange(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label>Cash Received (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={cashValue}
                    onChange={(e) => setCashValue(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label>Payout Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option value="Amazon Pay">Amazon Pay Gift Card</option>
                    <option value="Flipkart Voucher">Flipkart Voucher</option>
                    <option value="UPI Cash">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
                    <option value="Google Play Code">Google Play Code</option>
                    <option value="Other">Other Voucher</option>
                  </select>
                </div>
                <div>
                  <label>Date Received</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label>Notes (Voucher code or order ID, optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Amazon ₹100 voucher code received"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-green">
                  <CheckCircle size={15} /> Save Redemption
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
