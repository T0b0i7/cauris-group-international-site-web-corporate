export type CookiePrefs = { necessary: true; analytics: boolean; marketing: boolean; date: string };
const KEY = 'cauris_cookie_consent_v1';
export function getConsent(): CookiePrefs | null {
  if (typeof window === 'undefined') return null;
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}
export function saveConsent(p: Omit<CookiePrefs, 'date'>) {
  const v: CookiePrefs = { ...p, date: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {}
  return v;
}
export function clearConsent() { try { localStorage.removeItem(KEY); } catch {} }
