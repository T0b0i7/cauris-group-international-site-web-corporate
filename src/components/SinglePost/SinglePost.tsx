import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useLanguage } from '@/context/LanguageContext';

const SinglePost = () => {
  const { t } = useLanguage();
  return (
    <section className="blog_area area-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            <div className="single-post">
              <div className="feature-img">
                <Image width={750} height={400} className="img-fluid" src="/images/1.jpg.webp" alt={t.article.title} />
              </div>
              <div className="blog_details">
                <h2>{t.article.title}</h2>
                <ul className="blog-info-link mt-3 mb-4">
                  <li><i className="ti-calendar"></i> {t.article.date}</li>
                  <li><i className="ti-folder"></i> {t.blogSec.category}</li>
                </ul>
                <p>{t.article.p1}</p>
                <p>{t.article.p2}</p>
                <p>{t.article.p3}</p>
                <Link className="main_btn mt-4" href="/blog">← {t.article.back}</Link>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="blog_right_sidebar">
              <aside className="single_sidebar_widget post_category_widget">
                <h4 className="widget_title">{t.services.kicker}</h4>
                <ul className="list cat-list">
                  <li><Link href="/services" className="d-flex"><p>{t.services.s1t}</p></Link></li>
                  <li><Link href="/services" className="d-flex"><p>{t.services.s2t}</p></Link></li>
                  <li><Link href="/services" className="d-flex"><p>{t.services.s3t}</p></Link></li>
                  <li><Link href="/services" className="d-flex"><p>{t.services.s4t}</p></Link></li>
                  <li><Link href="/services" className="d-flex"><p>{t.services.s5t}</p></Link></li>
                  <li><Link href="/services" className="d-flex"><p>{t.services.s6t}</p></Link></li>
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SinglePost;
