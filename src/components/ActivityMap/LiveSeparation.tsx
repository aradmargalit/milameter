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
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Typography level="body3">{inner}</Typography>
      <Box
        sx={{
          width: '80%',
          height: '5px',
          background: gradient,
        }}
      />
    </Stack>
  );
}
