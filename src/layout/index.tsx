import { Stack } from '@mui/joy';
import { ReactNode } from 'react';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <Stack>
      <Header />
      {children}
    </Stack>
  );
}
