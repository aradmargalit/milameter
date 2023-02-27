import { Card, CardOverflow, Divider, Stack, Typography } from '@mui/joy';

type StatisticProps = {
  name: string;
  value: string;
  units: string;
};
export function Statistic({ name, value, units }: StatisticProps) {
  return (
    <Card variant="outlined" sx={{ width: 200, height: 80 }}>
      <CardOverflow>
        <Typography level="h2" sx={{ fontSize: 'md', mt: 1, mb: 1 }}>
          {name}
        </Typography>
        <Divider />
        <Stack direction="row" sx={{ mt: 0.5, mb: 1 }}>
          <Typography level="body1" sx={{ mr: 0.5 }}>
            {value}
          </Typography>
          <Typography level="body3">{units}</Typography>
        </Stack>
      </CardOverflow>
    </Card>
  );
}
