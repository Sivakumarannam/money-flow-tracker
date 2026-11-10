import { useState, useEffect, useRef } from 'react';
import type { AppState, BankAccount, CryptoHolding, DailyClaimLog, DigitalGoldHolding, ExpenseItem, InvestmentItem, JobIncome, ManualTransaction, RedemptionLog, RewardApp } from './types';
import { INITIAL_STATE } from './data/defaults';
import { formatINR, getTimeframeSummary } from './utils/calculations';
import { exportFullDataCsv } from './utils/exportCsv';

// Components
import { Header } from './components/Header';
import { TodayClaimWidget } from './components/TodayClaimWidget';
import { LiveGoldAssetSection } from './components/LiveGoldAssetSection';
import { CryptoWalletSection } from './components/CryptoWalletSection';
import { AttendanceCalendar } from './components/AttendanceCalendar';
import { TimeframeTabs } from './components/TimeframeTabs';
import { MetricCards } from './components/MetricCards';
import { ManualCashflowSection } from './components/ManualCashflowSection';
import { DetailedCalculationMatrix } from './components/DetailedCalculationMatrix';
import { ProjectionsVisualizer } from './components/ProjectionsVisualizer';
import { PassiveIncomeSimulator } from './components/PassiveIncomeSimulator';
import { RewardAppsSection } from './components/RewardAppsSection';
import { RedemptionWalletSection } from './components/RedemptionWalletSection';
import { JobEarningsCard } from './components/JobEarningsCard';
import { ExpenseTrackerSection } from './components/ExpenseTrackerSection';
import { InvestmentGrowthSection } from './components/InvestmentGrowthSection';
import { ZeroInvestmentGuideModal } from './components/ZeroInvestmentGuideModal';
import { GamingPcGoalCard } from './components/GamingPcGoalCard';
import { GamingPcSetupModal } from './components/GamingPcSetupModal';
import { PageTabs, PAGES } from './components/PageTabs';
import type { PageId } from './components/PageTabs';

const STORAGE_KEY = 'moneyflow_app_state_real_v9';

export function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const todayDateStr = new Date().toISOString().split('T')[0];
      let saved = localStorage.getItem(STORAGE_KEY);
      let isFallback = false;
      if (!saved) {
        saved = localStorage.getItem('moneyflow_app_state_real_v8');
        isFallback = true;
      }

      if (saved) {
        const parsed = JSON.parse(saved);

        // If migrating from v8 and nielsen was 2450 but had today's claim log, clean it up so user can click Claim fresh
        let cleanClaimLogs = parsed.claimLogs || [];
        if (isFallback) {
          const nielsenSaved = (parsed.rewardApps || []).find((a: any) => a.id === 'nielsen-more');
          if (nielsenSaved && nielsenSaved.currentBalancePoints === 2450) {
            cleanClaimLogs = cleanClaimLogs.filter(
              (log: any) => !(log.appId === 'nielsen-more' && log.date === todayDateStr)
            );
          }
        }

        const loadedTxs = parsed.manualTransactions || INITIAL_STATE.manualTransactions || [];
        const syncedBankBalance = loadedTxs.length > 0
          ? loadedTxs.reduce((sum: number, t: any) => sum + (t.type === 'credit' ? Number(t.amount) : -Number(t.amount)), 0)
          : (parsed.bankAccount?.balance ?? INITIAL_STATE.bankAccount.balance);

        const loadedBankAccount = {
          ...(parsed.bankAccount || INITIAL_STATE.bankAccount),
          balance: syncedBankBalance,
        };

        // Clean out deprecated Brave BAT and ensure SolPick and Pi Network are included
        const cleanedHoldings = (parsed.cryptoHoldings || [])
          .filter((h: any) => h.id !== 'crypto-brave-bat');

        const mergedHoldings = [
          ...cleanedHoldings,
          ...(INITIAL_STATE.cryptoHoldings || []).filter(
            (initH) => !cleanedHoldings.some((ex: any) => ex.id === initH.id)
          ),
        ];

        // Ensure Pi Network Coin reflects CoinGecko market rate (₹6/PI)
        const syncedHoldings = mergedHoldings.map((h: any) => {
          if (h.id === 'crypto-pi-network' && (h.currentPriceInr === 3100 || !h.currentPriceInr || h.currentPriceInr > 50)) {
            const piBal = h.balance || 125.5;
            return {
              ...h,
              balance: piBal,
              currentPriceInr: 6,
              valueInr: Number((piBal * 6).toFixed(2)),
              notes: 'Pi Network non-custodial wallet (Pi Browser). CoinGecko market rate: ₹6.00/PI.',
            };
          }
          return h;
        });

        // Filter out Pawns.app from cached reward apps and sync Pi Network rate to ₹6
        const savedRewardApps = (parsed.rewardApps || [])
          .filter((a: any) => a.id !== 'pawns-app' && a.id !== 'pawns-bandwidth');

        const syncedRewardApps = INITIAL_STATE.rewardApps.map((initApp) => {
          const existing = savedRewardApps.find((a: any) => a.id === initApp.id);
          if (initApp.id === 'pi-network') {
            const piBal = existing?.currentBalancePoints ?? initApp.currentBalancePoints;
            return {
              ...initApp,
              ...(existing || {}),
              pointToRupeeRatio: 6.0,
              pointConversionFormula: { points: 1, rupees: 6 },
              currentBalancePoints: piBal,
              badge: `${piBal} PI (₹${(piBal * 6).toFixed(2)})`,
            };
          }
          return existing ? { ...initApp, ...existing } : initApp;
        });

        return {
          ...INITIAL_STATE,
          ...parsed,
          claimLogs: cleanClaimLogs,
          bankAccount: loadedBankAccount,
          cryptoHoldings: syncedHoldings,
          rewardApps: syncedRewardApps,
          manualTransactions: loadedTxs,
        };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return INITIAL_STATE;
  });

  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isZeroGuideOpen, setIsZeroGuideOpen] = useState(false);
  const [isGamingPcOpen, setIsGamingPcOpen] = useState(false);
  const [page, setPageState] = useState<PageId>(() => {
    const h = window.location.hash.slice(1) as PageId;
    return PAGES.some((x) => x.id === h) ? h : 'overview';
  });
  const setPage = (p: PageId) => {
    setPageState(p);
    window.location.hash = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleAddAppFromGuide = (newApp: RewardApp) => {
    if (state.rewardApps.some((a) => a.id === newApp.id)) {
      showToast(`${newApp.name} is already in your tracker!`);
      return;
    }
    setState((prev) => ({
      ...prev,
      rewardApps: [...prev.rewardApps, newApp],
    }));
    showToast(`✅ Added ${newApp.name} to your reward tracker!`);
  };

  // Today claims map
  const todayStr = new Date().toISOString().split('T')[0];
  const todayClaims: { [appId: string]: boolean } = {};
  state.claimLogs.forEach((log) => {
    if (log.date === todayStr) {
      todayClaims[log.appId] = true;
    }
  });

  // Claim handler
  const handleClaimApp = (app: RewardApp) => {
    if (todayClaims[app.id]) {
      showToast(`${app.name} is already claimed today!`);
      return;
    }

    const earnedRupees = app.pointsPerCycle * app.pointToRupeeRatio;
    const newLog: DailyClaimLog = {
      id: `claim-${Date.now()}`,
      date: todayStr,
      appId: app.id,
      appName: app.name,
      points: app.pointsPerCycle,
      rupees: earnedRupees,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      rewardApps: prev.rewardApps.map((a) =>
        a.id === app.id
          ? {
              ...a,
              currentBalancePoints: Number(((a.currentBalancePoints || 0) + app.pointsPerCycle).toFixed(4)),
            }
          : a
      ),
      claimLogs: [newLog, ...prev.claimLogs],
    }));

    showToast(`🎉 Claimed +${app.pointsPerCycle} points (${app.name})!`);
  };

  // Unclaim handler
  const handleUnclaimApp = (app: RewardApp) => {
    setState((prev) => ({
      ...prev,
      rewardApps: prev.rewardApps.map((a) =>
        a.id === app.id
          ? {
              ...a,
              currentBalancePoints: Math.max(0, Number(((a.currentBalancePoints || 0) - app.pointsPerCycle).toFixed(4))),
            }
          : a
      ),
      claimLogs: prev.claimLogs.filter((log) => !(log.appId === app.id && log.date === todayStr)),
    }));

    showToast(`↩️ Reverted today's claim (-${app.pointsPerCycle} pts on ${app.name})`);
  };

  // Update App
  const handleUpdateApp = (updatedApp: RewardApp) => {
    setState((prev) => ({
      ...prev,
      rewardApps: prev.rewardApps.map((a) => (a.id === updatedApp.id ? updatedApp : a)),
    }));
    showToast(`Updated ${updatedApp.name} conversion settings!`);
  };

  // Add App
  const handleAddApp = (newApp: RewardApp) => {
    setState((prev) => ({
      ...prev,
      rewardApps: [...prev.rewardApps, newApp],
    }));
    showToast(`Added ${newApp.name}!`);
  };

  // Delete App
  const handleDeleteApp = (appId: string) => {
    setState((prev) => ({
      ...prev,
      rewardApps: prev.rewardApps.filter((a) => a.id !== appId),
    }));
    showToast('App removed.');
  };

  // Job Update
  const handleUpdateJob = (updatedJob: JobIncome) => {
    setState((prev) => ({
      ...prev,
      jobIncome: updatedJob,
    }));
    showToast('Job earnings updated.');
  };

  // Expense Handlers
  const handleAddExpense = (expense: ExpenseItem) => {
    setState((prev) => ({
      ...prev,
      expenses: [...prev.expenses, expense],
    }));
    showToast(`Added ${expense.title}`);
  };

  const handleDeleteExpense = (id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
    showToast('Expense removed.');
  };

  // Investment Handlers
  const handleAddInvestment = (inv: InvestmentItem) => {
    setState((prev) => ({
      ...prev,
      investments: [...prev.investments, inv],
    }));
    showToast(`Added ${inv.title}`);
  };

  const handleDeleteInvestment = (id: string) => {
    setState((prev) => ({
      ...prev,
      investments: prev.investments.filter((i) => i.id !== id),
    }));
    showToast('Investment removed.');
  };

  // Toggle / backfill claim date
  const handleToggleClaimDate = (dateStr: string, app: RewardApp) => {
    const earnedRupees = app.pointsPerCycle * app.pointToRupeeRatio;
    const newLog: DailyClaimLog = {
      id: `claim-${Date.now()}`,
      date: dateStr,
      appId: app.id,
      appName: app.name,
      points: app.pointsPerCycle,
      rupees: earnedRupees,
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      claimLogs: [newLog, ...prev.claimLogs],
    }));

    showToast(`Logged +${app.pointsPerCycle} pts on ${dateStr} (${app.name})!`);
  };

  // Manual Money (Credit / Debit) Handlers
  const handleAddTransaction = (tx: ManualTransaction) => {
    setState((prev) => {
      const updatedTxs = [tx, ...(prev.manualTransactions || [])];
      const newBalance = updatedTxs.reduce(
        (sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount),
        0
      );
      return {
        ...prev,
        manualTransactions: updatedTxs,
        bankAccount: {
          ...(prev.bankAccount || INITIAL_STATE.bankAccount),
          balance: newBalance,
          lastUpdated: new Date().toISOString(),
        },
      };
    });
    showToast(`${tx.type === 'credit' ? '➕ Added' : '➖ Debited'} ${formatINR(tx.amount, true)}`);
  };

  const handleDeleteTransaction = (id: string) => {
    setState((prev) => {
      const updatedTxs = (prev.manualTransactions || []).filter((t) => t.id !== id);
      const newBalance = updatedTxs.reduce(
        (sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount),
        0
      );
      return {
        ...prev,
        manualTransactions: updatedTxs,
        bankAccount: {
          ...(prev.bankAccount || INITIAL_STATE.bankAccount),
          balance: newBalance,
          lastUpdated: new Date().toISOString(),
        },
      };
    });
    showToast('Transaction removed.');
  };

  // Quick Redeem Handler (Deducts points, creates redemption record, and credits in-hand balance!)
  const handleQuickRedeem = (app: RewardApp, points: number, rupees: number) => {
    const updatedApps = state.rewardApps.map((a) => {
      if (a.id === app.id) {
        return {
          ...a,
          currentBalancePoints: Math.max(0, (a.currentBalancePoints || 0) - points),
        };
      }
      return a;
    });

    const newRedemption: RedemptionLog = {
      id: `red-${Date.now()}`,
      appId: app.id,
      appName: app.name,
      pointsRedeemed: points,
      cashValueRupees: rupees,
      method: 'UPI Transfer',
      date: todayStr,
      notes: `Redeemed ${points} points for ₹${rupees} UPI`,
      timestamp: Date.now(),
    };

    const newCreditTx: ManualTransaction = {
      id: `tx-red-${Date.now()}`,
      type: 'credit',
      amount: rupees,
      category: 'Reward Apps Payout',
      date: todayStr,
      notes: `UPI Payout from ${app.name} (${points} pts)`,
      timestamp: Date.now(),
    };

    setState((prev) => {
      const updatedTxs = [newCreditTx, ...(prev.manualTransactions || [])];
      const newBalance = updatedTxs.reduce(
        (sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount),
        0
      );
      return {
        ...prev,
        rewardApps: updatedApps,
        redemptions: [newRedemption, ...(prev.redemptions || [])],
        manualTransactions: updatedTxs,
        bankAccount: {
          ...(prev.bankAccount || INITIAL_STATE.bankAccount),
          balance: newBalance,
          lastUpdated: new Date().toISOString(),
        },
      };
    });

    showToast(`🎉 Redeemed ${formatINR(rupees, true)} via UPI! Credited to wallet!`);
  };

  // Redemption Handlers
  const handleAddRedemption = (redemption: RedemptionLog) => {
    setState((prev) => ({
      ...prev,
      redemptions: [redemption, ...(prev.redemptions || [])],
    }));
    showToast(`🎉 Logged ${formatINR(redemption.cashValueRupees, true)} redemption!`);
  };

  const handleDeleteRedemption = (id: string) => {
    setState((prev) => ({
      ...prev,
      redemptions: (prev.redemptions || []).filter((r) => r.id !== id),
    }));
    showToast('Redemption record removed.');
  };

  // Bank Account & Gold Handlers
  const handleUpdateBank = (newBank: BankAccount) => {
    setState((prev) => {
      const currentNet = (prev.manualTransactions || []).reduce(
        (sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount),
        0
      );
      const diff = newBank.balance - currentNet;

      let updatedTxs = [...(prev.manualTransactions || [])];
      const initialTxIndex = updatedTxs.findIndex((t) => t.id === 'tx-initial-bank');
      if (initialTxIndex !== -1) {
        updatedTxs[initialTxIndex] = {
          ...updatedTxs[initialTxIndex],
          amount: Math.max(0, updatedTxs[initialTxIndex].amount + diff),
        };
      } else if (diff !== 0) {
        updatedTxs = [
          {
            id: `tx-adj-${Date.now()}`,
            type: diff >= 0 ? 'credit' : 'debit',
            amount: Math.abs(diff),
            category: 'Bank Account Balance',
            date: new Date().toISOString().split('T')[0],
            notes: 'Bank Balance Adjustment',
            timestamp: Date.now(),
          },
          ...updatedTxs,
        ];
      }

      return {
        ...prev,
        bankAccount: newBank,
        manualTransactions: updatedTxs,
      };
    });
    showToast(`Bank balance updated: ${formatINR(newBank.balance, true)}`);
  };

  const handleUpdateGold = (newGold: DigitalGoldHolding) => {
    setState((prev) => ({
      ...prev,
      goldHolding: newGold,
    }));
  };

  // Crypto Handlers
  const handleUpdateCrypto = (updated: CryptoHolding) => {
    setState((prev) => ({
      ...prev,
      cryptoHoldings: (prev.cryptoHoldings || INITIAL_STATE.cryptoHoldings || []).map((h) =>
        h.id === updated.id ? updated : h
      ),
    }));
    showToast(`Updated ${updated.name} valuation!`);
  };

  const handleAddCrypto = (newHolding: CryptoHolding) => {
    setState((prev) => ({
      ...prev,
      cryptoHoldings: [...(prev.cryptoHoldings || INITIAL_STATE.cryptoHoldings || []), newHolding],
    }));
    showToast(`Added ${newHolding.name} to Crypto portfolio!`);
  };

  const handleDeleteCrypto = (id: string) => {
    setState((prev) => ({
      ...prev,
      cryptoHoldings: (prev.cryptoHoldings || INITIAL_STATE.cryptoHoldings || []).filter((h) => h.id !== id),
    }));
    showToast('Coin holding removed.');
  };

  // Export CSV Report
  const handleExportCsv = () => {
    exportFullDataCsv({
      ...state,
      bankAccount: syncedBankAccount,
    });
    showToast('Excel CSV report downloaded!');
  };

  // Export JSON Backup
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `moneyflow-backup-${todayStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Backup JSON downloaded successfully!');
  };

  // Import JSON Backup
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.rewardApps && imported.jobIncome && imported.expenses) {
          setState(imported);
          showToast('Data imported successfully!');
        } else {
          alert('Invalid file format. Please upload a valid MoneyFlow backup file.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset to Defaults
  const handleReset = () => {
    if (window.confirm('Reset all values to initial defaults? Current data will be replaced.')) {
      setState(INITIAL_STATE);
      showToast('Reset to defaults.');
    }
  };

  // Active Period Summary
  const currentSummary = getTimeframeSummary(state, activePeriod);

  // Synchronized real-time bank balance derived from manual credit/debit transactions
  const netInHandBalance = (state.manualTransactions && state.manualTransactions.length > 0)
    ? state.manualTransactions.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0)
    : (state.bankAccount?.balance ?? 1921);

  const syncedBankAccount: BankAccount = {
    ...(state.bankAccount || INITIAL_STATE.bankAccount),
    balance: netInHandBalance,
  };

  const nielsenApp = state.rewardApps.find((a) => a.id === 'nielsen-more');
  const vtionApp = state.rewardApps.find((a) => a.id === 'vtion-digital');
  const nielsenCashVal = (nielsenApp?.currentBalancePoints || 0) * (nielsenApp?.pointToRupeeRatio || 0.0909);
  const vtionCashVal = (vtionApp?.currentBalancePoints || 0) * (vtionApp?.pointToRupeeRatio || 1);

  const currentCryptoHoldings = state.cryptoHoldings || INITIAL_STATE.cryptoHoldings || [];
  const totalCryptoVal = currentCryptoHoldings.reduce(
    (sum, h) => sum + (h.valueInr || h.balance * h.currentPriceInr),
    0
  );

  const totalNetWealth = Math.round(
    (netInHandBalance + (state.goldHolding?.currentValue || 24.8) + totalCryptoVal + nielsenCashVal + vtionCashVal) * 100
  ) / 100;

  return (
    <div className="app-container">
      
      {/* Hidden File Input for Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        style={{ display: 'none' }}
      />

      {/* Header */}
      <Header
        onExport={handleExport}
        onExportCsv={handleExportCsv}
        onImport={handleImportClick}
        onReset={handleReset}
        onOpenZeroGuide={() => setIsZeroGuideOpen(true)}
        onOpenGamingPc={() => setIsGamingPcOpen(true)}
      />

      <PageTabs active={page} onChange={setPage} />

      <main className="page" key={page}>
      {page === 'overview' && (
        <>
          <TodayClaimWidget
            apps={state.rewardApps}
            todayClaims={todayClaims}
            onClaim={handleClaimApp}
            onUnclaim={handleUnclaimApp}
            recentLogs={state.claimLogs.slice(0, 5)}
          />
          <TimeframeTabs activePeriod={activePeriod} onChange={setActivePeriod} />
          <MetricCards summary={currentSummary} />
          <GamingPcGoalCard currentWealth={totalNetWealth} onOpenModal={() => setIsGamingPcOpen(true)} />
          <ProjectionsVisualizer summary={currentSummary} />
        </>
      )}

      {page === 'wealth' && (
        <>
          <LiveGoldAssetSection
            bankAccount={syncedBankAccount}
            goldHolding={state.goldHolding || INITIAL_STATE.goldHolding}
            cryptoTotalInr={totalCryptoVal}
            nielsenCashValue={nielsenCashVal}
            vtionCashValue={vtionCashVal}
            nielsenPoints={nielsenApp?.currentBalancePoints || 2450}
            vtionPoints={vtionApp?.currentBalancePoints || 60}
            onUpdateBank={handleUpdateBank}
            onUpdateGold={handleUpdateGold}
            onOpenZeroGuide={() => setIsZeroGuideOpen(true)}
          />
          <CryptoWalletSection
            holdings={currentCryptoHoldings}
            onUpdateHolding={handleUpdateCrypto}
            onAddHolding={handleAddCrypto}
            onDeleteHolding={handleDeleteCrypto}
            onOpenZeroGuide={() => setIsZeroGuideOpen(true)}
          />
          <InvestmentGrowthSection
            investments={state.investments}
            onAddInvestment={handleAddInvestment}
            onDeleteInvestment={handleDeleteInvestment}
          />
        </>
      )}

      {page === 'rewards' && (
        <>
          <RewardAppsSection
            apps={state.rewardApps}
            onUpdateApp={handleUpdateApp}
            onAddApp={handleAddApp}
            onDeleteApp={handleDeleteApp}
            onClaimApp={handleClaimApp}
            onUnclaimApp={handleUnclaimApp}
            onQuickRedeem={handleQuickRedeem}
            todayClaims={todayClaims}
          />
          <AttendanceCalendar state={state} onToggleClaimDate={handleToggleClaimDate} />
          <RedemptionWalletSection
            state={state}
            onAddRedemption={handleAddRedemption}
            onDeleteRedemption={handleDeleteRedemption}
          />
        </>
      )}

      {page === 'cashflow' && (
        <>
          <TimeframeTabs activePeriod={activePeriod} onChange={setActivePeriod} />
          <ManualCashflowSection
            transactions={state.manualTransactions || []}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
          <JobEarningsCard job={state.jobIncome} onUpdateJob={handleUpdateJob} />
          <ExpenseTrackerSection
            expenses={state.expenses}
            activePeriod={activePeriod}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        </>
      )}

      {page === 'planner' && (
        <>
          <div className="planner-grid">
            <div className="planner-col"><DetailedCalculationMatrix state={state} /></div>
            <div className="planner-col"><PassiveIncomeSimulator state={state} /></div>
          </div>
        </>
      )}
      </main>

      {/* Footer Info */}
      <footer className="app-footer">
        <p>
          <strong style={{ color: 'var(--text-secondary)' }}>MoneyFlow OS</strong> — Built for personal wealth tracking: Nielsen More, Vtion Digital, salary &amp; investment planning.
        </p>
        <p>All data is saved locally on your browser in real-time. Use Export anytime for offline backup.</p>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

      {/* 2026 Zero-Investment Earning Blueprint Modal */}
      <ZeroInvestmentGuideModal
        isOpen={isZeroGuideOpen}
        onClose={() => setIsZeroGuideOpen(false)}
        onAddAppToTracker={handleAddAppFromGuide}
        existingAppIds={state.rewardApps.map((a) => a.id)}
      />

      {/* Complete Pro Gaming PC Setup Blueprint Modal */}
      <GamingPcSetupModal
        isOpen={isGamingPcOpen}
        onClose={() => setIsGamingPcOpen(false)}
        currentNetWealth={totalNetWealth}
      />

    </div>
  );
}

export default App;
