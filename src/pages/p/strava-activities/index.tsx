import { Grid, Sheet } from '@mui/joy';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import StravaActivityCard from '@/components/StravaActivityCard';
import { MilavisionAPI } from '@/apiClients/milavisionAPI/milaVisionAPI';
import { Activity } from '@/models/activity';

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

  const milavisionAPI = new MilavisionAPI(jwt.accessToken);
  const activities = await milavisionAPI.getActivities(PAGE_SIZE);

  return {
    props: {
      data: {
        activities,
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
