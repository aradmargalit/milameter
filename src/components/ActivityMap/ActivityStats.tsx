import { Divider, Grid, Stack } from '@mui/joy';

import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';
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
  const { stravaActivity, garminActivity, derivedActivityProperties } =
    useActivityPair();

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
            <Grid>
              <Statistic
                name="Zoomies 💨"
                value={derivedActivityProperties.zoomies.length.toString()}
                units="zoomies"
              />
            </Grid>
          </Grid>
        )}
      </Stack>
      <Divider />
      {!!garminActivity && (
        <Grid>
          <Statistic
            name="Max Separation"
            value={derivedActivityProperties.maxSeparation.toFixed(0)}
            units="m"
          />
        </Grid>
      )}
    </Stack>
  );
}
