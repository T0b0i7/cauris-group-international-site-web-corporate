import Image from 'next/image'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext';

const Stats = () => {
  const { t } = useLanguage();
  return (
    <section className="number-area" id="number-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-5">
            <div className="number-img">
              <Image width={368} height={462} src="/images/about2.png.webp" alt="" />
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
                  <h5><span className="counter">{t.stats.happyCount}</span></h5>
                  <p>{t.stats.happy}</p>
                </div>
                <div className="single-number">
                  <h5><span className="counter">{t.stats.doneCount}</span>+</h5>
                  <p>{t.stats.done}</p>
                </div>
                <div className="single-number">
                  <h5><span className="counter">{t.stats.ratingValue}</span></h5>
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
