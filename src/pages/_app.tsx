import './globals.css';
import '@fontsource/public-sans';
import 'mapbox-gl/dist/mapbox-gl.css';

import { CssVarsProvider } from '@mui/joy/styles';
import { Inter } from '@next/font/google';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

import { GarminActivityProvider } from '@/contexts/GarminActivityContext';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <CssVarsProvider defaultMode="system">
        <GarminActivityProvider>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </GarminActivityProvider>
      </CssVarsProvider>
    </SessionProvider>
  );
}
