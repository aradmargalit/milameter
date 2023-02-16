import { Card, Stack, Typography } from '@mui/joy';

type StatisticProps = {
  name: string;
  value: number;
  units: string;
};
export function Statistic({ name, value, units }: StatisticProps) {
  return (
    <Card variant="outlined" sx={{ width: 120, height: 120, padding: 1 }}>
      <Typography level="h2" sx={{ fontSize: 'md', mt: 0, mb: 1 }}>
        {name}
      </Typography>
      <Stack direction="row" sx={{ mt: 0.5, mb: 1 }}>
        <Typography level="body1" sx={{ mr: 0.5 }}>
          {value.toFixed(2)}
        </Typography>
        <Typography level="body3">{units}</Typography>
      </Stack>
    </Card>
  );
}
