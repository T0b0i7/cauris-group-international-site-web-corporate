import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getConsent, saveConsent } from '@/lib/cookies';
import { useLanguage } from '@/context/LanguageContext';

export default function CookieBanner() {
  const { lang } = useLanguage();
  const { pathname } = useRouter();
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const fr = lang === 'fr';

  useEffect(() => { if (!getConsent()) { const t = setTimeout(() => setVisible(true), 800); return () => clearTimeout(t); } }, []);

  if (pathname.startsWith('/admin')) return null;
  if (!visible) return null;

  const acceptAll = () => { saveConsent({ necessary: true, analytics: true, marketing: true }); setVisible(false); };
  const refuseAll = () => { saveConsent({ necessary: true, analytics: false, marketing: false }); setVisible(false); };
  const saveCustom = () => { saveConsent({ necessary: true, analytics, marketing }); setVisible(false); };

  return (
    <div className="cookie-overlay" role="dialog" aria-live="polite" aria-label="cookies">
      <div className="cookie-card">
        <h4>{fr ? 'Nous respectons votre vie privée' : 'We respect your privacy'}</h4>
        <p>
          {fr
            ? 'Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies de mesure et marketing. Voir notre '
            : 'We use strictly necessary cookies and, with your consent, analytics and marketing cookies. See our '}
          <Link href="/privacy">{fr ? 'politique de confidentialité' : 'privacy policy'}</Link>.
        </p>
        {!custom ? (
          <div className="cookie-btns">
            <button className="cookie-btn ghost" onClick={refuseAll}>{fr ? 'Tout refuser' : 'Reject all'}</button>
            <button className="cookie-btn outline" onClick={() => setCustom(true)}>{fr ? 'Personnaliser' : 'Customize'}</button>
            <button className="cookie-btn primary" onClick={acceptAll}>{fr ? 'Tout accepter' : 'Accept all'}</button>
          </div>
        ) : (
          <div className="cookie-custom">
            <label><input type="checkbox" checked disabled /> {fr ? 'Nécessaires (toujours actifs)' : 'Necessary (always on)'}</label>
            <label><input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} /> {fr ? 'Mesure d’audience' : 'Analytics'}</label>
            <label><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> Marketing</label>
            <div className="cookie-btns">
              <button className="cookie-btn ghost" onClick={refuseAll}>{fr ? 'Tout refuser' : 'Reject all'}</button>
              <button className="cookie-btn primary" onClick={saveCustom}>{fr ? 'Enregistrer mes choix' : 'Save choices'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
