import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SideDrawer({ open, onClose }: Props) {
  const { t } = useLanguage();
  const router = useRouter();
  const panelRef = useRef<HTMLElement>(null);
  const [blogOpen, setBlogOpen] = React.useState(false);

  useEffect(() => {
    if (!open) return;
    setBlogOpen(router.pathname.startsWith('/blog') || router.pathname.startsWith('/single-blog'));
    const el = panelRef.current?.querySelector<HTMLButtonElement>('.side-close');
    el?.focus();
  }, [open, router.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    const h = () => onClose();
    router.events?.on('routeChangeStart', h);
    return () => router.events?.off('routeChangeStart', h);
  }, [router.events, onClose]);

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  const links = [
    { n: '01', href: '/', label: t.nav.home },
    { n: '02', href: '/about-us', label: t.nav.about },
    { n: '03', href: '/services', label: t.nav.services },
    { n: '04', href: '/projects', label: t.nav.projects },
    { n: '06', href: '/contact', label: t.nav.contact },
  ];

  return (
    <>
      <div
        className={`side-overlay${open ? ' show' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        ref={panelRef}
        className={`side-drawer${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-label={t.nav.toggleNavigation}
      >
        <div className="side-head">
          <span className="side-brand">CAURIS <em>GROUP</em></span>
          <button type="button" className="side-close" onClick={onClose} aria-label="Close">
            <span /><span />
          </button>
        </div>

        <nav className="side-nav">
          {links.slice(0, 4).map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              tabIndex={open ? 0 : -1}
              className={`side-link${isActive(l.href) ? ' active' : ''}`}
              style={{ transitionDelay: open ? `${80 + i * 55}ms` : '0ms' }}
            >
              <span className="side-num">{l.n}</span>
              <span className="side-label">{l.label}</span>
              <span className="side-arrow">→</span>
            </Link>
          ))}

          <div className={`side-group${blogOpen ? ' expanded' : ''}`}>
            <button
              type="button"
              className={`side-link side-acc${router.pathname.startsWith('/blog') || router.pathname.startsWith('/single-blog') ? ' active' : ''}`}
              style={{ transitionDelay: open ? '300ms' : '0ms' }}
              aria-expanded={blogOpen}
              onClick={() => setBlogOpen(v => !v)}
              tabIndex={open ? 0 : -1}
            >
              <span className="side-num">05</span>
              <span className="side-label">{t.nav.blog}</span>
              <span className={`side-chev${blogOpen ? ' up' : ''}`}>⌄</span>
            </button>
            <div className="side-sub">
              <Link href="/blog" onClick={onClose} tabIndex={open && blogOpen ? 0 : -1}>{t.nav.blogOverview}</Link>
              <Link href="/single-blog" onClick={onClose} tabIndex={open && blogOpen ? 0 : -1}>{t.nav.blogDetails}</Link>
            </div>
          </div>

          <Link
            href="/contact"
            onClick={onClose}
            tabIndex={open ? 0 : -1}
            className={`side-link${isActive('/contact') ? ' active' : ''}`}
            style={{ transitionDelay: open ? '355ms' : '0ms' }}
          >
            <span className="side-num">06</span>
            <span className="side-label">{t.nav.contact}</span>
            <span className="side-arrow">→</span>
          </Link>
        </nav>

        <div className="side-foot">
          <Link className="side-cta" href="/contact" onClick={onClose} tabIndex={open ? 0 : -1}>
            {t.banner.cta}
          </Link>
          <div className="side-meta">
            <LanguageSwitcher compact />
            <a className="side-phone" href={`tel:${t.company.phone1.replace(/[^+\d]/g, '')}`}>{t.company.phone1}</a>
          </div>
        </div>
      </aside>
    </>
  );
}
