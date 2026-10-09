import Head from 'next/head';
import { img } from '@/lib/base';
import Header from '@/components/Header/Header';
import Testimonials from '@/components/Testimonials/Testimonials';
import Footer from '@/components/Footer/Footer';
import Blog from '@/components/Blog/Blog';
import PageHeader from '@/components/PageHeader/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

export default function BlogPage() {
  const { t } = useLanguage();
  return <>
  <Head>
        <title>{t.nav.blog} - {t.company.short}</title>
        <meta name="description" content={t.pages.homeDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={img(`/favicon.ico`)} />
      </Head>
      <Header />
      <PageHeader title={t.nav.blog} navTitle={t.nav.blog} />
      <Blog />
      <Testimonials />
      <Footer />
  </>
}
