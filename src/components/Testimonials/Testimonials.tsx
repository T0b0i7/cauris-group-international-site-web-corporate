import React from 'react'
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import dynamic from "next/dynamic";
import Image from "next/image"
import { useLanguage } from '@/context/LanguageContext';
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

const Testimonials = () => {
  const { t } = useLanguage();
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

  const people = [
    { name: 'Adame Nesane', img: '/images/tes1.jpg.webp' },
    { name: 'Adam Nahan', img: '/images/tex2.jpg.webp' },
    { name: 'Adame Nesane', img: '/images/tes1.jpg.webp' },
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
              <div key={i} className="single-testimonial item d-flex flex-row">
                <div className="thumb">
                  <Image width={91} height={91} className="img-fluid" src={p.img} alt={p.name} />
                </div>
                <div className="desc">
                  <h4>{p.name}</h4>
                  <p className="designation">{t.testimonials.role}</p>
                  <p>{t.testimonials.quote}</p>
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
