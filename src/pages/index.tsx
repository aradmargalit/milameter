import StravaLoginButtonContainer from '@/components/StravaLoginButton';
import { Sheet } from '@mui/joy';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
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
      <Head>
        <title>Milavision</title>
        <meta name="description" content="Pup runs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sheet sx={{ margin: 4 }}>
          <StravaLoginButtonContainer />
        </Sheet>
      </main>
    </>
  );
}
