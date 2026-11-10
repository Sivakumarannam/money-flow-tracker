import React from 'react';
import { LayoutDashboard, Wallet, Gift, ArrowLeftRight, Calculator } from 'lucide-react';

export type PageId = 'overview' | 'wealth' | 'rewards' | 'cashflow' | 'planner';

export const PAGES: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} /> },
  { id: 'wealth', label: 'Wealth', icon: <Wallet size={16} /> },
  { id: 'rewards', label: 'Rewards', icon: <Gift size={16} /> },
  { id: 'cashflow', label: 'Cashflow', icon: <ArrowLeftRight size={16} /> },
  { id: 'planner', label: 'Planner', icon: <Calculator size={16} /> },
];

interface Props { active: PageId; onChange: (p: PageId) => void; }

export const PageTabs: React.FC<Props> = ({ active, onChange }) => (
  <nav className="page-tabs" aria-label="Sections">
    {PAGES.map((p) => (
      <button key={p.id} className={`page-tab${active === p.id ? ' active' : ''}`} onClick={() => onChange(p.id)} aria-current={active === p.id ? 'page' : undefined}>
        {p.icon}<span>{p.label}</span>
      </button>
    ))}
  </nav>
);
