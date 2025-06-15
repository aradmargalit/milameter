import { Divider, Sheet, Stack } from '@mui/joy';
import { getCookie } from 'cookies-next';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { useState } from 'react';

import { MilaMeterAPI } from '@/apiClients/milaMeterAPI/milaMeterAPI';
import ActivityGrid from '@/components/ActivityGrid';
import ErrorAlert from '@/components/ErrorAlert';
import GarminUploadSection from '@/components/GarminUploadSection';
import { buildActivityPairs } from '@/components/pages/strava-activities/buildActivityPairs';
import { fetchMore } from '@/components/pages/strava-activities/fetchMore';
import { LoadingIndicator } from '@/components/Pagination/LoadingIndicator';
import { NoMoreResults } from '@/components/Pagination/NoMoreResults';
import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Layout } from '@/layout';
import { Activity } from '@/models/activity';
import { GARMIN_UPLOAD_INSTRUCTIONS_OPEN_COOKIE } from '@/storage/cookies';
import { uniqueBy } from '@/utils/uniqueBy';

type Data = { activities: Activity[]; instructionsOpen: boolean };

// We want to eventually land on roughly 9, but a few non-GPS activities may get filtered
const DESIRED_PAGE_SIZE = 9;
const ITEM_LIMIT = 100;

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async ({
  req,
  res,
}) => {
  const jwt = await getToken({ req });

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
  const activities = await milaMeterAPI.getActivities(DESIRED_PAGE_SIZE);

  // get preferences from cookies
  const garminUploadOpen = await getCookie(
    GARMIN_UPLOAD_INSTRUCTIONS_OPEN_COOKIE,
    { req, res }
  );
  const instructionsOpen = garminUploadOpen === 'false' ? false : true;

  return {
    props: {
      data: {
        activities,
        instructionsOpen,
      },
    },
  };
};

export default function StravaActivities({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [activities, setActivities] = useState<Activity[]>(data.activities);
  const { garminActivities } = useGarminActivities();

  const onFetchSuccess = (newActivities: Activity[]) => {
    // we can get duplicates if new activities are added between fetches, de-dupe
    setActivities(uniqueBy([...activities, ...newActivities], 'id'));
  };

  const { scrollTriggerRef, hasNextPage, limitReached } = useInfiniteScroll<
    HTMLDivElement,
    Activity[]
  >({
    fetchMore,
    initialHasNextPage: true,
    initialItemsLoaded: data.activities.length,
    itemLimit: ITEM_LIMIT,
    onFetchSuccess,
    pageSize: DESIRED_PAGE_SIZE,
  });

  if (!activities.length) {
    return (
      <Sheet sx={{ borderRadius: 12, margin: 4, padding: 4 }}>
        <ErrorAlert
          errors={[
            'You do not have any recent Strava activities with GPS data.',
          ]}
        />
      </Sheet>
    );
  }

  const validGarminActivities = garminActivities.filter(
    (gA) => gA.records?.length > 0
  );

  const activityPairs = buildActivityPairs(activities, validGarminActivities);

  return (
    <Layout>
      <Sheet
        sx={{
          borderRadius: 12,
          margin: { md: 4, xs: 1 },
          padding: { md: 4, xs: 1 },
        }}
      >
        <GarminUploadSection instructionsOpen={data.instructionsOpen} />
        <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
        <ActivityGrid activityPairs={activityPairs} />
        <Stack direction="row" justifyContent="center" marginTop={2}>
          {hasNextPage && (
            <div ref={scrollTriggerRef}>
              <LoadingIndicator variant="soft" size="lg" />
            </div>
          )}
          {!hasNextPage && (
            <NoMoreResults limit={limitReached ? ITEM_LIMIT : undefined} />
          )}
        </Stack>
      </Sheet>
    </Layout>
  );
}
