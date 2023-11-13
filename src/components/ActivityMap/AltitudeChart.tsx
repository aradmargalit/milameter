import { useTheme } from '@mui/joy';
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

import { useDisplayIsSizeOrLarger } from '@/hooks/useDisplayIsSizeOrLarger';
import { secondsToDuration } from '@/utils/timeUtils';

export type AltitudeChartOption = {
  dataKey: string;
  color: string;
  label: string;
  strokeWidthPx: number;
};

export type AltitudePoint = {
  secondsSinceStart: number | null;
  stravaAltitude: number | null;
  garminAltitude: number | null;
};

type AltitudeChartProps = {
  data: Array<AltitudePoint>;
  chartOptions: AltitudeChartOption[];
};

const AXIS_PADDING_FEET = 20;

export function AltitudeChart({ data, chartOptions }: AltitudeChartProps) {
  const theme = useTheme();
  const isMediumOrLarger = useDisplayIsSizeOrLarger('md');

  return (
    <ResponsiveContainer
      minWidth={300}
      width="100%"
      aspect={isMediumOrLarger ? 3.5 : 1.5}
    >
      <LineChart
        data={data}
        margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
      >
        <XAxis
          dataKey="secondsSinceStart"
          tickFormatter={(value) => secondsToDuration(value)}
          minTickGap={50}
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
          contentStyle={{
            background: theme.palette.background.backdrop,
            borderRadius: '15%',
          }}
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
            connectNulls
          />
        ))}
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
