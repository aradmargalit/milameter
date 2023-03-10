import ArrowBack from '@mui/icons-material/ArrowBack';
import Place from '@mui/icons-material/Place';
import { Box, Button, Grid, Sheet, Stack, Typography } from '@mui/joy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';

import { MilaMeterAPI } from '@/apiClients/milaMeterAPI/milaMeterAPI';
import { ActivityStats } from '@/components/ActivityMap/ActivityStats';
import { DetailedActivityMapBase } from '@/components/ActivityMap/DetailedActivityMapBase';
import { DetailedActivityMapWithGarmin } from '@/components/ActivityMap/DetailedActivityMapWithGarmin';
import { Legend } from '@/components/ActivityMap/Legend';
import { activityHasRecords } from '@/components/ActivityMap/utils';
import ErrorAlert from '@/components/ErrorAlert';
import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { Layout } from '@/layout';
import { Activity } from '@/models/activity';

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

  const milaMeterAPI = new MilaMeterAPI(jwt.accessToken);
  const activity = await milaMeterAPI.getActivityById(stravaActivityId);
  return {
    props: { data: { activity } },
  };
};

export default function StravaActivityDetailPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { selectedGarminActivity } = useGarminActivities();
  const { activity } = data;

  if (!activity) {
    return (
      <ErrorAlert errors={["Could not find activity, maybe it's private?"]} />
    );
  }

  if (!activityHasRecords(activity)) {
    return <ErrorAlert errors={['Activity does not have any GPS data.']} />;
  }

  return (
    <Layout>
      <Sheet sx={{ margin: 4, borderRadius: 12, padding: 2 }}>
        <Stack spacing={2}>
          <Link href="/p/strava-activities" passHref>
            <Button startDecorator={<ArrowBack />} variant="outlined">
              Back
            </Button>
          </Link>
          <Grid container spacing={1}>
            <Grid xs={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography level="h4">{activity.name}</Typography>
                <Typography level="body1" startDecorator={<Place />}>
                  {activity.locationName}
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 500 }}>
                {selectedGarminActivity ? (
                  <DetailedActivityMapWithGarmin
                    activity={activity}
                    garminActivity={selectedGarminActivity}
                  />
                ) : (
                  <DetailedActivityMapBase activity={activity} />
                )}
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
