'use client';

import StravaLoginButton from '@/components/stravaLoginButton';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { signIn } from 'next-auth/react';

export default function SignIn() {
  // We only support one provider, if that changes, update this
  const { id, name } = authOptions.providers[0];
  if (name !== 'Strava') {
    throw new Error('Strava should be the only provider configured.');
  }

  return (
    <div>
      <StravaLoginButton onClick={() => signIn(id)}>
        Sign in with Strava
      </StravaLoginButton>
    </div>
  );
}
