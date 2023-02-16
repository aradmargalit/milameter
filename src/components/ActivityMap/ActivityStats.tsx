import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { getSeparationTrajectory, metersToMiles } from '@/utils/distanceUtils';
import { Grid } from '@mui/joy';
import { Statistic } from './Statistic';

type ActivityStatsProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function ActivityStats({
  activity,
  garminActivity,
}: ActivityStatsProps) {
  const separationTrajectory =
    garminActivity && activity.records
      ? getSeparationTrajectory(activity.records, garminActivity.records)
      : null;

  const maxSeparation =
    separationTrajectory &&
    Math.max(...separationTrajectory.map((separation) => separation.distance));

  return (
    <div>
      <Grid container spacing={1}>
        <Grid>
          <Statistic
            name="🏃‍♂️ Distance"
            value={metersToMiles(activity.distance)}
            units="mi"
          />
        </Grid>

        {garminActivity && (
          <Grid>
            <Statistic
              name="🐶 Distance"
              value={metersToMiles(garminActivity.distanceMeters)}
              units="mi"
            />
          </Grid>
        )}
        {!!maxSeparation && (
          <Grid>
            <Statistic name="Max Separation" value={maxSeparation} units="m" />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
