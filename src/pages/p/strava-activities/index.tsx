import { Grid, Sheet } from '@mui/joy';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { Activity } from '@/apiClients/stravaClient/models';
import { StravaClient } from '@/apiClients/stravaClient/stravaClient';
import { getToken } from 'next-auth/jwt';
import StravaActivityCard from '@/components/StravaActivityCard';

type Data = { activities: Activity[] };

const PAGE_SIZE = 9;

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
  const latestActivities = await stravaClient.getAthleteActivities(PAGE_SIZE);

  return {
    props: {
      data: {
        activities: latestActivities,
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
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {data.activities.map((d) => (
            <Grid key={d.id} xs={12} md={6} lg={4}>
              <StravaActivityCard activity={d} />
            </Grid>
          ))}
        </Grid>
      </Sheet>
    </main>
  );
}
