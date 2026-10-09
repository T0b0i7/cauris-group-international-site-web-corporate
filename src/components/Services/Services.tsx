import Image from 'next/image'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/lib/admin/AdminContext';
import { img } from '@/lib/base';

const Services = () => {
  const { t, lang } = useLanguage();
  const { db } = useAdmin();
  const dyn = [...db.services].sort((a, b) => a.ordre - b.ordre).filter((s) => s.actif);
  const items = dyn.length ? dyn.map((s) => ({ img: img(s.image), w: 82, h: 82, title: lang === 'fr' ? s.titreFr : s.titreEn, desc: lang === 'fr' ? s.descFr : s.descEn })) : [
    { img: img('/images/i1.png.webp'), w: 92, h: 92, title: t.services.s1t, desc: t.services.s1d },
    { img: img('/images/i2.png.webp'), w: 83, h: 83, title: t.services.s2t, desc: t.services.s2d },
    { img: img('/images/i3.png.webp'), w: 53, h: 92, title: t.services.s3t, desc: t.services.s3d },
    { img: img('/images/i4.png.webp'), w: 82, h: 82, title: t.services.s4t, desc: t.services.s4d },
    { img: img('/images/i2.png.webp'), w: 83, h: 83, title: t.services.s5t, desc: t.services.s5d },
    { img: img('/images/i1.png.webp'), w: 92, h: 92, title: t.services.s6t, desc: t.services.s6d },
  ];
  return (
    <section className="service-area area-padding">
      <div className="container">
        <div className="area-heading">
          <h3 className="line">{t.services.kicker}</h3>
          <p>{t.services.sub}</p>
        </div>
        <div className="row">
          {items.map((s) => (
            <div key={s.title} className="col-md-6 col-xl-4">
              <div className="single-service">
                <div className="service-icon">
                  <Image width={s.w} height={s.h} src={s.img} alt="" />
                </div>
                <div className="service-content">
                  <h5>{s.title}</h5>
                  <p>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
