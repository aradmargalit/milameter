import TableRowsOutlinedIcon from '@mui/icons-material/TableRowsOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import { Grid, IconButton, Sheet, Stack, ToggleButtonGroup } from '@mui/joy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useEffect, useState } from 'react';

import { MilaMeterAPI } from '@/apiClients/milaMeterAPI/milaMeterAPI';
import { ActivityStats } from '@/components/ActivityMap/ActivityStats/ActivityStats';
import { AltitudeMap } from '@/components/ActivityMap/AltitudeMap';
import { activityHasRecords } from '@/components/ActivityMap/utils';
import ErrorAlert from '@/components/ErrorAlert';
import { BackButton } from '@/components/pages/activity/BackButton';
import { DetailedActivityMap } from '@/components/pages/activity/DetailedActivityMap';
import { ViewOnStrava } from '@/components/ViewOnStrava/ViewOnStrava';
import { ActivityPairProvider } from '@/contexts/ActivityPairContext/ActivityPairContext';
import { useMap } from '@/contexts/MapContext';
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

type Layout = 'sidebyside' | 'stacked';

export default function StravaActivityDetailPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { activity } = data;
  const [layout, setLayout] = useState<Layout>('sidebyside');
  const { mapRef, setHeight } = useMap();

  // Redraw the map if the selected layout changes
  useEffect(() => {
    mapRef.current?.resize();
  }, [mapRef, layout]);

  if (!activity) {
    return (
      <ErrorAlert errors={["Could not find activity, maybe it's private?"]} />
    );
  }

  if (!activityHasRecords(activity)) {
    return <ErrorAlert errors={['Activity does not have any GPS data.']} />;
  }

  function handleLayoutChange(newValue: Layout | null) {
    if (newValue === null) return;
    switch (newValue) {
      case 'stacked':
        setHeight('75vh');
        break;
      case 'sidebyside':
      default:
        setHeight('50vh');
        break;
    }
    setLayout(newValue);
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
              <ToggleButtonGroup
                value={layout}
                onChange={(_event, newValue) => handleLayoutChange(newValue)}
              >
                <IconButton value="sidebyside">
                  <ViewSidebarOutlinedIcon />
                </IconButton>
                <IconButton value="stacked">
                  <TableRowsOutlinedIcon />
                </IconButton>
              </ToggleButtonGroup>
            </Stack>
            <Grid container spacing={2}>
              <Grid xs={12} md={layout === 'sidebyside' ? 8 : 12}>
                <ActivityMeta />
                <DetailedActivityMap />
              </Grid>
              <Grid xs={12} md={layout === 'sidebyside' ? 4 : 12}>
                <ActivityStats />
              </Grid>
              <Grid xs={12} md={layout === 'sidebyside' ? 8 : 12}>
                <AltitudeMap />
              </Grid>
            </Grid>
          </Stack>
        </Sheet>
      </Layout>
    </ActivityPairProvider>
  );
}
