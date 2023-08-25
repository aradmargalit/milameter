import { Box, useTheme } from '@mui/joy';
import { DateTime } from 'luxon';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';
import { GarminActivity } from '@/models/garminActivity';
import { metersToFeet } from '@/utils/distanceUtils';
import { mean } from '@/utils/mathUtils';

import {
  AltitudeChart,
  AltitudeChartOption,
  AltitudePoint,
} from './AltitudeChart';

const BRAND_ORANGE = '#FF4500';

// Rendering every data point results in a pretty choppy graph
// this controls how many points are skipped before rendering another
const SAMPLING_RATE = 5;

function getMeanElevation(
  data: AltitudePoint[],
  key: keyof AltitudePoint
): number {
  return mean(data.map((x) => x[key]).filter((x): x is number => x !== null));
}

function matchMeanElevation(data: AltitudePoint[]): AltitudePoint[] {
  const stravaMean = getMeanElevation(data, 'stravaAltitude');
  const garminMean = getMeanElevation(data, 'garminAltitude');

  const meanDiff = stravaMean - garminMean || 0;

  return data.map((point) => ({
    ...point,
    stravaAltitude: point.stravaAltitude
      ? point.stravaAltitude - meanDiff
      : null,
  }));
}

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
  const sparseArray = new Array<AltitudePoint>(end - start);
  for (let i = 0; i < sparseArray.length; i++) {
    sparseArray[i] = {
      garminAltitude: null,
      secondsSinceStart: null,
      stravaAltitude: null,
    };
  }

  activity.records.forEach((rec) => {
    if (rec.time >= start && rec.time < end) {
      const idx = rec.time - start;
      sparseArray[idx].secondsSinceStart = rec.time - start;
      sparseArray[idx].stravaAltitude = metersToFeet(rec.altitude);
    }
  });

  garminActivity?.records.forEach((rec) => {
    if (rec.time >= start && rec.time < end) {
      sparseArray[rec.time - start].garminAltitude = metersToFeet(rec.altitude);
    }
  });

  const filtered = sparseArray.filter((x) => x.secondsSinceStart);

  // adjust strava data so that mean elevation is matched
  return matchMeanElevation(filtered);
}

export function AltitudeMap() {
  const { stravaActivity, garminActivity } = useActivityPair();
  const theme = useTheme();
  const data = makeChartData(stravaActivity, garminActivity);

  if (!data) {
    return null;
  }

  const chartOptions: AltitudeChartOption[] = [
    {
      color: theme.palette.text.primary,
      dataKey: 'stravaAltitude',
      label: 'Human Altitude',
      strokeWidthPx: 5,
    },
  ];

  if (garminActivity?.records) {
    chartOptions.push({
      color: BRAND_ORANGE,
      dataKey: 'garminAltitude',
      label: 'Dog Altitude',
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
