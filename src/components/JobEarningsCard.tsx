import React, { useState } from 'react';
import { Briefcase, Edit3, Check, X } from 'lucide-react';
import type { JobIncome } from '../types';
import { formatINR } from '../utils/calculations';

interface JobEarningsCardProps {
  job: JobIncome;
  onUpdateJob: (job: JobIncome) => void;
}

export const JobEarningsCard: React.FC<JobEarningsCardProps> = ({ job, onUpdateJob }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [salaryInput, setSalaryInput] = useState(job.monthlySalary);
  const [bonusInput, setBonusInput] = useState(job.monthlyBonus);
  const [titleInput, setTitleInput] = useState(job.jobTitle);
  const [companyInput, setCompanyInput] = useState(job.company || '');
  const [workDays, setWorkDays] = useState(job.workDaysPerWeek);

  const baseMonthly = job.enabled ? job.monthlySalary + (job.monthlyBonus || 0) : 0;
  const yearlyTotal = baseMonthly * 12;
  const weeklyWage = yearlyTotal / 52;
  const dailyWage = yearlyTotal / 365;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateJob({
      ...job,
      jobTitle: titleInput,
      company: companyInput,
      monthlySalary: salaryInput,
      monthlyBonus: bonusInput,
      workDaysPerWeek: workDays,
    });
    setIsEditing(false);
  };

  return (
    <div className="card card-blue mb-10" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="section-icon section-icon-blue">
            <Briefcase size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
              Primary Job & Career Earnings
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
              {job.jobTitle} {job.company ? `at ${job.company}` : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
        >
          <Edit3 size={13} /> {isEditing ? 'Cancel' : 'Edit Salary'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
            <div>
              <label>Job Title</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Company / Organization</label>
              <input
                type="text"
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                placeholder="Optional"
              />
            </div>
            <div>
              <label>Base Monthly In-Hand (₹)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={salaryInput}
                onChange={(e) => setSalaryInput(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label>Average Monthly Bonus / Incentive (₹)</label>
              <input
                type="number"
                min="0"
                step="100"
                value={bonusInput}
                onChange={(e) => setBonusInput(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Working Days Per Week</label>
              <input
                type="number"
                min="1"
                max="7"
                value={workDays}
                onChange={(e) => setWorkDays(Number(e.target.value))}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
              <X size={15} /> Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={15} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Daily Equivalent</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
              {formatINR(dailyWage, true)}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Every single day</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Weekly Equivalent</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '0.2rem' }}>
              {formatINR(weeklyWage, true)}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>7-day pace</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Payday</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.2rem' }}>
              {formatINR(baseMonthly)}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Credited on {job.payDay}st</span>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 600 }}>Yearly In-Hand CTC</span>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>
              {formatINR(yearlyTotal)}
            </div>
            <span style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>Annualized income</span>
          </div>
        </div>
      )}
    </div>
  );
};
