import { Box } from '@mui/joy';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { GarminActivity } from '@/models/garminActivity';

type AltitudeMapProps = {
  activity: StravaActivity;
  garminActivity: GarminActivity | null;
};

function makeData(num: number): { altitude: number } {
  return {
    altitude: parseFloat(num.toFixed(1)),
  };
}

export function AltitudeMap({ activity, garminActivity }: AltitudeMapProps) {
  const stravaData = activity.altitudeStream?.map(makeData);
  const garminData = garminActivity?.altitudeStream.map(makeData);

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
