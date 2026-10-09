import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher/LanguageSwitcher';
import SideDrawer from '@/components/SideDrawer/SideDrawer';

const MainMenu = ({ onSearch }: { onSearch?: () => void }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleRoute = () => {
      setDrawerOpen(false);
      setBlogOpen(false);
    };
    router.events?.on('routeChangeStart', handleRoute);
    return () => router.events?.off('routeChangeStart', handleRoute);
  }, [router.events]);

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);
  const isBlogActive = router.pathname.startsWith('/blog') || router.pathname.startsWith('/single-blog');

  return (
    <div className={`main_menu nav-pro${scrolled ? ' is-scrolled' : ''}`}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container main-menu-container nav-pro-inner">
          <Link className="navbar-brand logo_h logo-brand nav-pro-brand" href="/" onClick={() => setBlogOpen(false)}>
            <span className="logo-emblem">
              <Image src="/images/logo.jpeg" alt={t.company.short} width={72} height={72} />
            </span>
            <span className="logo-words">
              <span className="logo-main">CAURIS <em>GROUP</em></span>
              <span className="logo-sub">INTERNATIONAL</span>
            </span>
          </Link>

          <div className="collapse navbar-collapse offset desktop-nav" id="navbarSupportedContent">
            <ul className="nav navbar-nav menu_nav ml-auto nav-pro-links">
              <li className={`nav-item${isActive('/') ? ' active' : ''}`}>
                <Link className="nav-link" href="/"><span>{t.nav.home}</span></Link>
              </li>
              <li className={`nav-item${isActive('/about-us') ? ' active' : ''}`}>
                <Link className="nav-link" href="/about-us"><span>{t.nav.about}</span></Link>
              </li>
              <li className={`nav-item${isActive('/services') ? ' active' : ''}`}>
                <Link className="nav-link" href="/services"><span>{t.nav.services}</span></Link>
              </li>
              <li className={`nav-item${isActive('/projects') ? ' active' : ''}`}>
                <Link className="nav-link" href="/projects"><span>{t.nav.projects}</span></Link>
              </li>
              <li className={`nav-item submenu dropdown${blogOpen ? ' show' : ''}${isBlogActive ? ' active' : ''}`}>
                <button
                  type="button"
                  className="nav-link dropdown-toggle btn-reset"
                  aria-haspopup="true"
                  aria-expanded={blogOpen}
                  onClick={() => setBlogOpen((v) => !v)}
                  onMouseEnter={() => setBlogOpen(true)}
                >
                  <span>{t.nav.blog}</span><i className="ti-angle-down nav-caret" aria-hidden="true"></i>
                </button>
                <ul
                  className={`dropdown-menu nav-pro-dropdown${blogOpen ? ' show' : ''}`}
                  onMouseLeave={() => setBlogOpen(false)}
                >
                  <li className="nav-item">
                    <Link className="nav-link" href="/blog" onClick={() => setBlogOpen(false)}>
                      {t.nav.blogOverview}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/single-blog" onClick={() => setBlogOpen(false)}>
                      {t.nav.blogDetails}
                    </Link>
                  </li>
                </ul>
              </li>
              <li className={`nav-item${isActive('/contact') ? ' active' : ''}`}>
                <Link className="nav-link" href="/contact"><span>{t.nav.contact}</span></Link>
              </li>
            </ul>
          </div>

          <div className="right-button nav-pro-actions">
            <ul>
              <li className="lang-desktop">
                <LanguageSwitcher />
              </li>
              <li className="nav-cta-item">
                <Link href="/contact" className="nav-cta">{t.banner.cta}</Link>
              </li>
              <li className="shop-icon nav-icon-btn">
                <a href={`tel:${t.company.phone1.replace(/[^+\d]/g, '')}`} aria-label={t.company.phone1}>
                  <i className="ti-mobile"></i>
                </a>
              </li>
              <li className="nav-icon-btn">
                <button type="button" id="search" className="btn-reset search-btn" onClick={onSearch} aria-label="search">
                  <i className="ti-search"></i>
                </button>
              </li>
              <li className="burger-item">
                <button
                  className="burger-premium"
                  type="button"
                  aria-controls="side-drawer"
                  aria-expanded={drawerOpen}
                  aria-label={t.nav.toggleNavigation}
                  onClick={() => setDrawerOpen(true)}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SideDrawer open={drawerOpen} onClose={closeDrawer} />
    </div>
  )
}

export default MainMenu
