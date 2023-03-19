import { Box, useTheme } from '@mui/joy';
import { DateTime } from 'luxon';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { GarminActivity } from '@/models/garminActivity';
import { metersToFeet } from '@/utils/distanceUtils';

import { AltitudeChart, AltitudeChartOption } from './AltitudeChart';

type AltitudeMapProps = {
  activity: StravaActivity;
  garminActivity: GarminActivity | null;
};

const BRAND_ORANGE = '#FF4500';

// Rendering every data point results in a pretty choppy graph
// this controls how many points are skipped before rendering another
const SAMPLING_RATE = 10;

function makeChartData(
  activity: StravaActivity,
  garminActivity: GarminActivity | null
) {
  const startTime = DateTime.fromISO(activity.startDate);

  return activity.records?.map((stravaDatum, i) => {
    const secondsSinceStart = DateTime.fromSeconds(stravaDatum.time).diff(
      startTime,
      'seconds'
    ).seconds;

    const stravaAltitude = metersToFeet(stravaDatum.altitude);
    const garminAltitude = garminActivity?.records
      ? metersToFeet(garminActivity?.records[i]?.altitude)
      : undefined;

    return {
      secondsSinceStart,
      stravaAltitude,
      garminAltitude,
    };
  });
}

export function AltitudeMap({ activity, garminActivity }: AltitudeMapProps) {
  const theme = useTheme();
  const data = makeChartData(activity, garminActivity);

  if (!data) {
    return null;
  }

  const chartOptions: AltitudeChartOption[] = [
    {
      label: 'Human Altitude',
      dataKey: 'stravaAltitude',
      color: theme.palette.text.primary,
      strokeWidthPx: 5,
    },
  ];

  if (garminActivity?.records) {
    chartOptions.push({
      label: 'Dog Altitude',
      dataKey: 'garminAltitude',
      color: BRAND_ORANGE,
      strokeWidthPx: 2,
    });
  }

  const sampledData = data.filter((_, idx) => idx % SAMPLING_RATE === 0);

  return (
    <Box>
      <AltitudeChart data={sampledData} chartOptions={chartOptions} />
    </Box>
  );
}
