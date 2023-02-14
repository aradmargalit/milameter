import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { metersToMiles } from '@/utils/distanceUtils';
import { Typography } from '@mui/joy';

type ActivityStatsProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function ActivityStats({
  activity,
  garminActivity,
}: ActivityStatsProps) {
  return (
    <div>
      <Typography level="body1">
        🏃‍♂️: {metersToMiles(activity.distance).toFixed(2)} mi
      </Typography>
      {garminActivity ? (
        <Typography level="body1">
          🐶: {metersToMiles(garminActivity.distanceMeters).toFixed(2)} mi
        </Typography>
      ) : null}
    </div>
  );
}
