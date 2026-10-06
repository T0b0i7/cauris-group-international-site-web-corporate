import React from 'react'
import { useLanguage } from '@/context/LanguageContext';

const TopNav = () => {
  const { t } = useLanguage();
  return (
    <div className="top_menu row m0">
      <div className="container">
        <div className="float-left">
          <a className="dn_btn" href={`tel:${t.company.phone1.replace(/[^+\d]/g, '')}`}>
            <i className="ti-mobile"></i>{t.company.phone1}
          </a>
          <span className="dn_btn">
            {" "}
            <i className="ti-location-pin"></i> {t.company.address}
          </span>
        </div>
        <div className="float-right">
          <span className="follow_us">{t.topbar.followUs} </span>
          <ul className="list header_social">
            <li>
              <a href={`mailto:${t.company.email}`} aria-label="email">
                <i className="ti-email"></i>
              </a>
            </li>
            <li>
              <a href={`tel:${t.company.phone1.replace(/[^+\d]/g, '')}`} aria-label="phone">
                <i className="ti-mobile"></i>
              </a>
            </li>
            <li>
              <a href="https://wa.me/2290194646471" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="ti-comments"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TopNav
