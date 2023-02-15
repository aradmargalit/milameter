import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { metersToMiles } from '@/utils/distanceUtils';
import { Typography } from '@mui/joy';
import { DateTime } from 'luxon';

type ActivityStatsProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function ActivityStats({
  activity,
  garminActivity,
}: ActivityStatsProps) {
  if (garminActivity) {
    const activityTimes =
      activity.records &&
      activity.records.map(({ time }) => DateTime.fromISO(time));

    const garminTimes = garminActivity.records.map((record) =>
      DateTime.fromJSDate(new Date(record.timestamp))
    );

    console.log(garminTimes);
    console.log(activityTimes);
  }
  return (
    <div>
      <Typography level="body1">
        🏃‍♂️: {metersToMiles(activity.distance).toFixed(2)} mi
      </Typography>
      {garminActivity && (
        <Typography level="body1">
          🐶: {metersToMiles(garminActivity.distanceMeters).toFixed(2)} mi
        </Typography>
      )}
    </div>
  );
}
