import React, { useEffect, useState } from 'react';
import { Lock, ShieldCheck, Coins } from 'lucide-react';

const KEY = 'moneyflow_pin_v1';
const PIN_LEN = 6;
const MAX_TRIES = 3;
const LOCK_KEY = 'moneyflow_lock_v1';
const LOCK_SECONDS = 30;

async function sha(text: string): Promise<string> {
  if (window.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 5381; // fallback for non-secure contexts
  for (const c of text) h = ((h << 5) + h + c.charCodeAt(0)) | 0;
  return String(h);
}

function readStored(): { salt: string; hash: string } | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readLock(): { tries: number; until: number } {
  try { return { tries: 0, until: 0, ...JSON.parse(localStorage.getItem(LOCK_KEY) || '{}') }; } catch { return { tries: 0, until: 0 }; }
}
const saveLock = (tries: number, until: number) => localStorage.setItem(LOCK_KEY, JSON.stringify({ tries, until }));

interface Props { onUnlock: () => void; }

export const LockScreen: React.FC<Props> = ({ onUnlock }) => {
  const [stored, setStored] = useState(readStored);
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [tries, setTries] = useState(() => readLock().tries);
  const [wait, setWait] = useState(() => Math.max(0, Math.ceil((readLock().until - Date.now()) / 1000)));
  const setup = !stored;

  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const clean = (v: string) => v.replace(/\D/g, '').slice(0, PIN_LEN);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    if (wait > 0) return;
    if (setup) {
      if (pin.length !== PIN_LEN) return setError(`PIN must be exactly ${PIN_LEN} digits.`);
      if (pin !== confirm) return setError('PINs do not match.');
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(8))).map((b) => b.toString(16)).join('');
      const hash = await sha(salt + pin);
      localStorage.setItem(KEY, JSON.stringify({ salt, hash }));
      setStored({ salt, hash });
      sessionStorage.setItem('mf_unlocked', '1');
      onUnlock();
      return;
    }
    const hash = await sha(stored!.salt + pin);
    if (pin.length === PIN_LEN && hash === stored!.hash) {
      saveLock(0, 0);
      sessionStorage.setItem('mf_unlocked', '1');
      onUnlock();
    } else {
      const n = tries + 1;
      setPin('');
      if (n >= MAX_TRIES) {
        saveLock(0, Date.now() + LOCK_SECONDS * 1000);
        setTries(0); setWait(LOCK_SECONDS); setError('');
      } else {
        saveLock(n, 0);
        setTries(n); setError(`Wrong PIN. ${MAX_TRIES - n} ${MAX_TRIES - n === 1 ? 'try' : 'tries'} left.`);
      }
    }
  };

  return (
    <div className="lock-wrap">
      <form className="lock-card" onSubmit={submit}>
        <div className="lock-logo"><Coins size={28} color="#04121a" /></div>
        <h1>MoneyFlow <span>OS</span></h1>
        <p className="lock-sub">{setup ? 'Create a PIN to protect your money tracker' : 'Enter your PIN to open'}</p>

        <label className="lock-field">
          <Lock size={16} />
          <input type="password" inputMode="numeric" autoComplete="off" autoFocus placeholder={setup ? 'Choose a 6-digit PIN' : 'Enter 6-digit PIN'} maxLength={PIN_LEN}
            value={pin} onChange={(e) => setPin(clean(e.target.value))} disabled={wait > 0} />
        </label>
        {setup && (
          <label className="lock-field">
            <ShieldCheck size={16} />
            <input type="password" inputMode="numeric" autoComplete="off" placeholder="Confirm 6-digit PIN" maxLength={PIN_LEN}
              value={confirm} onChange={(e) => setConfirm(clean(e.target.value))} />
          </label>
        )}

        {(error || wait > 0) && <div className="lock-error">{wait > 0 ? `Locked — try again in ${wait}s` : error}</div>}
        <button type="submit" className="btn-primary lock-btn" disabled={wait > 0 || pin.length !== PIN_LEN || (setup && confirm.length !== PIN_LEN)}>{setup ? 'Set PIN & Open' : 'Unlock'}</button>
        <small className="lock-note">PIN is stored only in this browser (hashed). It keeps casual viewers out; it is not bank-grade security.</small>
      </form>
    </div>
  );
};
