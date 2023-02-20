import { Stack } from '@mui/joy';
import { ReactNode } from 'react';

import MilaMeterHead from '@/components/MilaMeterHead';

import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <MilaMeterHead />
      <Stack>
        <Header />
        {children}
      </Stack>
    </>
  );
}
