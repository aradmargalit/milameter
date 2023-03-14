import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import { StravaActivity } from '@/apiClients/stravaClient/models';

type AltitudeMapProps = {
  activity: StravaActivity;
};

export function AltitudeMap({ activity }: AltitudeMapProps) {
  const data = activity.altitudeStream?.map((a) => ({ a }));

  console.log(data);

  if (!data) {
    return null;
  }

  return (
    <LineChart width={400} height={400} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Line type="natural" dataKey="a" stroke="red" />
    </LineChart>
  );
}
