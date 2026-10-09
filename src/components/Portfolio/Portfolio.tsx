import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/lib/admin/AdminContext';

type Props = {
  showHeading?: boolean;
}

type FilterKey = 'all' | 'buildings' | 'offices' | 'rebuild' | 'archi';

const Portfolio = ({ showHeading = true }: Props) => {
  const { t } = useLanguage();
  const { db } = useAdmin();
  const [filter, setFilter] = useState<FilterKey>('all');

  const dyn = db.projets.filter(p => p.statut === 'publie' || p.statut === 'en_cours').map(p => ({ src: p.image, cat: p.categorie as Exclude<FilterKey,'all'>, label: p.titre }));
  const items: { src: string; cat: Exclude<FilterKey, 'all'>; label: string }[] = dyn.length ? dyn : [
    { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', cat: 'buildings', label: t.portfolio.buildings },
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', cat: 'offices', label: t.portfolio.offices },
    { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', cat: 'rebuild', label: t.portfolio.rebuild },
    { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', cat: 'archi', label: t.portfolio.archi },
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
