import { Box } from '@mui/joy';

const TOGETHERNESS_THRESH = 35; // meters

type LiveDistanceProps = { distance: number | null };

export function LiveDistance({ distance }: LiveDistanceProps) {
  const runningTogether = distance === null || distance < TOGETHERNESS_THRESH;
  const inner = runningTogether
    ? 'Running Together'
    : `${distance.toFixed(0)}m Apart`;
  return (
    <Box
      sx={{
        display: 'flex',
        mt: 2,
        mb: 2,
        justifyContent: 'space-around',
      }}
    >
      {inner}
    </Box>
  );
}
