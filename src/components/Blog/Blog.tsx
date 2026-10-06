import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext';

const Blog = () => {
  const { t } = useLanguage();
  const posts = [
    { src: '/images/1.jpg.webp', title: t.blogSec.p1t, date: t.blogSec.p1d },
    { src: '/images/2.jpg.webp', title: t.blogSec.p2t, date: t.blogSec.p2d },
    { src: '/images/3.jpg.webp', title: t.blogSec.p3t, date: t.blogSec.p3d },
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
                    <span><i className="ti-folder"></i> {t.blogSec.category}</span>
                  </div>
                  <Link className="d-block" href="/single-blog">
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
