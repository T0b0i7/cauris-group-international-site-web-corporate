import Head from 'next/head';
import { img } from '@/lib/base';
import Header from '@/components/Header/Header';
import About from '@/components/About/About';
import Testimonials from '@/components/Testimonials/Testimonials';
import Footer from '@/components/Footer/Footer';
import PageHeader from '@/components/PageHeader/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();
  return <>
  <Head>
        <title>{t.pages.aboutTitle} - {t.company.short}</title>
        <meta name="description" content={t.pages.homeDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={img(`/favicon.ico`)} />
      </Head>
      <Header />
      <PageHeader title={t.pages.aboutTitle} navTitle={t.pages.aboutTitle} />
      <About />

      <Testimonials />
  
      <Footer />
  </>
}
