import { useTheme } from '@mui/joy';
import {
  Area,
  AreaChart,
  Label,
  Legend,
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
      <AreaChart
        data={data}
        margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
      >
        <defs>
          {chartOptions.map(({ dataKey, color }) => (
            <linearGradient
              key={dataKey}
              id={`${dataKey}color`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
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
        {chartOptions.map(({ dataKey, color, label }) => (
          <Area
            key={dataKey}
            type="monotone"
            dot={false}
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            label={label}
            name={label}
            connectNulls
            fill={`url(#${dataKey}color)`}
            fillOpacity={0.5}
          />
        ))}
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}
