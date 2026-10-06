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

  const closeDrawer = () => setDrawerOpen(false);

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
    <div className="main_menu">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container main-menu-container">
          <Link className="navbar-brand logo_h logo-brand" href="/" onClick={() => setBlogOpen(false)}>
            <span className="logo-emblem">
              <Image src="/images/logo.jpeg" alt={t.company.short} width={72} height={72} />
            </span>
            <span className="logo-words">
              <span className="logo-main">CAURIS <em>GROUP</em></span>
              <span className="logo-sub">INTERNATIONAL</span>
            </span>
          </Link>

          <div className="collapse navbar-collapse offset desktop-nav" id="navbarSupportedContent">
            <ul className="nav navbar-nav menu_nav ml-auto">
              <li className={`nav-item${isActive('/') ? ' active' : ''}`}>
                <Link className="nav-link" href="/">{t.nav.home}</Link>
              </li>
              <li className={`nav-item${isActive('/about-us') ? ' active' : ''}`}>
                <Link className="nav-link" href="/about-us">{t.nav.about}</Link>
              </li>
              <li className={`nav-item${isActive('/services') ? ' active' : ''}`}>
                <Link className="nav-link" href="/services">{t.nav.services}</Link>
              </li>
              <li className={`nav-item${isActive('/projects') ? ' active' : ''}`}>
                <Link className="nav-link" href="/projects">{t.nav.projects}</Link>
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
                  {t.nav.blog}
                </button>
                <ul
                  className={`dropdown-menu${blogOpen ? ' show' : ''}`}
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
                <Link className="nav-link" href="/contact">{t.nav.contact}</Link>
              </li>
            </ul>
          </div>

          <div className="right-button">
            <ul>
              <li className="lang-desktop">
                <LanguageSwitcher />
              </li>
              <li className="shop-icon">
                <a href={`tel:${t.company.phone1.replace(/[^+\d]/g, '')}`} aria-label={t.company.phone1}>
                  <i className="ti-mobile"></i>
                </a>
              </li>
              <li>
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
