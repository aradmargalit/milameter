import './globals.css';
import '@fontsource/public-sans';
import 'mapbox-gl/dist/mapbox-gl.css';

import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';

import { milaMeterThemeConfig } from '@/colors';
import FullPageLoader from '@/components/FullPageLoader';
import { GarminActivityProvider } from '@/contexts/GarminActivityContext';
import { GarminActivityStorageProvider } from '@/contexts/GarminActivityStorageContext';
import { UserPrefsProvider } from '@/contexts/UserPreferencesContext';
import { useAppLoading } from '@/hooks/useAppLoading';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const { loading } = useAppLoading();
  const milaMeterTheme = extendTheme(milaMeterThemeConfig);

  return (
    <SessionProvider session={pageProps.session}>
      <CssVarsProvider defaultMode="system" theme={milaMeterTheme}>
        <UserPrefsProvider>
          <GarminActivityStorageProvider>
            <GarminActivityProvider>
              <main className={inter.className}>
                {loading ? <FullPageLoader /> : <Component {...pageProps} />}
              </main>
            </GarminActivityProvider>
          </GarminActivityStorageProvider>
        </UserPrefsProvider>
      </CssVarsProvider>
    </SessionProvider>
  );
}
