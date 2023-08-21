import { Card, CardOverflow, Divider, Stack, Typography } from '@mui/joy';

type StatisticProps = {
  name: string;
  value: string;
  units: string;
};
export function Statistic({ name, value, units }: StatisticProps) {
  return (
    <Card variant="outlined" sx={{ height: 80, width: 200 }}>
      <CardOverflow>
        <Typography level="h2" sx={{ fontSize: 'md', mb: 1, mt: 1 }}>
          {name}
        </Typography>
        <Divider />
        <Stack direction="row" sx={{ mb: 1, mt: 0.5 }}>
          <Typography level="body1" sx={{ mr: 0.5 }}>
            {value}
          </Typography>
          <Typography level="body3">{units}</Typography>
        </Stack>
      </CardOverflow>
    </Card>
  );
}
