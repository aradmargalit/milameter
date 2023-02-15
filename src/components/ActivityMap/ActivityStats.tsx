import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { Coordinate, UNIXEpochSeconds, Record } from '@/types';
import { haversineDistance, metersToMiles } from '@/utils/distanceUtils';
import { Stack, Typography } from '@mui/joy';

function makeRecordMap(records: Record[]): Map<UNIXEpochSeconds, Coordinate> {
  return new Map(records.map(({ time, coord }) => [time, coord]));
}

type ActivityStatsProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function ActivityStats({
  activity,
  garminActivity,
}: ActivityStatsProps) {
  let maxDistance = 0;

  if (garminActivity && activity.records) {
    // create a mapping from unix epoch seconds to coordinates
    const garminRecordsMap = makeRecordMap(garminActivity.records);

    // iterate over source activities
    makeRecordMap(activity.records).forEach(
      (activityCoord: Coordinate, time: UNIXEpochSeconds) => {
        const garminCoord = garminRecordsMap.get(time);
        const distance = garminCoord
          ? haversineDistance(garminCoord, activityCoord)
          : 0;
        maxDistance = Math.max(maxDistance, distance);
      }
    );
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
