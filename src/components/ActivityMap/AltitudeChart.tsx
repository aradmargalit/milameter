import { Button, Stack, Typography, useTheme } from '@mui/joy';
import {
  Area,
  AreaChart,
  Label,
  Legend,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useDisplayIsSizeOrLarger } from '@/hooks/useDisplayIsSizeOrLarger';
import { secondsToDuration } from '@/utils/timeUtils';

import { useDragZoom } from './hooks/useDragZoom';

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
  const {
    bottom,
    isZoomed,
    resetZoom,
    left,
    onMouseDown,
    onMouseLeave,
    onMouseMove,
    onMouseUp,
    right,
    top,
    dataSlice,
    refLeft,
    refRight,
  } = useDragZoom({
    data,
    dataKeys: chartOptions.map((co) => co.dataKey) as Array<
      keyof AltitudePoint
    >,
    max: Math.max(...data.map((point) => point.stravaAltitude ?? 0)),
    xAxisKey: 'secondsSinceStart',
  });

  return (
    <Stack height="100%" gap={2}>
      <Button disabled={!isZoomed} onClick={resetZoom} sx={{ maxWidth: 200 }}>
        Reset Zoom
      </Button>
      <Typography level="body-md">
        <em>Highlight a section of the chart to zoom in</em>
      </Typography>
      <ResponsiveContainer
        minWidth={300}
        width="100%"
        aspect={isMediumOrLarger ? 3.5 : 1.5}
      >
        <AreaChart
          data={dataSlice}
          margin={{ bottom: 10, left: 10, right: 10, top: 10 }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
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
            domain={[left, right]}
          />
          <YAxis
            domain={[
              (_dataMin: number) => Math.max(bottom - AXIS_PADDING_FEET, 0),
              (_dataMax: number) => top + AXIS_PADDING_FEET,
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
          <ReferenceArea x1={refLeft} x2={refRight} strokeOpacity={0.3} />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
}
