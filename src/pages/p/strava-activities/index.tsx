import StravaLoginButtonContainer from '@/components/StravaLoginButton';
import { Button, Sheet, Stack, Typography } from '@mui/joy';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Activity } from '@/apiClients/stravaClient/models';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { StravaClient } from '@/apiClients/stravaClient/stravaClient';
import { getToken } from 'next-auth/jwt';
import StravaActivityCard from '@/components/StravaActivityCard';

type Data = { activities: Activity[] };

const PAGE_SIZE = 5;

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  // we should always have a session since this is a /p/* protected route
  const session = await getServerSession(context.req, context.res, authOptions);
  const jwt = await getToken({
    req: context.req,
    secret: process.env.AUTH_SECRET,
  });

  // This should never happen, but what can ya do
  if (!session || !jwt) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // TODO: find a way to reuse this instance, fix casting
  console.log(jwt.accessToken);
  const stravaClient = new StravaClient(jwt.accessToken as string);
  const firstFiveActivities = await stravaClient.getAthleteActivities(
    PAGE_SIZE
  );

  return {
    props: {
      data: {
        activities: firstFiveActivities,
      },
    },
  };
};

export default function StravaActivities({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <Sheet sx={{ margin: 4, padding: 4 }}>
        <Stack spacing={2}>
          {data.activities.map((d) => (
            <StravaActivityCard key={d.id} activity={d} />
          ))}
        </Stack>
      </Sheet>
    </main>
  );
}
