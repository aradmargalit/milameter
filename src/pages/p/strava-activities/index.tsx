import { Sheet, Stack } from '@mui/joy';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Activity } from '@/apiClients/stravaClient/models';
import { StravaClient } from '@/apiClients/stravaClient/stravaClient';
import { getToken } from 'next-auth/jwt';
import StravaActivityCard from '@/components/StravaActivityCard';

type Data = { activities: Activity[] };

const PAGE_SIZE = 5;

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const jwt = await getToken({
    req: context.req,
  });

  // This should never happen, but what can ya do
  if (!jwt?.accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const stravaClient = new StravaClient(jwt.accessToken);
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
