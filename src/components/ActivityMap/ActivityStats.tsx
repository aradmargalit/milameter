import { Grid } from '@mui/joy';

import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import {
  computePace,
  getSeparationTrajectory,
  metersToMiles,
} from '@/utils/distanceUtils';

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
            value={metersToMiles(activity.distance).toFixed(2)}
            units="mi"
          />
        </Grid>
        <Grid>
          <Statistic
            name="🏃‍♂️ Pace"
            value={computePace(activity)}
            units="min/mi"
          />
        </Grid>

        {garminActivity && (
          <Grid>
            <Statistic
              name="🐶 Distance"
              value={metersToMiles(garminActivity.distance).toFixed(2)}
              units="mi"
            />
          </Grid>
        )}
        {garminActivity && (
          <Grid>
            <Statistic
              name="🐶 Pace"
              value={computePace(garminActivity)}
              units="min/mi"
            />
          </Grid>
        )}
        {!!maxSeparation && (
          <Grid>
            <Statistic
              name="Max Separation"
              value={maxSeparation.toFixed(0)}
              units="m"
            />
          </Grid>
        )}
      </Grid>
    </div>
  );
}
