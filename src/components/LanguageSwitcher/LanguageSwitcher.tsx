import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      className={`lang-switcher${compact ? ' lang-switcher--compact' : ''}`}
      role="group"
      aria-label={t.lang.label}
    >
      <button
        type="button"
        className={`lang-btn${lang === 'fr' ? ' active' : ''}`}
        aria-pressed={lang === 'fr'}
        onClick={() => setLang('fr')}
      >
        FR
      </button>
      <span className="lang-sep" aria-hidden="true">|</span>
      <button
        type="button"
        className={`lang-btn${lang === 'en' ? ' active' : ''}`}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
