import { Box } from '@mui/joy';
import { Label, Legend, Line, LineChart, Tooltip, YAxis } from 'recharts';

import { StravaActivity } from '@/apiClients/stravaClient/models';
import { DOG_COLOR } from '@/colors';
import { GarminActivity } from '@/models/garminActivity';
import { Record } from '@/types';
import { metersToFeet } from '@/utils/distanceUtils';

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

type ChartOption = {
  dataKey: string;
  color: string;
  label: string;
};

type AltitudeChartProps = {
  data: Array<{ stravaAltitude: number; garminAltitude?: number }>;
  chartOptions: ChartOption[];
};

function AltitudeChart({ data, chartOptions }: AltitudeChartProps) {
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
      <Tooltip
        formatter={(value) => [
          `${metersToFeet(value as number).toFixed(2)} ft`,
          '',
        ]}
        animationDuration={300}
      />
      {chartOptions.map(({ dataKey, color, label }, idx) => (
        <Line
          key={dataKey}
          type="monotone"
          dot={false}
          dataKey={dataKey}
          stroke={color}
          strokeWidth={idx === 0 ? 6 : 4}
          label={label}
          strokeDasharray={idx === 0 ? undefined : '5 5'}
        />
      ))}
      <Legend />
    </LineChart>
  );
}

export function AltitudeMap({ activity, garminActivity }: AltitudeMapProps) {
  const stravaData = activity.records?.map(trimAltitude);
  const garminData = garminActivity?.records.map(trimAltitude);

  // const garminData = garminActivity?.records
  //   .map(trimAltitude)
  //   .map((x, idx) => ({
  //     ...x,
  //     altitude:
  //       idx % 100 === 0
  //         ? x.altitude + (Math.random() > 0.5 ? 50 : -25)
  //         : x.altitude,
  //   }));
  const stitched = stravaData?.map((stravaDatum, i) => {
    return {
      stravaAltitude: stravaDatum.altitude,
      garminAltitude: garminData ? garminData[i].altitude : undefined,
    };
  });

  if (!stitched) {
    return null;
  }

  return (
    <Box width={800} height={700}>
      <AltitudeChart
        data={stitched}
        chartOptions={[
          {
            label: 'Human Altitude',
            dataKey: 'stravaAltitude',
            color: DOG_COLOR,
          },
          { label: 'Dog Altitude', dataKey: 'garminAltitude', color: 'green' },
        ]}
      />
    </Box>
  );
}
