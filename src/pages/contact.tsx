import Head from 'next/head';
import Header from '@/components/Header/Header';

import Footer from '@/components/Footer/Footer';

import PageHeader from '@/components/PageHeader/PageHeader';
import ContactUs from '@/components/ContactUs/ContactUs';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  return <>
  <Head>
        <title>{t.pages.contactTitle} — {t.company.short}</title>
        <meta name="description" content={t.pages.homeDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <PageHeader title={t.pages.contactTitle} navTitle={t.pages.contactTitle} />
      
      <ContactUs />
      
      <Footer />
  </>
}
