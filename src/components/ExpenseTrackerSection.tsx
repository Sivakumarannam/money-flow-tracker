import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Tag } from 'lucide-react';
import type { ExpenseCategory, ExpenseFrequency, ExpenseItem } from '../types';
import { formatINR, normalizeExpense } from '../utils/calculations';

interface ExpenseTrackerSectionProps {
  expenses: ExpenseItem[];
  activePeriod: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onAddExpense: (expense: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseTrackerSection: React.FC<ExpenseTrackerSectionProps> = ({
  expenses,
  activePeriod,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(1500);
  const [frequency, setFrequency] = useState<ExpenseFrequency>('monthly');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Groceries');

  const categories: ExpenseCategory[] = [
    'Food & Groceries',
    'Rent & Housing',
    'Bills & Utilities',
    'Travel & Commute',
    'Shopping',
    'Entertainment',
    'Health & Fitness',
    'Miscellaneous',
  ];

  // Calculate total expense in current period
  const totalInPeriod = expenses.reduce((sum, item) => {
    return sum + normalizeExpense(item.amount, item.frequency)[activePeriod];
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    onAddExpense({
      id: `exp-${Date.now()}`,
      title: title.trim(),
      amount,
      frequency,
      category,
      dateAdded: new Date().toISOString(),
    });

    setTitle('');
    setIsAddOpen(false);
  };

  return (
    <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f43f5e',
          }}>
            <CreditCard size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>
              Expenses & Spending Tracker
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
              Normalized {activePeriod} spending: <strong style={{ color: '#f87171' }}>{formatINR(totalInPeriod, true)}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
        >
          <Plus size={14} /> Add Expense
        </button>
      </div>

      {/* Expenses Table / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {expenses.map((item) => {
          const normalized = normalizeExpense(item.amount, item.frequency);
          const currentPeriodAmount = normalized[activePeriod];

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                }}>
                  <Tag size={15} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.925rem' }}>
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{item.category}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Base: {formatINR(item.amount)}/{item.frequency}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.975rem', fontWeight: 700, color: '#f87171' }}>
                    {formatINR(currentPeriodAmount, true)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {activePeriod} share
                  </div>
                </div>

                <button
                  onClick={() => onDeleteExpense(item.id)}
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
          );
        })}
      </div>

      {/* Add Expense Modal */}
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
          <div className="glass-panel-elevated" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1rem' }}>
              Add New Expense
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Expense Name / Title</label>
                <input
                  type="text"
                  placeholder="e.g. WiFi Bill, Electricity, Dining out..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label>Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <label>Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as ExpenseFrequency)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setIsAddOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
