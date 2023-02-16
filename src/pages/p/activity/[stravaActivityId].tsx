import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';
import { DetailedActivityMap } from '@/components/ActivityMap/DetailedActivityMap';
import { Box, Button, Grid, Sheet, Stack, Typography } from '@mui/joy';
import { ArrowBack } from '@mui/icons-material';
import { MilavisionAPI } from '@/apiClients/milavisionAPI/milaVisionAPI';
import { Activity } from '@/models/activity';
import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { ActivityStats } from '@/components/ActivityMap/ActivityStats';
import { Layout } from '@/layout';
import { Legend } from '@/components/ActivityMap/Legend';

type Data = {
  activity: Activity | null;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const stravaActivityId = context.query?.stravaActivityId; // Get ID from slug `/book/1`

  if (typeof stravaActivityId !== 'string') {
    return {
      props: { data: { activity: null } },
    };
  }

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
  const activity = await milavisionAPI.getActivityById(stravaActivityId);
  return {
    props: { data: { activity } },
  };
};

export default function StravaActivityDetailPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { selectedGarminActivity } = useGarminActivities();
  if (!data.activity) {
    return <p>Could not find activity</p>;
  }

  const { activity } = data;
  return (
    <Layout>
      <Sheet sx={{ margin: 4 }}>
        <Stack spacing={2}>
          <Link href="/p/strava-activities" passHref>
            <Button startDecorator={<ArrowBack />}>Back</Button>
          </Link>
          <Typography level="h4">{activity.name}</Typography>
          <Grid container spacing={1}>
            <Grid xs={8}>
              <Box sx={{ width: '100%', height: 500 }}>
                <DetailedActivityMap
                  activity={activity}
                  garminActivity={selectedGarminActivity}
                />
              </Box>
              {selectedGarminActivity && <Legend />}
            </Grid>
            <Grid xs={4}>
              <ActivityStats
                activity={activity}
                garminActivity={selectedGarminActivity}
              />
            </Grid>
          </Grid>
        </Stack>
      </Sheet>
    </Layout>
  );
}
