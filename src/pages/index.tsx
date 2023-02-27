import { Box, Typography } from '@mui/joy';
import { keyframes } from '@mui/system';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { signIn } from 'next-auth/react';

import { MilaMeterHead } from '@/components/MilaMeterHead/MilaMeterHead';
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

const bgSize = '400%';
const colorOne = 'hsl(15 90% 55%)';
const colorTwo = 'hsl(40 95% 55%)';

const animateBG = keyframes`
  to {
    background-position: ${bgSize} 0;
  }
`;
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
          <Box display="flex" alignItems="center" maxWidth="75vw">
            <Typography
              level="display1"
              sx={{
                fontSize: 'clamp(3rem, 12vmin, 8rem)',
                fontWeight: 'bold',
                letterSpacing: 2,
                // fancy animation
                background: `linear-gradient(90deg, ${colorOne}, ${colorTwo}, ${colorOne}) 0 0 / ${bgSize} 100%`,
                color: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                animation: `${animateBG} 12s infinite linear`,
              }}
            >
              Mila
            </Typography>
            <Typography
              sx={{
                fontSize: 'clamp(3rem, 12vmin, 8rem)',
                fontWeight: 'bold',
                letterSpacing: 2,
              }}
            >
              Meter
            </Typography>
          </Box>
          <StravaLoginButtonContainer variant="plain" />
        </Box>
      </main>
    </>
  );
}
