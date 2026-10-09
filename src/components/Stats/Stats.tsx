import Image from 'next/image'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/lib/admin/AdminContext';
import { img } from '@/lib/base';

const Stats = () => {
  const { t } = useLanguage();
  const { db } = useAdmin();
  const poles = db.parametres?.polesExpertise ?? t.stats.happyCount;
  const projets = db.parametres?.projetsRealises ?? t.stats.doneCount;
  const quali = db.parametres?.engagementQualite ?? t.stats.ratingValue;
  return (
    <section className="number-area" id="number-section" style={{ backgroundImage: `url(${img('/images/bg1.jpg')})` }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-5">
            <div className="number-img">
              <Image width={368} height={462} src={img('/images/about2.png.webp')} alt="" />
            </div>
          </div>
          <div className="col-md-7 col-lg-6">
            <div className="number-content">
              <h4>
                {t.stats.titleA} <br />
                {t.stats.titleB}
              </h4>
              <p>{t.stats.desc}</p>
              <div className="number-wrapper">
                <div className="single-number">
                  <h5><span className="counter">{String(poles)}</span></h5>
                  <p>{t.stats.happy}</p>
                </div>
                <div className="single-number">
                  <h5><span className="counter">{String(projets)}</span>+</h5>
                  <p>{t.stats.done}</p>
                </div>
                <div className="single-number">
                  <h5><span className="counter">{String(quali)}</span></h5>
                  <p>{t.stats.rating}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats
