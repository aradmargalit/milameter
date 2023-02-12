import StravaLoginButtonContainer from '@/components/StravaLoginButton';
import { Sheet } from '@mui/joy';
import { GetServerSideProps } from 'next';
import { getToken } from 'next-auth/jwt';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const jwt = await getToken({
    req: context.req,
  });

  // If we have an access token, redirect to the activities page
  if (jwt?.accessToken) {
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
