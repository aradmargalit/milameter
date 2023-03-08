import { Box } from '@mui/joy';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';

import { MilaMeterHead } from '@/components/MilaMeterHead/MilaMeterHead';
import MilaMeterTitle from '@/components/MilaMeterTitle';
import StravaLoginButtonContainer from '@/components/StravaLoginButton';

import { authOptions } from './api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  // If we have an access token, redirect to the activities page
  const session = await getServerSession(req, res, authOptions);

  // If the session has expired, try to refresh it
  if (session?.error === 'RefreshAccessTokenError') {
    signIn(); // Force sign in to hopefully resolve error
  }

  if (session) {
    return {
      redirect: {
        destination: '/p/strava-activities',
        permanent: false,
      },
    };
  }

  // if we don't have an access token, proceed to Home (no props needed)
  return {
    props: {},
  };
};

export default function Home() {
  return (
    <>
      <MilaMeterHead />
      <main>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          alignItems="center"
          height="70vh"
          sx={{ margin: 4 }}
        >
          <MilaMeterTitle />
          <StravaLoginButtonContainer variant="plain" />
        </Box>
      </main>
    </>
  );
}
