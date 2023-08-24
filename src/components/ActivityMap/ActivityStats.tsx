import { Divider, Grid, Stack } from '@mui/joy';

import {
  hasGarmin,
  useActivityPair,
} from '@/contexts/ActivityPairContext/ActivityPairContext';
import {
  computeMaxAccel,
  computeMaxDecel,
  computePace,
  metersToFeet,
  metersToMiles,
  paceFromSpeed,
} from '@/utils/distanceUtils';

import { Statistic } from './Statistic';

export function ActivityStats() {
  const activityPair = useActivityPair();
  const { stravaActivity } = activityPair;

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
        {hasGarmin(activityPair) && (
          <Grid container spacing={1}>
            <Grid>
              <Statistic
                name="🐶 Distance"
                value={metersToMiles(
                  activityPair.garminActivity.distance
                ).toFixed(2)}
                units="mi"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Pace"
                value={computePace(activityPair.garminActivity)}
                units="min/mi"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Max Pace"
                value={paceFromSpeed(activityPair.garminActivity.maxSpeed)}
                units="min/mi"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Max Acceleration"
                value={computeMaxAccel(
                  activityPair.garminActivity.records
                ).toFixed(1)}
                units="m/s^2"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Max Deceleration"
                value={computeMaxDecel(
                  activityPair.garminActivity.records
                ).toFixed(1)}
                units="m/s^2"
              />
            </Grid>
            <Grid>
              <Statistic
                name="🐶 Elevation Gain"
                value={metersToFeet(
                  activityPair.garminActivity.totalElevationGain
                ).toFixed(0)}
                units="ft"
              />
            </Grid>
          </Grid>
        )}
      </Stack>
      <Divider />
      {hasGarmin(activityPair) && (
        <Grid>
          <Statistic
            name="Max Separation"
            value={activityPair.derivedActivityProperties.maxSeparation.toFixed(
              0
            )}
            units="m"
          />
        </Grid>
      )}
    </Stack>
  );
}
