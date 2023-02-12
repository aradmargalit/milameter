import { Activity } from '@/apiClients/stravaClient/models';
import { StravaClient } from '@/apiClients/stravaClient/stravaClient';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import { getToken } from 'next-auth/jwt';
import { DetailedActivityMap } from '@/components/ActivityMap/DetailedActivityMap';
import { Box, Button, Grid, Sheet, Stack, Typography } from '@mui/joy';
import { ArrowBack } from '@mui/icons-material';

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

  const stravaClient = new StravaClient(jwt.accessToken);
  const activity = await stravaClient.getActivityById(stravaActivityId);

  return {
    props: { data: { activity } },
  };
};

export default function StravaActivityDetailPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (!data.activity) {
    return <p>Could not find activity</p>;
  }

  const { activity } = data;
  return (
    <Sheet sx={{ margin: 4 }}>
      <Stack spacing={2}>
        <Link href="/p/strava-activities" passHref>
          <Button startDecorator={<ArrowBack />}>Back</Button>
        </Link>
        <Typography level="h4">{activity.name}</Typography>
        <Grid container>
          <Grid xs={8}>
            <Box sx={{ width: '100%', height: 500 }}>
              <DetailedActivityMap activity={activity} />
            </Box>
          </Grid>
          <Grid xs={4}>Sick Stats</Grid>
        </Grid>
      </Stack>
    </Sheet>
  );
}
