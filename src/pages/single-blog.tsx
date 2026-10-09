import Head from 'next/head';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageHeader from '@/components/PageHeader/PageHeader';
import SinglePost from '@/components/SinglePost/SinglePost';
import { useLanguage } from '@/context/LanguageContext';

export default function SingleBlogPage() {
  const { t } = useLanguage();
  return <>
  <Head>
        <title>{t.nav.blogDetails} - {t.company.short}</title>
        <meta name="description" content={t.pages.homeDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <PageHeader title={t.nav.blogDetails} navTitle={t.nav.blogDetails} />
      <SinglePost />
      <Footer />
  </>
}
