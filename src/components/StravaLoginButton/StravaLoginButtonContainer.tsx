import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import { Button } from '@mui/joy';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';

import { StravaLoginButton } from '@/components/StravaLoginButton/StravaLoginButton';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export function StravaLoginButtonContainer() {
  const { status } = useSession();

  const isLoggedIn = status === 'authenticated';

  // We only support one provider, if that changes, update this
  const { id, name } = authOptions.providers[0];
  if (name !== 'Strava') {
    throw new Error('Strava should be the only provider configured.');
  }

  if (status === 'loading') {
    return (
      <Button variant="outlined" color="neutral" disabled>
        Loading...
      </Button>
    );
  }

  if (isLoggedIn) {
    return (
      <Button
        startDecorator={<LogoutOutlined />}
        variant="outlined"
        onClick={() => signOut()}
        color="danger"
      >
        Log Out
      </Button>
    );
  }

  return <StravaLoginButton onClick={() => signIn(id)} />;
}
