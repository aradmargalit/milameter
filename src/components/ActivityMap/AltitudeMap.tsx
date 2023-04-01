import { Box, useTheme } from '@mui/joy';
import { DateTime } from 'luxon';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { GarminActivity } from '@/models/garminActivity';

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
  if (!activity.records?.length) return;

  const startTime = DateTime.fromISO(activity.startDate);
  const endTime = DateTime.fromSeconds(
    activity.records[activity.records.length - 1].time
  );

  const start = startTime.toSeconds();
  const end = endTime.toSeconds();

  // Init an array with one element for every second between Strava start and end
  const sparseArray = [...new Array(end - start)];
  for (let i = 0; i < sparseArray.length; i++) {
    sparseArray[i] = {
      secondsSinceStart: null,
      stravaAltitude: null,
      garminAltitude: null,
    };
  }

  activity.records.forEach((rec) => {
    if (rec.time >= start && rec.time < end) {
      const idx = rec.time - start;
      sparseArray[idx].secondsSinceStart = rec.time - start;
      sparseArray[idx].stravaAltitude = rec.altitude;
    }
  });

  garminActivity?.records.forEach((rec) => {
    // check bounds
    if (rec.time >= start && rec.time < end) {
      sparseArray[rec.time - start].garminAltitude = rec.altitude;
    }
  });

  return sparseArray.filter((x) => x.secondsSinceStart);
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
