import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <section className="about-area area-padding overflow-hidden">
      <div className="container max-w-full">
        <div className="row align-items-center justify-content-center g-4">
          <div className="col-lg-6 d-flex justify-content-center align-items-center overflow-hidden">
            <div className="about-img w-full max-w-full overflow-hidden flex items-center justify-center">
              <Image width={555} height={485} src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80" alt="" className="max-w-full h-auto object-contain" style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>
          <div className="col-lg-6 d-flex align-items-center">
            <div className="about-content w-full max-w-full">
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
