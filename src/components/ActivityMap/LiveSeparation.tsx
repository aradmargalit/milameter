import { Box, Stack, Typography } from '@mui/joy';

const TOGETHERNESS_THRESH = 35; // meters

type LiveSeparationProps = { separation: number | null; gradient: string };

export function LiveSeparation({ separation, gradient }: LiveSeparationProps) {
  const runningTogether =
    separation === null || separation < TOGETHERNESS_THRESH;
  const inner = runningTogether
    ? 'Running Together'
    : `${separation.toFixed(0)}m Apart`;
  return (
    <Stack
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Typography level="body3">{inner}</Typography>
      <Box
        sx={{
          background: gradient,
          height: '5px',
          width: '80%',
        }}
      />
    </Stack>
  );
}
