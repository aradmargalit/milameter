import { Box } from '@mui/joy';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { GarminActivity } from '@/models/garminActivity';
import { metersToFeet } from '@/utils/distanceUtils';

import { AltitudeChart, AltitudeChartOption } from './AltitudeChart';

type AltitudeMapProps = {
  activity: StravaActivity;
  garminActivity: GarminActivity | null;
};

const BRAND_ORANGE = '#FF4500';
const SAMPLING_RATE = 10;

export function AltitudeMap({ activity, garminActivity }: AltitudeMapProps) {
  const data = activity.records?.map((stravaDatum, i) => {
    return {
      stravaAltitude: metersToFeet(stravaDatum.altitude),
      garminAltitude: garminActivity?.records
        ? metersToFeet(garminActivity?.records[i].altitude)
        : undefined,
    };
  });

  if (!data) {
    return null;
  }

  const chartOptions: AltitudeChartOption[] = [
    {
      label: 'Human Altitude',
      dataKey: 'stravaAltitude',
      color: BRAND_ORANGE,
    },
  ];

  if (garminActivity?.records) {
    chartOptions.push({
      label: 'Dog Altitude',
      dataKey: 'garminAltitude',
      color: 'green',
    });
  }

  const sampledData = data.filter((_, idx) => idx % SAMPLING_RATE === 0);

  return (
    <Box
      sx={{
        borderWidth: '2px',
        borderRadius: '5%',
      }}
    >
      <AltitudeChart data={sampledData} chartOptions={chartOptions} />
    </Box>
  );
}
