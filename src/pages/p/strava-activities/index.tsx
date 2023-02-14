import { Divider, Sheet } from '@mui/joy';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import { MilavisionAPI } from '@/apiClients/milavisionAPI/milaVisionAPI';
import { Activity } from '@/models/activity';
import ActivityGrid from '@/components/ActivityGrid';
import GarminFilePicker from '@/components/GarminFilePicker';
import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { GarminActivity } from '@/models/garminActivity';
import { DateTime } from 'luxon';

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

function activityDistance(
  garminActivity: GarminActivity,
  activity: Activity
): number {
  // return [0, 1]
  const targetStartTime = DateTime.fromISO(activity.startDate, {
    setZone: true,
  }).toLocal();
  const garminStartTime = DateTime.fromJSDate(
    new Date(garminActivity.records[0].timestamp)
  );
  const startTimeOffset = Math.abs(
    targetStartTime.diff(garminStartTime, 'seconds').seconds
  );

  const BIGGEST_GAP_SEC = 30 * 60; // 30 minutes
  const fracGap = Math.min(startTimeOffset, BIGGEST_GAP_SEC) / BIGGEST_GAP_SEC;
  return fracGap;
}

export default function StravaActivities({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { garminActivities } = useGarminActivities();

  const mappedActivities = data.activities.map((activity) => {
    const distances = garminActivities.map((gA) =>
      activityDistance(gA, activity)
    );
    const argMin = distances.indexOf(Math.min(...distances));

    if (distances[argMin] < 0.5) {
      return garminActivities[argMin];
    }
    return null;
  });

  return (
    <main>
      <Sheet sx={{ margin: 4, padding: 4 }}>
        <GarminFilePicker />
        <Divider sx={{ marginTop: 4, marginBottom: 4 }} />
        <ActivityGrid
          activities={data.activities}
          matchingGarminActivities={mappedActivities}
        />
      </Sheet>
    </main>
  );
}
