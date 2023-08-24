import { Divider, Grid, Stack } from '@mui/joy';

import { useActivityPair } from '@/contexts/ActivityPairContext';
import {
  computeMaxAccel,
  computeMaxDecel,
  computePace,
  getSeparationTrajectory,
  metersToFeet,
  metersToMiles,
  paceFromSpeed,
} from '@/utils/distanceUtils';

import { Statistic } from './Statistic';

export function ActivityStats() {
  const { stravaActivity, garminActivity } = useActivityPair();

  const separationTrajectory =
    garminActivity && stravaActivity.records
      ? getSeparationTrajectory(stravaActivity.records, garminActivity.records)
      : null;

  const maxSeparation =
    separationTrajectory &&
    Math.max(...separationTrajectory.map((separation) => separation.distance));

  return (
    <Stack>
      <Stack direction="row">
        <Grid container spacing={1}>
          <Grid>
            <Statistic
              name="🏃‍♂️ Distance"
              value={metersToMiles(stravaActivity.distance).toFixed(2)}
              units="mi"
            />
          </Grid>
          <Grid>
            <Statistic
              name="🏃‍♂️ Pace"
              value={computePace(stravaActivity)}
              units="min/mi"
            />
          </Grid>
          <Grid>
            <Statistic
              name="🏃‍♂️ Max Pace"
              value={paceFromSpeed(stravaActivity.maxSpeed)}
              units="min/mi"
            />
          </Grid>
          {stravaActivity.records && (
            <>
              <Grid>
                <Statistic
                  name="🏃‍♂️ Max Acceleration"
                  value={computeMaxAccel(stravaActivity.records).toFixed(1)}
                  units="m/s^2"
                />
              </Grid>
              <Grid>
                <Statistic
                  name="🏃‍♂️ Max Deceleration"
                  value={computeMaxDecel(stravaActivity.records).toFixed(1)}
                  units="m/s^2"
                />
              </Grid>
            </>
          )}

          <Grid>
            <Statistic
              name="🏃‍♂️ Elevation Gain"
              value={metersToFeet(stravaActivity.totalElevationGain).toFixed(0)}
              units="ft"
            />
          </Grid>
        </Grid>
        {garminActivity && (
          <Grid container spacing={1}>
            <Grid>
              <Statistic
                name="🐶 Distance"
                value={metersToMiles(garminActivity.distance).toFixed(2)}
                units="mi"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Pace"
                value={computePace(garminActivity)}
                units="min/mi"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Max Pace"
                value={paceFromSpeed(garminActivity.maxSpeed)}
                units="min/mi"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Max Acceleration"
                value={computeMaxAccel(garminActivity.records).toFixed(1)}
                units="m/s^2"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Max Deceleration"
                value={computeMaxDecel(garminActivity.records).toFixed(1)}
                units="m/s^2"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Elevation Gain"
                value={metersToFeet(garminActivity.totalElevationGain).toFixed(
                  0
                )}
                units="ft"
              />
            </Grid>
          </Grid>
        )}
      </Stack>
      <Divider />
      {!!maxSeparation && (
        <Grid>
          <Statistic
            name="Max Separation"
            value={maxSeparation.toFixed(0)}
            units="m"
          />
        </Grid>
      )}
    </Stack>
  );
}
