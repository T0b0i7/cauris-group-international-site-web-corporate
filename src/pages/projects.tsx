import Head from 'next/head';
import Header from '@/components/Header/Header';
import Portfolio from '@/components/Portfolio/Portfolio';
import Testimonials from '@/components/Testimonials/Testimonials';
import Footer from '@/components/Footer/Footer';
import PageHeader from '@/components/PageHeader/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

export default function ProjectsPage() {
  const { t } = useLanguage();
  return <>
  <Head>
        <title>{t.pages.projectsTitle} - {t.company.short}</title>
        <meta name="description" content={t.pages.homeDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <PageHeader title={t.pages.projectsTitle} navTitle={t.pages.projectsTitle} />
      

      <Portfolio showHeading={false} />
      <Testimonials />

      <Footer />
  </>
}
