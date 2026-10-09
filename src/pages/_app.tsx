import type { AppProps } from 'next/app'
import { Roboto } from "next/font/google";
import '@/styles/globals.css'
import '@/styles/sintec.css'
import '@/styles/responsive.css'
import '@/styles/admin.css'
import { LanguageProvider } from '@/context/LanguageContext';
import { AdminProvider } from '@/lib/admin/AdminContext';
import { ToastProvider } from '@/lib/admin/useToast';
import CookieBanner from '@/components/CookieBanner/CookieBanner';

const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AdminProvider>
    <ToastProvider>
    <LanguageProvider>
      <style jsx global>{`
        html, body {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <CookieBanner />
    </LanguageProvider>
    </ToastProvider>
    </AdminProvider>
  )
}
