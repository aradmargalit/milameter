import {
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { secondsToDuration } from '@/utils/timeUtils';

export type AltitudeChartOption = {
  dataKey: string;
  color: string;
  label: string;
  strokeWidthPx: number;
};

type AltitudeChartProps = {
  data: Array<{
    stravaAltitude: number;
    garminAltitude?: number;
    secondsSinceStart: number;
  }>;
  chartOptions: AltitudeChartOption[];
};

const AXIS_PADDING_FEET = 20;

export function AltitudeChart({ data, chartOptions }: AltitudeChartProps) {
  return (
    <ResponsiveContainer width="100%" aspect={3.5}>
      <LineChart
        data={data}
        margin={{ bottom: 10, top: 10, left: 10, right: 10 }}
      >
        <XAxis
          dataKey="secondsSinceStart"
          tickFormatter={(value) => secondsToDuration(value)}
          interval={10}
        />
        <YAxis
          domain={[
            (dataMin: number) => Math.max(dataMin - AXIS_PADDING_FEET, 0),
            (dataMax: number) => dataMax + AXIS_PADDING_FEET,
          ]}
          tickFormatter={(tick, _) => Math.floor(tick).toString()}
        >
          <Label
            angle={-90}
            value="Feet"
            position="insideLeft"
            style={{ textAnchor: 'middle' }}
          />
        </YAxis>
        <Tooltip
          formatter={(value) => [`${(value as number).toFixed(2)} ft`]}
          labelFormatter={(label) => secondsToDuration(label)}
          animationDuration={200}
        />
        {chartOptions.map(({ dataKey, color, label, strokeWidthPx }) => (
          <Line
            key={dataKey}
            type="monotone"
            dot={false}
            dataKey={dataKey}
            stroke={color}
            strokeWidth={strokeWidthPx}
            label={label}
            name={label}
          />
        ))}
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}