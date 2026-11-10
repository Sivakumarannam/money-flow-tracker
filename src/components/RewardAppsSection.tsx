import React, { useState } from 'react';
import { Award, CheckCircle2, Edit3, Flame, Plus, Settings2, Sparkles, Trash2, Check, ListOrdered } from 'lucide-react';
import type { RewardApp } from '../types';
import { calculateRewardAppYield, formatINR } from '../utils/calculations';
import { NielsenFormulaModal } from './NielsenFormulaModal';
import { NielsenTiersModal } from './NielsenTiersModal';

interface RewardAppsSectionProps {
  apps: RewardApp[];
  onUpdateApp: (app: RewardApp) => void;
  onAddApp: (app: RewardApp) => void;
  onDeleteApp: (appId: string) => void;
  onClaimApp: (app: RewardApp) => void;
  onUnclaimApp?: (app: RewardApp) => void;
  onQuickRedeem?: (app: RewardApp, points: number, rupees: number) => void;
  todayClaims: { [appId: string]: boolean };
}

export const RewardAppsSection: React.FC<RewardAppsSectionProps> = ({
  apps,
  onUpdateApp,
  onAddApp,
  onDeleteApp,
  onClaimApp,
  onUnclaimApp,
  onQuickRedeem,
  todayClaims,
}) => {
  const [selectedAppForFormula, setSelectedAppForFormula] = useState<RewardApp | null>(null);
  const [isTiersModalOpen, setIsTiersModalOpen] = useState(false);
  const [editingPointsApp, setEditingPointsApp] = useState<RewardApp | null>(null);
  const [tempPoints, setTempPoints] = useState<number>(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New App Form State
  const [newAppName, setNewAppName] = useState('');
  const [newAppFreq, setNewAppFreq] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newAppPts, setNewAppPts] = useState(20);
  const [newAppRatio, setNewAppRatio] = useState(1);
  const [newAppNotes, setNewAppNotes] = useState('');

  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const daysUntilTuesday = (2 - today.getDay() + 7) % 7 || 7;

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newApp: RewardApp = {
      id: `app-${Date.now()}`,
      name: newAppName.trim(),
      frequency: newAppFreq,
      pointsPerCycle: newAppPts,
      currentBalancePoints: 0,
      pointToRupeeRatio: newAppRatio,
      pointConversionFormula: {
        points: 1,
        rupees: newAppRatio,
      },
      ruleDescription: `${newAppPts} points ${newAppFreq} (1 Pt = ₹${newAppRatio})`,
      accentColor: '#a78bfa',
      badge: `${newAppFreq} ${newAppPts} Pts`,
      enabled: true,
      notes: newAppNotes || undefined,
    };

    onAddApp(newApp);
    setIsAddModalOpen(false);
    setNewAppName('');
    setNewAppNotes('');
  };

  const handleSavePoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPointsApp) return;

    const updated = {
      ...editingPointsApp,
      currentBalancePoints: tempPoints,
    };
    onUpdateApp(updated);
    setEditingPointsApp(null);
  };

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fbff', margin: 0 }}>
              Reward Apps & Passive Streams
            </h2>
            <span className="badge badge-green">
              Active Engines
            </span>
          </div>
          <p style={{ color: '#a5b4d4', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            Live balances from your actual app screenshots with exact UPI redemption thresholds
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="btn-secondary"
          style={{ padding: '0.55rem 0.95rem', fontSize: '0.85rem' }}
        >
          <Plus size={15} /> Add Earning App
        </button>
      </div>

      {/* Grid of Reward Apps */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.25rem',
      }}>
        {apps.map((app) => {
          const yields = calculateRewardAppYield(app);
          const isClaimedToday = !!todayClaims[app.id];
          const isVtion = app.id === 'vtion-digital';
          const isNielsen = app.id === 'nielsen-more';

          const currentPts = app.currentBalancePoints || 0;
          const currentCashValue = currentPts * app.pointToRupeeRatio;

          return (
            <div
              key={app.id}
              className="card"
              style={{
                padding: '1.5rem',
                border: app.enabled 
                  ? `1px solid ${app.accentColor}44`
                  : '1px solid rgba(255,255,255, 0.05)',
                opacity: app.enabled ? 1 : 0.6,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header inside Card */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: `${app.accentColor}22`,
                      border: `1px solid ${app.accentColor}55`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: app.accentColor,
                    }}>
                      <Award size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: '#f8fbff', margin: 0 }}>
                        {app.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                        <span className="badge" style={{
                          background: `${app.accentColor}18`,
                          color: app.accentColor,
                          border: `1px solid ${app.accentColor}44`,
                          fontSize: '0.7rem',
                        }}>
                          {isNielsen
                            ? `${currentPts.toLocaleString()} Pts (${formatINR(currentCashValue, true)}) — ₹${Math.floor(currentPts / 1100) * 100} UPI Ready!`
                            : app.badge}
                        </span>
                        {isVtion && isTuesday && (
                          <span className="badge badge-green" style={{ fontSize: '0.7rem', animation: 'pulseSubtle 2s infinite' }}>
                            <Flame size={11} /> Tuesday Credit!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      onClick={() => setSelectedAppForFormula(app)}
                      title="Adjust Conversion Rate"
                      style={{
                        background: 'rgba(255,255,255, 0.05)',
                        border: '1px solid rgba(255,255,255, 0.1)',
                        borderRadius: '8px',
                        color: '#a5b4d4',
                        padding: '0.4rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Settings2 size={15} />
                    </button>

                    {!isNielsen && !isVtion && (
                      <button
                        onClick={() => onDeleteApp(app.id)}
                        title="Delete App"
                        style={{
                          background: 'rgba(255,61,127, 0.1)',
                          border: '1px solid rgba(255,61,127, 0.2)',
                          borderRadius: '8px',
                          color: '#ff3d7f',
                          padding: '0.4rem',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* CURRENT LIVE POINTS & CASH HERO BANNER */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(10,15,35, 0.95) 0%, rgba(26,36,70, 0.7) 100%)',
                  borderRadius: '12px',
                  padding: '0.9rem 1rem',
                  border: `1px solid ${app.accentColor}44`,
                  marginBottom: '1rem',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#a5b4d4', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Current Live App Balance
                      </span>
                      <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fbff', marginTop: '0.15rem' }}>
                        {currentPts.toLocaleString()} <span style={{ fontSize: '0.85rem', color: app.accentColor }}>Points</span>
                      </div>
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#34f5c5' }}>
                        ≈ {formatINR(currentCashValue, true)} Cash Value
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setEditingPointsApp(app);
                        setTempPoints(currentPts);
                      }}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      <Edit3 size={12} /> Edit Pts
                    </button>
                  </div>

                  {/* Nielsen More Specific Milestone & Dynamic Tiers */}
                  {isNielsen && (() => {
                    const nielsenTiers = [
                      { inr: 100, points: 1100 },
                      { inr: 150, points: 1650 },
                      { inr: 200, points: 2200 },
                      { inr: 250, points: 2750 },
                      { inr: 300, points: 3300 },
                      { inr: 350, points: 3850 },
                      { inr: 400, points: 4400 },
                      { inr: 450, points: 4950 },
                      { inr: 500, points: 5500 },
                    ];
                    const highestTier = [...nielsenTiers].reverse().find((t) => currentPts >= t.points);
                    const nextTier = nielsenTiers.find((t) => t.points > currentPts) || nielsenTiers[nielsenTiers.length - 1];
                    const usedPts = highestTier ? highestTier.points : 0;
                    const leftPts = currentPts - usedPts;
                    const ptsNeeded = Math.max(0, nextTier.points - currentPts);
                    const daysNeeded = Math.ceil(ptsNeeded / (app.pointsPerCycle || 50));
                    const progressPercent = Math.min(100, (currentPts / nextTier.points) * 100);

                    return (
                      <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255, 0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: 700 }}>
                            {highestTier
                              ? `🎉 ₹${highestTier.inr} UPI Ready (${usedPts.toLocaleString()} pts used, ${leftPts.toLocaleString()} left)`
                              : `🎯 Goal: ₹${nextTier.inr} (${nextTier.points.toLocaleString()} pts)`}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#a5b4d4' }}>
                            Next: ₹{nextTier.inr} ({nextTier.points.toLocaleString()} pts)
                          </span>
                        </div>

                        {/* Progress bar to next tier */}
                        <div style={{ height: '6px', background: 'rgba(255,255,255, 0.1)', borderRadius: '999px', overflow: 'hidden', marginBottom: '0.65rem' }}>
                          <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            background: 'linear-gradient(90deg, #0891b2, #22d3ee)',
                          }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                          <span style={{ fontSize: '0.72rem', color: '#a5b4d4' }}>
                            {ptsNeeded === 0
                              ? '🎉 Highest tier reached! Ready to redeem.'
                              : `Only ${ptsNeeded.toLocaleString()} pts (${daysNeeded} days) until ₹${nextTier.inr} UPI!`}
                          </span>

                          <button
                            onClick={() => setIsTiersModalOpen(true)}
                            style={{
                              background: 'rgba(34,211,238, 0.15)',
                              border: '1px solid rgba(34,211,238, 0.35)',
                              borderRadius: '8px',
                              color: '#22d3ee',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '0.35rem 0.65rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                            }}
                          >
                            <ListOrdered size={13} /> View UPI Tiers
                          </button>
                        </div>
                      </div>
                    );
                  })()}

                  {/* VTION Specific Milestone from Screenshot 2 */}
                  {isVtion && (
                    <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255, 0.08)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34f5c5', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <CheckCircle2 size={14} /> Ready to Redeem via UPI! (60 / 50 Pts Min Met)
                      </div>
                      <p style={{ color: '#a5b4d4', fontSize: '0.72rem', margin: 0 }}>
                        Points added every Tuesday based on active days in previous week. 1 Point = ₹1.
                      </p>

                      {currentPts >= 50 && onQuickRedeem && (
                        <button
                          onClick={() => onQuickRedeem(app, currentPts, currentPts)}
                          className="btn-green"
                          style={{ width: '100%', marginTop: '0.65rem', padding: '0.45rem', fontSize: '0.8rem' }}
                        >
                          Redeem ₹{currentPts} via UPI Now
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Conversion Ratio Pill */}
                <div style={{
                  background: 'rgba(10,15,35, 0.7)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.825rem',
                  border: '1px solid rgba(255,255,255, 0.06)',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <span style={{ color: '#a5b4d4', fontSize: '0.72rem', display: 'block' }}>Official Ratio</span>
                    <strong style={{ color: '#f1f5ff' }}>
                      {app.pointConversionFormula.points} pts = ₹{app.pointConversionFormula.rupees}
                    </strong>
                    <span style={{ color: '#6b7a99', fontSize: '0.72rem', marginLeft: '0.35rem' }}>
                      (1 pt = ₹{app.pointToRupeeRatio.toFixed(3)})
                    </span>
                  </div>

                  {isNielsen && (
                    <button
                      onClick={() => setSelectedAppForFormula(app)}
                      style={{
                        background: 'rgba(34,211,238, 0.15)',
                        border: '1px solid rgba(34,211,238, 0.3)',
                        borderRadius: '6px',
                        color: '#22d3ee',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '0.3rem 0.6rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Edit3 size={11} /> Edit Formula
                    </button>
                  )}
                </div>

                {/* Calculated Yields Breakdown Matrix */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.4rem',
                  marginBottom: '1.25rem',
                  textAlign: 'center',
                }}>
                  <div style={{ background: 'rgba(255,255,255, 0.02)', padding: '0.5rem 0.25rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7a99', textTransform: 'uppercase' }}>Daily</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5ff', marginTop: '0.1rem' }}>
                      {formatINR(yields.daily.rupees, true)}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#a5b4d4' }}>
                      {Math.round(yields.daily.points * 10) / 10} pts
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255, 0.02)', padding: '0.5rem 0.25rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7a99', textTransform: 'uppercase' }}>Weekly</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5ff', marginTop: '0.1rem' }}>
                      {formatINR(yields.weekly.rupees, true)}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#a5b4d4' }}>
                      {Math.round(yields.weekly.points)} pts
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255, 0.02)', padding: '0.5rem 0.25rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7a99', textTransform: 'uppercase' }}>Monthly</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f1f5ff', marginTop: '0.1rem' }}>
                      {formatINR(yields.monthly.rupees, true)}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#a5b4d4' }}>
                      {Math.round(yields.monthly.points)} pts
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255, 0.02)', padding: '0.5rem 0.25rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: '#6b7a99', textTransform: 'uppercase' }}>Yearly</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#34f5c5', marginTop: '0.1rem' }}>
                      {formatINR(yields.yearly.rupees)}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#8bffe0' }}>
                      {Math.round(yields.yearly.points).toLocaleString()} pts
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Claim / Status Action */}
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255, 0.06)' }}>
                {isClaimedToday ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.75rem',
                    background: 'rgba(20,217,160, 0.1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(20,217,160, 0.25)',
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34f5c5', fontSize: '0.825rem', fontWeight: 600 }}>
                      <CheckCircle2 size={16} /> Claimed Today! (+{app.pointsPerCycle} Pts)
                    </span>
                    {onUnclaimApp && (
                      <button
                        onClick={() => onUnclaimApp(app)}
                        style={{
                          background: 'rgba(255,255,255, 0.08)',
                          border: '1px solid rgba(255,255,255, 0.15)',
                          borderRadius: '6px',
                          color: '#a5b4d4',
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.5rem',
                          cursor: 'pointer',
                        }}
                        title="Revert today's claim"
                      >
                        Undo
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onClaimApp(app)}
                    className={isVtion && !isTuesday ? 'btn-secondary' : 'btn-green'}
                    style={{
                      width: '100%',
                      padding: '0.55rem',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Sparkles size={14} />
                    {isNielsen && `Claim Today's 50 Points`}
                    {isVtion && isTuesday && `Claim Tuesday 10 Points (₹10)`}
                    {isVtion && !isTuesday && `Next Tuesday Credit in ${daysUntilTuesday}d (Manual Log)`}
                    {!isNielsen && !isVtion && `Log +${app.pointsPerCycle} Points`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nielsen Official Tiers Modal */}
      {isTiersModalOpen && (
        <NielsenTiersModal
          currentPoints={apps.find((a) => a.id === 'nielsen-more')?.currentBalancePoints || 2450}
          isOpen={true}
          onClose={() => setIsTiersModalOpen(false)}
          onSelectTier={(pts, inr) => {
            const nielsenApp = apps.find((a) => a.id === 'nielsen-more');
            if (nielsenApp && onQuickRedeem) {
              onQuickRedeem(nielsenApp, pts, inr);
            }
          }}
        />
      )}

      {/* Nielsen / App Formula Modal */}
      {selectedAppForFormula && (
        <NielsenFormulaModal
          app={selectedAppForFormula}
          isOpen={true}
          onClose={() => setSelectedAppForFormula(null)}
          onSave={(pts, rs) => {
            const updated = {
              ...selectedAppForFormula,
              pointToRupeeRatio: rs / pts,
              pointConversionFormula: { points: pts, rupees: rs },
              ruleDescription: `${selectedAppForFormula.pointsPerCycle} points ${selectedAppForFormula.frequency} (${pts} Pts = ₹${rs})`,
            };
            onUpdateApp(updated);
          }}
        />
      )}

      {/* Edit Points Modal */}
      {editingPointsApp && (
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
            <h3 style={{ fontSize: '1.25rem', color: '#f8fbff', marginBottom: '0.4rem' }}>
              Update {editingPointsApp.name} Balance
            </h3>
            <p style={{ color: '#a5b4d4', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
              Enter your current live points from the mobile app
            </p>

            <form onSubmit={handleSavePoints}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label>Current Points</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={tempPoints}
                  onChange={(e) => setTempPoints(Number(e.target.value))}
                  required
                  style={{ fontSize: '1.25rem', fontWeight: 800 }}
                />
                <span style={{ fontSize: '0.75rem', color: '#22d3ee', marginTop: '0.35rem', display: 'block' }}>
                  ≈ {formatINR(tempPoints * editingPointsApp.pointToRupeeRatio, true)} Cash Value
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setEditingPointsApp(null)} className="btn-secondary">
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

      {/* Add Custom App Modal */}
      {isAddModalOpen && (
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
          <div className="card-elevated" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fbff', marginBottom: '1rem' }}>
              Add New Earning / Reward App
            </h3>
            <form onSubmit={handleCreateApp}>
              <div style={{ marginBottom: '1rem' }}>
                <label>App Name</label>
                <input
                  type="text"
                  placeholder="e.g. Google Opinion Rewards, Swagbucks..."
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label>Credit Frequency</label>
                  <select
                    value={newAppFreq}
                    onChange={(e) => setNewAppFreq(e.target.value as any)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label>Points Per Cycle</label>
                  <input
                    type="number"
                    min="1"
                    value={newAppPts}
                    onChange={(e) => setNewAppPts(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Value per 1 Point (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.001"
                  value={newAppRatio}
                  onChange={(e) => setNewAppRatio(Number(e.target.value))}
                  required
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label>Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Redeemed via Amazon Pay or UPI"
                  value={newAppNotes}
                  onChange={(e) => setNewAppNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
