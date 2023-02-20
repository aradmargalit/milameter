import { signIn } from 'next-auth/react';

import {
  StravaLoginButton,
  StravaLoginButtonProps,
} from '@/components/StravaLoginButton/StravaLoginButton';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

type StravaLoginButtonContainerProps = Omit<StravaLoginButtonProps, 'onClick'>;

export function StravaLoginButtonContainer(
  props: StravaLoginButtonContainerProps
) {
  // We only support one provider, if that changes, update this
  const { id, name } = authOptions.providers[0];
  if (name !== 'Strava') {
    throw new Error('Strava should be the only provider configured.');
  }

  return <StravaLoginButton onClick={() => signIn(id)} {...props} />;
}
