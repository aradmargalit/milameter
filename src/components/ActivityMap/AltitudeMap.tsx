import { Box } from '@mui/joy';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

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

export function AltitudeMap({ activity, garminActivity }: AltitudeMapProps) {
  const stravaData = activity.records?.map(trimAltitude);
  const garminData = garminActivity?.records.map(trimAltitude);

  if (!stravaData) {
    return null;
  }

  return (
    <Box width={500} height={300}>
      <LineChart data={stravaData} width={500} height={150} syncId="sync">
        <XAxis />
        <YAxis />
        <Tooltip />

        <Line type="natural" dataKey="altitude" stroke="red" />
      </LineChart>
      <LineChart data={garminData} width={500} height={150} syncId="sync">
        <XAxis />
        <YAxis />
        <Tooltip />
        <Line type="natural" dataKey="altitude" stroke="red" />
      </LineChart>
    </Box>
  );
}
