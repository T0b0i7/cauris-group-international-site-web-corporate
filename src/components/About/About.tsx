import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <section className="about-area area-padding">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 d-none d-lg-block">
            <div className="about-img">
              <Image width={555} height={485} src="/images/about1.png.webp" alt="" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content">
              <h4>{t.about.title}</h4>
              <p>{t.about.desc}</p>
              <Link className="main_btn" href="/about-us">
                {t.about.cta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
