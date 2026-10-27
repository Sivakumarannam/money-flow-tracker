import React, { useState } from 'react';
import type { ManualTransaction } from '../types';
import { formatINR } from '../utils/calculations';
import { PlusCircle, MinusCircle, ArrowUpRight, ArrowDownLeft, Trash2, WalletCards } from 'lucide-react';

interface ManualCashflowSectionProps {
  transactions: ManualTransaction[];
  onAddTransaction: (tx: ManualTransaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const ManualCashflowSection: React.FC<ManualCashflowSectionProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  const [type, setType] = useState<'credit' | 'debit'>('credit');
  const [amount, setAmount] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('Salary / Primary Earnings');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');

  const creditCategories = [
    'Salary / Primary Earnings',
    'Reward Apps Payout',
    'Freelance / Gig',
    'Gift / Family Support',
    'Bank Interest / Cashback',
    'Cash Received',
    'Other Credit',
  ];

  const debitCategories = [
    'Food & Dining',
    'Groceries & Daily Items',
    'Rent & Room Expenses',
    'Mobile & WiFi Bills',
    'Travel & Petrol',
    'Shopping & Clothes',
    'Entertainment & Movies',
    'Medical & Health',
    'Other Expense',
  ];

  // Calculate totals
  const totalCredited = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebited = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalCredited - totalDebited;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const chosenCategory = category === 'Other Credit' || category === 'Other Expense'
      ? customCategory.trim() || category
      : category;

    const newTx: ManualTransaction = {
      id: `tx-${Date.now()}`,
      type,
      amount: Number(amount),
      category: chosenCategory,
      date,
      notes: notes.trim() || undefined,
      timestamp: Date.now(),
    };

    onAddTransaction(newTx);
    setAmount('');
    setNotes('');
    setCustomCategory('');
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <section className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.3)',
          }}>
            <WalletCards size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', margin: 0 }}>
                Manual Money Tracker (Added & Debited)
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Quick Cashflow
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              Add money received or record money spent with real-time balance calculations
            </p>
          </div>
        </div>
      </div>

      {/* Net Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.75rem',
      }}>
        {/* Total Added */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}>
            <ArrowUpRight size={16} /> TOTAL MONEY ADDED (CREDIT)
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#34d399', marginTop: '0.25rem' }}>
            +{formatINR(totalCredited, true)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {transactions.filter((t) => t.type === 'credit').length} credit entries
          </span>
        </div>

        {/* Total Debited */}
        <div style={{
          background: 'rgba(244, 63, 94, 0.08)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontSize: '0.75rem', fontWeight: 700 }}>
            <ArrowDownLeft size={16} /> TOTAL MONEY DEBITED (SPENT)
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f87171', marginTop: '0.25rem' }}>
            -{formatINR(totalDebited, true)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {transactions.filter((t) => t.type === 'debit').length} debit entries
          </span>
        </div>

        {/* Net In-Hand Balance */}
        <div style={{
          background: netBalance >= 0 ? 'rgba(56, 189, 248, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: netBalance >= 0 ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
          padding: '1.1rem',
          borderRadius: '14px',
        }}>
          <span style={{ fontSize: '0.75rem', color: netBalance >= 0 ? '#38bdf8' : '#f87171', textTransform: 'uppercase', fontWeight: 700 }}>
            CURRENT NET IN-HAND BALANCE
          </span>
          <div style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: netBalance >= 0 ? '#f8fafc' : '#f87171',
            marginTop: '0.25rem',
          }}>
            {formatINR(netBalance, true)}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            {netBalance >= 0 ? 'Surplus cash remaining' : 'Deficit / overspent'}
          </span>
        </div>
      </div>

      {/* INPUT FORM (CREDIT / DEBIT) */}
      <form onSubmit={handleSubmit} style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: type === 'credit' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.75rem',
        boxShadow: type === 'credit' ? '0 8px 30px rgba(16, 185, 129, 0.1)' : '0 8px 30px rgba(244, 63, 94, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* Credit / Debit Selector Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.4)', padding: '0.35rem', borderRadius: '12px' }}>
            <button
              type="button"
              onClick={() => {
                setType('credit');
                setCategory('Salary / Primary Earnings');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: type === 'credit' ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'transparent',
                color: type === 'credit' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '9px',
                padding: '0.6rem 1.15rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <PlusCircle size={17} /> Add Money (Credit)
            </button>

            <button
              type="button"
              onClick={() => {
                setType('debit');
                setCategory('Food & Dining');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: type === 'debit' ? 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)' : 'transparent',
                color: type === 'debit' ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '9px',
                padding: '0.6rem 1.15rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <MinusCircle size={17} /> Debit Money (Spend)
            </button>
          </div>

          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {type === 'credit' ? 'Record money received into your pocket/bank' : 'Record an expense or payment made'}
          </span>
        </div>

        {/* Form Fields Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          
          {/* Amount Field */}
          <div>
            <label style={{ color: type === 'credit' ? '#34d399' : '#f87171', fontWeight: 700 }}>
              {type === 'credit' ? 'Amount to Add (₹)' : 'Amount Debited (₹)'} *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="0.01"
                step="any"
                placeholder="e.g. 500"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                required
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  paddingLeft: '2.2rem',
                  borderColor: type === 'credit' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)',
                }}
              />
              <span style={{
                position: 'absolute',
                left: '0.9rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 800,
                fontSize: '1.1rem',
                color: type === 'credit' ? '#34d399' : '#f87171',
              }}>
                ₹
              </span>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label>Category / Purpose *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {(type === 'credit' ? creditCategories : debitCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {/* Notes / Description */}
          <div>
            <label>Notes / Description (Optional)</label>
            <input
              type="text"
              placeholder="e.g. UPI transfer from client, Groceries bill..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

        </div>

        {/* Custom Category Input if "Other" is selected */}
        {(category === 'Other Credit' || category === 'Other Expense') && (
          <div style={{ marginBottom: '1rem' }}>
            <label>Specify Custom Category Name</label>
            <input
              type="text"
              placeholder="e.g. Side Gig, Electricity, Movie Tickets..."
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button
            type="submit"
            className={type === 'credit' ? 'btn-emerald' : 'btn-primary'}
            style={{
              padding: '0.75rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: type === 'credit' 
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
                : 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
              borderColor: type === 'credit' ? 'rgba(16, 185, 129, 0.5)' : 'rgba(244, 63, 94, 0.5)',
            }}
          >
            {type === 'credit' ? (
              <>
                <PlusCircle size={18} /> Add Money (+{amount ? formatINR(Number(amount)) : '₹'})
              </>
            ) : (
              <>
                <MinusCircle size={18} /> Record Debited Money (-{amount ? formatINR(Number(amount)) : '₹'})
              </>
            )}
          </button>
        </div>
      </form>

      {/* TRANSACTION HISTORY LEDGER */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f1f5f9', margin: 0 }}>
            Transaction History ({transactions.length})
          </h3>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['all', 'credit', 'debit'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: filter === f ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: filter === f ? '#ffffff' : '#94a3b8',
                  borderRadius: '8px',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {f === 'all' ? 'All Transactions' : f === 'credit' ? 'Added (+)' : 'Debited (-)'}
              </button>
            ))}
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div style={{
            background: 'rgba(15, 23, 42, 0.5)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.875rem',
          }}>
            No manual money entries yet. Use the form above to <strong>Add Money (+)</strong> or record <strong>Debited Money (-)</strong>!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {filteredTransactions.map((tx) => {
              const isCredit = tx.type === 'credit';

              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: isCredit ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: isCredit ? '#34d399' : '#f87171',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {isCredit ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.95rem' }}>
                        {tx.category}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{tx.date}</span>
                        {tx.notes && (
                          <>
                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>•</span>
                            <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{tx.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: isCredit ? '#34d399' : '#f87171',
                        letterSpacing: '-0.02em',
                      }}>
                        {isCredit ? '+' : '-'}{formatINR(tx.amount, true)}
                      </div>
                      <span className="badge" style={{
                        fontSize: '0.65rem',
                        padding: '0.1rem 0.4rem',
                        background: isCredit ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: isCredit ? '#34d399' : '#f87171',
                        border: isCredit ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                      }}>
                        {isCredit ? 'Credit Added' : 'Debited'}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      title="Delete record"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#64748b',
                        cursor: 'pointer',
                        padding: '0.4rem',
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
        )}
      </div>

    </section>
  );
};
