import { Box, Typography } from '@mui/joy';

const TOGETHERNESS_THRESH = 35; // meters

type LiveSeparationProps = { separation: number | null };

export function LiveSeparation({ separation }: LiveSeparationProps) {
  const runningTogether =
    separation === null || separation < TOGETHERNESS_THRESH;
  const inner = runningTogether
    ? 'Running Together'
    : `${separation.toFixed(0)}m Apart`;
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Typography level="body1">{inner}</Typography>
    </Box>
  );
}