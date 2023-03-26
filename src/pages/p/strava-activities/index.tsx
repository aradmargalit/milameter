import { Divider, Sheet } from '@mui/joy';
import { getCookie } from 'cookies-next';
import { DateTime } from 'luxon';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';

import { MilaMeterAPI } from '@/apiClients/milaMeterAPI/milaMeterAPI';
import ActivityGrid from '@/components/ActivityGrid';
import ErrorAlert from '@/components/ErrorAlert';
import GarminUploadSection from '@/components/GarminUploadSection';
import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { Layout } from '@/layout';
import { Activity } from '@/models/activity';
import { ActivityPair } from '@/models/activityPair';
import { GarminActivity } from '@/models/garminActivity';
import { GARMIN_UPLOAD_INSTRUCTIONS_OPEN_COOKIE } from '@/storage/cookies';

type Data = { activities: Activity[]; instructionsOpen: boolean };

// We want to eventually land on roughly 9, but a few non-GPS activities may get filtered
const DESIRED_PAGE_SIZE = 9;

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
  const instructionsOpen = Boolean(
    getCookie(GARMIN_UPLOAD_INSTRUCTIONS_OPEN_COOKIE, { req, res })
  );

  //todo: extract collapse preference, drill to page, make into local context

  return {
    props: {
      data: {
        activities,
        instructionsOpen,
      },
    },
  };
};

/**
 * compute an abstract numeric "distance" score between a given garmin activity and
 * standard activity.
 * Currently this just computes the time difference, with a cutoff of 1 hour
 *
 * @param garminActivity activity from the watch
 * @param activity primary activity to compare against
 * @param timeGapCutoff the longest amount of time (in seconds) that we'll consider as
 *  possibly belonging to the same activity (default: 1 hour = 3600 seconds)
 * @returns a value between 0 and 1 indicating the dissimilarity between the activities
 *  (lower is better)
 */
function activityDistance(
  garminActivity: GarminActivity,
  activity: Activity,
  timeGapCutoff: number = 60 * 60
): number {
  // convert times from both activities to luxon DateTime objects
  const targetStartTime = DateTime.fromISO(activity.startDate);

  // the garmin FIT decoder exports the timestamp as a stringified JS Date, so we can
  // reconstitute it that way before jamming it into a luxon.DateTime object
  const garminStartTime = DateTime.fromSeconds(garminActivity.records[0].time);

  // find the absolute difference in seconds (we don't care which watch started first)
  const startTimeOffset = Math.abs(
    targetStartTime.diff(garminStartTime, 'seconds').seconds
  );

  // the final distance is the fraction of the maximum cutoff
  return Math.min(startTimeOffset, timeGapCutoff) / timeGapCutoff;
}

export default function StravaActivities({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { garminActivities } = useGarminActivities();

  if (!data.activities.length) {
    return (
      <Sheet sx={{ margin: 4, padding: 4, borderRadius: 12 }}>
        <ErrorAlert
          errors={[
            'You do not have any recent Strava activities with GPS data.',
          ]}
        />
      </Sheet>
    );
  }

  // for each activity, find the garmin activity with the lowest dissimilarity. If that
  // dissimilarity is above an arbitrarily threshold (0.5 for now), assume there's no
  // good match
  const activityPairs: ActivityPair[] = data.activities.map((activity) => {
    const distances = garminActivities.map((gA) =>
      activityDistance(gA, activity)
    );
    const argMin = distances.indexOf(Math.min(...distances));

    if (distances[argMin] < 0.5) {
      return {
        activity,
        garminActivity: garminActivities[argMin],
      };
    }
    return { activity, garminActivity: null };
  });

  return (
    <main>
      <Layout>
        <Sheet sx={{ margin: 4, padding: 4, borderRadius: 12 }}>
          <GarminUploadSection instructionsOpen={data.instructionsOpen} />
          <Divider sx={{ marginTop: 4, marginBottom: 4 }} />
          <ActivityGrid activityPairs={activityPairs} />
        </Sheet>
      </Layout>
    </main>
  );
}
