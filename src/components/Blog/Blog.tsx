import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/lib/admin/AdminContext';

const Blog = () => {
  const { t, lang } = useLanguage();
  const { db, saveDB } = useAdmin();
  const dyn = db.articles.filter(a => a.statut === 'publie').slice(0, 3).map(a => ({
    id: a.id, src: a.image, title: lang === 'fr' ? a.titreFr : a.titreEn,
    date: a.datePublication, cat: a.categorie,
  }));
  const track = (id?: string) => {
    if (!id) return;
    try { saveDB({ ...db, articles: db.articles.map((a) => (a.id === id ? { ...a, vues: (a.vues || 0) + 1 } : a)) }); } catch {}
  };
  const posts = dyn.length ? dyn : [
    { src: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80', title: t.blogSec.p1t, date: t.blogSec.p1d, cat: t.blogSec.category },
    { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', title: t.blogSec.p2t, date: t.blogSec.p2d, cat: t.blogSec.category },
    { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80', title: t.blogSec.p3t, date: t.blogSec.p3d, cat: t.blogSec.category },
  ];
  return (
    <section className="blog-area area-padding">
      <div className="container">
        <div className="area-heading">
          <h3 className="line">{t.blogSec.kicker}</h3>
          <p>{t.blogSec.sub}</p>
        </div>
        <div className="row">
          {posts.map((p) => (
            <div key={p.src} className="col-lg-4 col-md-4">
              <div className="single-blog">
                <div className="thumb">
                  <Image width={360} height={285} className="img-fluid" src={p.src} alt={p.title} />
                </div>
                <div className="short_details">
                  <div className="meta-top d-flex">
                      <span><i className="ti-calendar"></i> {p.date}</span>
                      <span><i className="ti-folder"></i> {(p as {cat?:string}).cat ?? t.blogSec.category}</span>
                    </div>
                  <Link className="d-block" href="/single-blog" onClick={() => track((p as {id?:string}).id)}>
                    <h4>{p.title}</h4>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Blog
