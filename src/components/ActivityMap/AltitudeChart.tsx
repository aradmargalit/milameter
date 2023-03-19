import {
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';

export type AltitudeChartOption = {
  dataKey: string;
  color: string;
  label: string;
};

type AltitudeChartProps = {
  data: Array<{ stravaAltitude: number; garminAltitude?: number }>;
  chartOptions: AltitudeChartOption[];
};

const AXIS_PADDING_FEET = 20;

export function AltitudeChart({ data, chartOptions }: AltitudeChartProps) {
  return (
    <ResponsiveContainer width="100%" aspect={2}>
      <LineChart
        data={data}
        margin={{ bottom: 10, top: 10, left: 10, right: 10 }}
      >
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
          animationDuration={200}
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
            name={label}
            strokeDasharray={idx === 0 ? undefined : '5 5'}
          />
        ))}
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}
