import React from 'react'
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import dynamic from "next/dynamic";
import Image from "next/image"
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/lib/admin/AdminContext';
import { img } from '@/lib/base';
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

const Testimonials = () => {
  const { t } = useLanguage();
  const { db } = useAdmin();
  const valid = db.temoignages.filter((x) => x.statut === 'valide');
  const carouselConfig = {
    merge: true,
    smartSpeed: 1000,
    loop: true,
    nav: false,
    center: false,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    margin: 20,
    responsiveClass: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 2 },
      1200: { items: 2 },
    },
  };

  const people = valid.length ? valid.map((v) => ({ name: v.nom, img: v.image, msg: v.message, role: v.role })) : [
    { name: 'Adame Nesane', img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80', msg: t.testimonials.quote, role: t.testimonials.role },
    { name: 'Adam Nahan', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', msg: t.testimonials.quote, role: t.testimonials.role },
  ];

  return (
    <section className="testimonial-area area-padding">
      <div className="container">
        <div className="area-heading">
          <h3 className="line">{t.testimonials.kicker}</h3>
          <p>{t.testimonials.sub}</p>
        </div>
        <div className="row">
          <OwlCarousel className="active-testimonial-carusel owl-carousel" {...carouselConfig}>
            {people.map((p, i) => (
              <div key={i} className="single-testimonial item d-flex flex-row" style={{ backgroundImage: `url(${img('/images/cotation.png')})` }}>
                <div className="thumb">
                  <Image width={91} height={91} className="img-fluid" src={p.img} alt={p.name} />
                </div>
                <div className="desc">
                  <h4>{p.name}</h4>
                  <p className="designation">{(p as { role?: string }).role ?? t.testimonials.role}</p>
                  <p>{(p as { msg?: string }).msg ?? t.testimonials.quote}</p>
                </div>
              </div>
            ))}
          </OwlCarousel>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
