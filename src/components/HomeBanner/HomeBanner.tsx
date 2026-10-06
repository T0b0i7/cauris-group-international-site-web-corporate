import React from "react";
import Link from "next/link";
import { Parallax } from "react-parallax";
import { useLanguage } from '@/context/LanguageContext';

const HomeBanner = () => {
  const { t } = useLanguage();
  return (
    <section className="home_banner_area">
      <Parallax
        blur={0}
        bgImage="/images/home-banner.jpg.webp"
        bgImageAlt="home banner"
        strength={100}
        className="container-fluid banner_inner d-flex"
        contentClassName="container-fluid d-flex align-items-center"
      >
        <div className="container">
          <div className="banner_content text-center">
            <span>{t.banner.kicker}</span>
            <h3>
              {t.banner.titleA}{' '}
              <br className="d-none d-md-block" />
              {t.banner.titleB}
            </h3>
            <Link className="main_btn" href="/contact">
              {t.banner.cta}
            </Link>
          </div>
        </div>
      </Parallax>
    </section>
  );
};

export default HomeBanner;
