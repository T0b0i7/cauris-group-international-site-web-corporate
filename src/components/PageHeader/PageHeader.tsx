import React from "react";
import Link from "next/link";
import { useLanguage } from '@/context/LanguageContext';

type Props = {
  title?: string;
  navTitle?: string;
};

const PageHeader = ({ title, navTitle }: Props) => {
  const { t } = useLanguage();
  const _title = title ?? t.pages.aboutTitle;
  const _nav = navTitle ?? _title;
  return (
    <section className="hero-banner hero-banner-sm">
      <div className="container text-center">
        <h2>{_title}</h2>
        <nav aria-label="breadcrumb" className="banner-breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/">{t.pageHeader.home}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {_nav}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default PageHeader;
