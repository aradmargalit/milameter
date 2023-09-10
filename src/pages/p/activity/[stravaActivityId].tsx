import { Grid, Sheet, Stack } from '@mui/joy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { MilaMeterAPI } from '@/apiClients/milaMeterAPI/milaMeterAPI';
import { ActivityStats } from '@/components/ActivityMap/ActivityStats/ActivityStats';
import { AltitudeMap } from '@/components/ActivityMap/AltitudeMap';
import { activityHasRecords } from '@/components/ActivityMap/utils';
import ErrorAlert from '@/components/ErrorAlert';
import { BackButton } from '@/components/pages/activity/BackButton';
import { DetailedActivityMap } from '@/components/pages/activity/DetailedActivityMap';
import { ViewOnStrava } from '@/components/ViewOnStrava/ViewOnStrava';
import { ActivityPairProvider } from '@/contexts/ActivityPairContext/ActivityPairContext';
import { Layout } from '@/layout';
import { Activity } from '@/models/activity';

import { ActivityMeta } from '../../../components/pages/activity/ActivityMeta';

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
    <ActivityPairProvider stravaActivity={activity}>
      <Layout>
        <Sheet
          sx={{
            borderRadius: 12,
            margin: { md: 4, xs: 1 },
            padding: { md: 2, xs: 1 },
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BackButton />
              {/* Required by the Strava Brand Guidelines: https://developers.strava.com/guidelines/ */}
              <ViewOnStrava activityId={activity.id} />
            </Stack>
            <Grid container spacing={2}>
              <Grid xs={12} md={8}>
                <ActivityMeta />
                <DetailedActivityMap />
              </Grid>
              <Grid xs={12} md={4}>
                <ActivityStats />
              </Grid>
              <Grid xs={12} md={8}>
                <AltitudeMap />
              </Grid>
            </Grid>
          </Stack>
        </Sheet>
      </Layout>
    </ActivityPairProvider>
  );
}
