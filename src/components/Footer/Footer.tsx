import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin, isEmail, uid } from '@/lib/admin/AdminContext';
import { img } from '@/lib/base';

const Footer = () => {
  const { t } = useLanguage();
  const { db, saveDB } = useAdmin();
  const [nl, setNl] = useState(''); const [nlMsg, setNlMsg] = useState('');
  const p = db.parametres;
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(nl)) { setNlMsg('Email invalide.'); return; }
    if (db.newsletter.some((x) => x.email.toLowerCase() === nl.toLowerCase().trim())) { setNlMsg('Déjà inscrit.'); return; }
    saveDB({ ...db, newsletter: [{ id: uid('nl'), email: nl.trim(), statut: 'actif', consentRgpd: true, createdAt: new Date().toISOString() }, ...db.newsletter] }, { entite: 'newsletter', action: 'subscribe-site', detail: nl.trim() });
    setNlMsg('Inscription confirmée.'); setNl('');
  };
  return (
    <footer className="footer-area ">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="single-footer-widget">
              <div className="footer-logo">
                <Image src={img('/images/logo.jpeg')} alt={t.company.name} width={220} height={220} />
              </div>
              <p className="footer-company">
                {p?.adresse || t.company.address}<br />{p?.bp || t.company.bp}<br />
                {p?.phone1 || t.company.phone1} - {p?.phone2 || t.company.phone2}<br />
                <a href={`mailto:${p?.email || t.company.email}`}>{p?.email || t.company.email}</a>
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="single-footer-widget">
              <h6>{t.footer.useful}</h6>
              <div className="row">
                <div className="col-lg-6">
                  <ul className="footer-nav">
                    <li><i className="ti-angle-right"></i><Link href="/">{t.footer.home}</Link></li>
                    <li><i className="ti-angle-right"></i><Link href="/about-us">{t.footer.about}</Link></li>
                    <li><i className="ti-angle-right"></i><Link href="/blog">{t.footer.news}</Link></li>
                    <li><i className="ti-angle-right"></i><Link href="/projects">{t.footer.projects}</Link></li>
                  </ul>
                </div>
                <div className="col-lg-6">
                  <ul className="footer-nav">
                    <li><i className="ti-angle-right"></i><Link href="/services">{t.footer.services}</Link></li>
                    <li><i className="ti-angle-right"></i><Link href="/contact">{t.footer.contact}</Link></li>
                    <li><i className="ti-angle-right"></i><Link href="/projects">{t.footer.projects}</Link></li>
                    <li><i className="ti-angle-right"></i><Link href="/about-us">{t.footer.careers}</Link></li>
                  </ul>
                </div>
              </div>
              <h6 className="mb-20 mt-4">{t.footer.hoursTitle}</h6>
              <ul className="business-hour">
                <li>{t.footer.mondayFriday} <span>8:00 am - 18:00 pm</span></li>
                <li>{t.footer.saturday}<span>9:00 am - 16:00 pm</span></li>
                <li>{t.footer.sunday}<span>{t.footer.closed}</span></li>
              </ul>
              <p>{t.footer.holidays}</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="single-footer-widget newsletter">
              <h6>{t.footer.newsletterTitle}</h6>
              <div id="mc_embed_signup">
                <form onSubmit={subscribe} className="form-inline">
                  <div className="form-group row no-gutters">
                    <div className="col-lg-8 col-md-8 col-7">
                      <input name="EMAIL" value={nl} onChange={(e) => setNl(e.target.value)} placeholder={t.footer.placeholder} required={true} type="email" />
                    </div>
                    <div className="col-lg-4 col-md-4 col-5">
                      <button className="nw-btn main_btn circle" type="submit">
                        {t.footer.subscribe}
                        <span className="lnr lnr-arrow-right"></span>
                      </button>
                    </div>
                  </div>
                  <div className="info">{nlMsg}</div>
                </form>
              </div>
              <p>{t.footer.newsletterDesc}</p>
              <Link className="footer-link" href="/privacy">{t.footer.privacy}</Link>
              <span style={{ margin: '0 8px' }}>·</span>
              <Link className="footer-link" href="/privacy">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row ">
            <p className="col-lg-12 footer-text ">
              Copyright &copy; {new Date().getFullYear()} {t.footer.madeWith} - {t.footer.rights}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
