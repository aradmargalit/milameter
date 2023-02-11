'use client'; // eventually remove this once mui supports server components

import { getInitColorSchemeScript } from '@mui/joy/styles';
import { CssVarsProvider } from '@mui/joy/styles';
import './globals.css';
import '@fontsource/public-sans';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {getInitColorSchemeScript({ defaultMode: 'system' })}
        <CssVarsProvider>{children}</CssVarsProvider>
      </body>
    </html>
  );
}
