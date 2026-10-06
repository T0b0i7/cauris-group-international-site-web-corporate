import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext';

type Props = {
  showHeading?: boolean;
}

type FilterKey = 'all' | 'buildings' | 'offices' | 'rebuild' | 'archi';

const Portfolio = ({ showHeading = true }: Props) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterKey>('all');

  const items: { src: string; cat: Exclude<FilterKey, 'all'>; label: string }[] = [
    { src: '/images/1.jpg.webp', cat: 'buildings', label: t.portfolio.buildings },
    { src: '/images/2.jpg.webp', cat: 'offices', label: t.portfolio.offices },
    { src: '/images/3.jpg.webp', cat: 'rebuild', label: t.portfolio.rebuild },
    { src: '/images/4.jpg.webp', cat: 'archi', label: t.portfolio.archi },
  ];

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: t.portfolio.all },
    { key: 'buildings', label: t.portfolio.buildings },
    { key: 'offices', label: t.portfolio.offices },
    { key: 'rebuild', label: t.portfolio.rebuild },
    { key: 'archi', label: t.portfolio.archi },
  ];

  const visible = items.filter((it) => filter === 'all' || it.cat === filter);

  return (
    <section className="portfolio_area area-padding" id="portfolio">
      <div className="container">
        {showHeading ? (
          <div className="area-heading">
            <h3 className="line">{t.portfolio.kicker}</h3>
            <p>{t.portfolio.sub}</p>
          </div>
        ) : null}
        <div className="filters portfolio-filter">
          <ul role="tablist" aria-label={t.portfolio.kicker}>
            {filters.map((f) => (
              <li
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={filter === f.key ? 'active' : ''}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="filters-content">
          <div className="row portfolio-grid">
            {visible.map((it) => (
              <div key={it.src} className="col-lg-6 col-md-6">
                <div className="single_portfolio">
                  <Image width={555} height={419} className="img-fluid w-100" src={it.src} alt={t.portfolio.itemTitle} />
                  <div className="short_info">
                    <p>{it.label}</p>
                    <h4>
                      <Link href="/contact">{t.portfolio.itemTitle}</Link>
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Portfolio
