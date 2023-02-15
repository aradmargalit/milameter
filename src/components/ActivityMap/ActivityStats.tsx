import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { haversineDistance, metersToMiles } from '@/utils/distanceUtils';
import { convertGarminCoord, TEST_OFFSET } from '@/utils/garminUtils';
import { Stack, Typography } from '@mui/joy';
import { DateTime } from 'luxon';

type ActivityStatsProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function ActivityStats({
  activity,
  garminActivity,
}: ActivityStatsProps) {
  let maxDistance = null;

  if (garminActivity) {
    const activityTimes =
      activity.records &&
      activity.records.map(({ time }) => DateTime.fromISO(time));

    const garminTimes = garminActivity.records.map((record) =>
      DateTime.fromJSDate(new Date(record.timestamp))
    );

    if (activity.records) {
      maxDistance = activity.records.reduce(function (prevMax, activityRecord) {
        const activityTime = DateTime.fromISO(activityRecord.time);
        const maxDistAtTimepoint = garminActivity.records.reduce(function (
          prevDist,
          garminRecord
        ) {
          const garminTime = DateTime.fromJSDate(
            new Date(garminRecord.timestamp)
          );
          const timeDiff = Math.abs(
            garminTime.diff(activityTime, 'seconds').seconds
          );
          if (timeDiff < 5) {
            const currentDist = haversineDistance(activityRecord.coord, [
              convertGarminCoord(garminRecord.positionLong) + TEST_OFFSET,
              convertGarminCoord(garminRecord.positionLat) + TEST_OFFSET,
            ]);
            return Math.max(prevDist, currentDist);
          }
          return prevDist;
        },
        0);
        return Math.max(maxDistAtTimepoint, prevMax);
      }, 0);
      console.log(maxDistance);
    }

    console.log(garminTimes);
    console.log(activityTimes);
  }
  return (
    <div>
      <Typography level="body1">
        🏃‍♂️: {metersToMiles(activity.distance).toFixed(2)} mi
      </Typography>
      {garminActivity && (
        <Stack>
          <Typography level="body1">
            🐶: {metersToMiles(garminActivity.distanceMeters).toFixed(2)} mi
          </Typography>
          <Typography level="body1">
            Max Distance: {!!maxDistance && maxDistance.toFixed(2)} m
          </Typography>
        </Stack>
      )}
    </div>
  );
}
