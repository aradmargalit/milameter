import { Typography } from '@mui/joy';

const TOGETHERNESS_THRESH = 35; // meters

type LiveSeparationProps = { separation: number };

export function LiveSeparation({ separation }: LiveSeparationProps) {
  const runningTogether = separation < TOGETHERNESS_THRESH;
  const inner = runningTogether
    ? 'Running Together'
    : `${separation.toFixed(0)}m Apart`;
  return (
    <Typography
      sx={{
        display: 'flex',
        mt: 2,
        mb: 2,
        justifyContent: 'space-around',
      }}
    >
      {inner}
    </Typography>
  );
}
