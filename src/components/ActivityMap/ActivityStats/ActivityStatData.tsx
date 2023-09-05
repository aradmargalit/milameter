import { Stack, Typography } from '@mui/joy';

type ActivityStatDataProps = {
  unit: string;
  data: string;
};

export function ActivityStatData({ unit, data }: ActivityStatDataProps) {
  return (
    <Stack alignItems="baseline" display="flex" direction="row">
      <Typography>{data}</Typography>
      <Typography fontSize="smaller" textColor="text.secondary">
        {unit}
      </Typography>
    </Stack>
  );
}
