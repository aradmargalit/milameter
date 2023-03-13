import './globals.css';
import '@fontsource/public-sans';
import 'mapbox-gl/dist/mapbox-gl.css';

import { CssVarsProvider } from '@mui/joy/styles';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import FullPageLoader from '@/components/FullPageLoader';
import { GarminActivityProvider } from '@/contexts/GarminActivityContext';
import { GarminActivityStorageProvider } from '@/contexts/GarminActivityStorageContext';
import { useAppLoading } from '@/hooks/useAppLoading';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useAppLoading();

  return (
    <SessionProvider session={pageProps.session}>
      <CssVarsProvider defaultMode="system">
        <GarminActivityStorageProvider>
          <GarminActivityProvider>
            <main className={inter.className}>
              {loading ? <FullPageLoader /> : <Component {...pageProps} />}
            </main>
          </GarminActivityProvider>
        </GarminActivityStorageProvider>
      </CssVarsProvider>
    </SessionProvider>
  );
}
