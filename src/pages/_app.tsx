import './globals.css';
import '@fontsource/public-sans';
import 'mapbox-gl/dist/mapbox-gl.css';

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Inter } from '@next/font/google';
import { CssVarsProvider } from '@mui/joy/styles';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <CssVarsProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </CssVarsProvider>
    </SessionProvider>
  );
}
