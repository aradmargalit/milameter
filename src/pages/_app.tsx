import './globals.css';
import '@fontsource/public-sans';
import 'mapbox-gl/dist/mapbox-gl.css';

import { CssVarsProvider } from '@mui/joy/styles';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import FullPageLoader from '@/components/FullPageLoader';
import { GarminActivityProvider } from '@/contexts/GarminActivityContext';
import { useAppLoading } from '@/hooks/useAppLoading';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useAppLoading();

  return (
    <SessionProvider session={pageProps.session}>
      <CssVarsProvider defaultMode="system">
        {loading ? (
          <FullPageLoader />
        ) : (
          <GarminActivityProvider>
            <main className={inter.className}>
              <Component {...pageProps} />
            </main>
          </GarminActivityProvider>
        )}
      </CssVarsProvider>
    </SessionProvider>
  );
}
