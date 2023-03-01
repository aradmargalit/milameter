import { Button } from '@mui/joy';
import { signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

import {
  StravaLoginButton,
  StravaLoginButtonProps,
} from '@/components/StravaLoginButton/StravaLoginButton';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

type StravaLoginButtonContainerProps = Omit<StravaLoginButtonProps, 'onClick'>;
import { LogoutOutlined } from '@mui/icons-material';
import { useSession } from 'next-auth/react';

export function StravaLoginButtonContainer(
  props: StravaLoginButtonContainerProps
) {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isLoggedIn = status === 'authenticated';

  // We only support one provider, if that changes, update this
  const { id, name } = authOptions.providers[0];
  if (name !== 'Strava') {
    throw new Error('Strava should be the only provider configured.');
  }

  if (!mounted || status === 'loading') {
    return null;
  }

  if (isLoggedIn) {
    return (
      <Button
        startDecorator={<LogoutOutlined />}
        variant="soft"
        onClick={() => signOut()}
        color="danger"
      >
        Log Out
      </Button>
    );
  }

  return <StravaLoginButton onClick={() => signIn(id)} {...props} />;
}
