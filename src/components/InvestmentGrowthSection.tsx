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
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#c084fc',
          }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
              Investments & Wealth Compounding
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
              Monthly capital deployed: <strong style={{ color: '#c084fc' }}>{formatINR(totalMonthlyInvested)}/mo</strong>
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
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#c084fc" />
            <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>
              Compound Wealth Projection
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
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
                  background: selectedHorizon === yrs ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  border: selectedHorizon === yrs ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedHorizon === yrs ? '#ffffff' : '#94a3b8',
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
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Total Contributed</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f1f5f9', marginTop: '0.2rem' }}>
              {formatINR(portfolioProjection.totalInvested)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Principal invested</span>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase' }}>Estimated Growth</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              +{formatINR(portfolioProjection.totalGains)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7' }}>Compound interest</span>
          </div>

          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.85rem', borderRadius: '10px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700 }}>Projected Portfolio Value</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>
              {formatINR(portfolioProjection.totalWealth)}
            </div>
            <span style={{ fontSize: '0.7rem', color: '#e9d5ff' }}>In {selectedHorizon} years</span>
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
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <PiggyBank size={16} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.925rem' }}>
                  {inv.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{inv.category}</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                  <span style={{ fontSize: '0.72rem', color: '#34d399' }}>{inv.expectedAnnualReturn}% p.a. expected</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.975rem', fontWeight: 700, color: '#c084fc' }}>
                  {formatINR(inv.monthlyAmount)}/mo
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Current: {formatINR(inv.currentValue)}
                </div>
              </div>

              <button
                onClick={() => onDeleteInvestment(inv.id)}
                title="Remove"
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

      {/* Add Investment Modal */}
      {isAddOpen && (
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
          <div className="card-elevated" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1rem' }}>
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
