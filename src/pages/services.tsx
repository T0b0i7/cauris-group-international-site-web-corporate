import Head from 'next/head';
import { img } from '@/lib/base';
import Header from '@/components/Header/Header';
import Services from '@/components/Services/Services';
import Stats from '@/components/Stats/Stats';
import Testimonials from '@/components/Testimonials/Testimonials';
import Footer from '@/components/Footer/Footer';
import PageHeader from '@/components/PageHeader/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

export default function ServicesPage() {
  const { t } = useLanguage();
  return <>
  <Head>
        <title>{t.pages.servicesTitle} - {t.company.short}</title>
        <meta name="description" content={t.pages.homeDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={img(`/favicon.ico`)} />
      </Head>
      <Header />
      <PageHeader title={t.pages.servicesTitle} navTitle={t.pages.servicesTitle} />
      
      <Services />
      <Stats />
      
      <Testimonials />
     
      <Footer />
  </>
}
