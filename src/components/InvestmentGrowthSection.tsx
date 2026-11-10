import React, { useState } from 'react';
import { TrendingUp, Plus, Trash2, PiggyBank, Sparkles } from 'lucide-react';
import type { InvestmentCategory, InvestmentItem } from '../types';
import { formatINR, projectFutureWealth } from '../utils/calculations';

interface InvestmentGrowthSectionProps {
  investments: InvestmentItem[];
  onAddInvestment: (inv: InvestmentItem) => void;
  onDeleteInvestment: (id: string) => void;
}

export const InvestmentGrowthSection: React.FC<InvestmentGrowthSectionProps> = ({
  investments,
  onAddInvestment,
  onDeleteInvestment,
}) => {
  const [selectedHorizon, setSelectedHorizon] = useState<number>(3); // 1, 3, 5, 10 years
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New investment form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<InvestmentCategory>('Mutual Funds / SIP');
  const [monthlyAmount, setMonthlyAmount] = useState(3000);
  const [currentVal, setCurrentVal] = useState(10000);
  const [returnRate, setReturnRate] = useState(12);

  const categories: InvestmentCategory[] = [
    'Mutual Funds / SIP',
    'Stocks & Equity',
    'Fixed Deposit / RD',
    'Emergency Fund / Savings',
    'Gold & Commodities',
    'Crypto',
    'PPF / EPF',
  ];

  const totalMonthlyInvested = investments.reduce((sum, i) => sum + i.monthlyAmount, 0);
  const totalCurrentPortfolio = investments.reduce((sum, i) => sum + i.currentValue, 0);
  
  // Weighted average annual return rate
  const weightedReturn = investments.length > 0 && totalMonthlyInvested > 0
    ? investments.reduce((sum, i) => sum + (i.expectedAnnualReturn * i.monthlyAmount), 0) / totalMonthlyInvested
    : 12;

  // Projection for entire portfolio
  const portfolioProjection = projectFutureWealth(
    totalCurrentPortfolio,
    totalMonthlyInvested,
    weightedReturn,
    selectedHorizon
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || monthlyAmount < 0) return;

    onAddInvestment({
      id: `inv-${Date.now()}`,
      title: title.trim(),
      category,
      monthlyAmount,
      currentValue: currentVal,
      expectedAnnualReturn: returnRate,
    });

    setTitle('');
    setIsAddOpen(false);
  };

  return (
    <section className="card mb-10" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(167,139,250, 0.15)',
            border: '1px solid rgba(167,139,250, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c4b5fd',
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fbff', margin: 0 }}>
              Investments & Wealth Compounding
            </h3>
            <p style={{ color: '#a5b4d4', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
              Monthly capital deployed: <strong style={{ color: '#c4b5fd' }}>{formatINR(totalMonthlyInvested)}/mo</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
        >
          <Plus size={14} /> Add Investment
        </button>
      </div>

      {/* Projection Simulator Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30,27,75, 0.5) 0%, rgba(10,15,35, 0.9) 100%)',
        border: '1px solid rgba(167,139,250, 0.25)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#c4b5fd" />
            <span style={{ fontWeight: 700, color: '#f1f5ff', fontSize: '0.95rem' }}>
              Compound Wealth Projection
            </span>
            <span style={{ fontSize: '0.75rem', color: '#a5b4d4' }}>
              (~{weightedReturn.toFixed(1)}% p.a. expected growth)
            </span>
          </div>

          {/* Time Horizon Selector */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[1, 3, 5, 10].map((yrs) => (
              <button
                key={yrs}
                onClick={() => setSelectedHorizon(yrs)}
                style={{
                  background: selectedHorizon === yrs ? 'rgba(167,139,250, 0.3)' : 'rgba(255,255,255, 0.05)',
                  border: selectedHorizon === yrs ? '1px solid #c4b5fd' : '1px solid rgba(255,255,255, 0.08)',
                  color: selectedHorizon === yrs ? '#ffffff' : '#a5b4d4',
                  borderRadius: '8px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {yrs} {yrs === 1 ? 'Year' : 'Years'}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          textAlign: 'center',
        }}>
          <div style={{ background: 'rgba(255,255,255, 0.03)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#a5b4d4', textTransform: 'uppercase' }}>Total Contributed</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5ff', marginTop: '0.2rem' }}>
              {formatINR(portfolioProjection.totalInvested)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#6b7a99' }}>Principal invested</span>
          </div>

          <div style={{ background: 'rgba(255,255,255, 0.03)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#34f5c5', textTransform: 'uppercase' }}>Estimated Growth</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34f5c5', marginTop: '0.2rem' }}>
              +{formatINR(portfolioProjection.totalGains)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#8bffe0' }}>Compound interest</span>
          </div>

          <div style={{ background: 'rgba(167,139,250, 0.1)', border: '1px solid rgba(167,139,250, 0.3)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c4b5fd', textTransform: 'uppercase', fontWeight: 700 }}>Projected Portfolio Value</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c4b5fd', marginTop: '0.2rem' }}>
              {formatINR(portfolioProjection.totalWealth)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#ede9fe' }}>In {selectedHorizon} years</span>
          </div>
        </div>
      </div>

      {/* Investment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {investments.map((inv) => (
          <div
            key={inv.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              background: 'rgba(10,15,35, 0.6)',
              border: '1px solid rgba(255,255,255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(167,139,250, 0.15)',
                color: '#c4b5fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <PiggyBank size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5ff', fontSize: '0.925rem' }}>
                  {inv.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a5b4d4' }}>{inv.category}</span>
                  <span style={{ fontSize: '0.72rem', color: '#6b7a99' }}>•</span>
                  <span style={{ fontSize: '0.72rem', color: '#34f5c5' }}>{inv.expectedAnnualReturn}% p.a. expected</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.975rem', fontWeight: 700, color: '#c4b5fd' }}>
                  {formatINR(inv.monthlyAmount)}/mo
                </div>
                <div style={{ fontSize: '0.7rem', color: '#a5b4d4' }}>
                  Current: {formatINR(inv.currentValue)}
                </div>
              </div>

              <button
                onClick={() => onDeleteInvestment(inv.id)}
                title="Remove"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#6b7a99',
                  cursor: 'pointer',
                  padding: '0.35rem',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff3d7f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7a99')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Investment Modal */}
      {isAddOpen && (
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
            <h3 style={{ fontSize: '1.25rem', color: '#f8fbff', marginBottom: '1rem' }}>
              Add New Investment
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Investment Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nifty 50 Index SIP, Sovereign Gold Bond..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InvestmentCategory)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label>Monthly Deposit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label>Expected Return (% p.a.)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label>Current Portfolio Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={currentVal}
                  onChange={(e) => setCurrentVal(Number(e.target.value))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Investment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
