import { Box } from '@mui/joy';
import { Label, Line, LineChart, Tooltip, YAxis } from 'recharts';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { GarminActivity } from '@/models/garminActivity';
import { Record } from '@/types';

type AltitudeMapProps = {
  activity: StravaActivity;
  garminActivity: GarminActivity | null;
};

function trimAltitude(record: Record): Record {
  return {
    ...record,
    altitude: parseFloat(record.altitude.toFixed(1)),
  };
}

type AltitudeChartProps = {
  data: Record[];
  strokeColor: string;
};
function AltitudeChart({ data, strokeColor }: AltitudeChartProps) {
  return (
    <LineChart
      data={data}
      width={800}
      height={300}
      syncId="sync"
      margin={{ bottom: 10, top: 10, left: 10, right: 10 }}
    >
      <YAxis>
        <Label
          angle={-90}
          value="Meters"
          position="insideLeft"
          style={{ textAnchor: 'middle' }}
        />
      </YAxis>
      <Tooltip />

      <Line
        type="monotone"
        dot={false}
        dataKey="altitude"
        stroke={strokeColor}
        strokeWidth={4}
      />
    </LineChart>
  );
}

export function AltitudeMap({ activity, garminActivity }: AltitudeMapProps) {
  const stravaData = activity.records?.map(trimAltitude);
  const garminData = garminActivity?.records.map(trimAltitude);

  if (!stravaData) {
    return null;
  }

  return (
    <Box width={800} height={700}>
      <AltitudeChart data={stravaData} strokeColor="red" />
      {garminData && <AltitudeChart data={garminData} strokeColor="blue" />}
    </Box>
  );
}
