import { Box, Stack, Typography } from '@mui/joy';

const TOGETHERNESS_THRESH = 35; // meters

type LiveSeparationProps = { separation: number | null; gradient: str };

export function LiveSeparation({ separation, gradient }: LiveSeparationProps) {
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
      <Stack>
        <Box
          sx={{
            width: '80%',
            height: '10px',
            background: gradient,
          }}
        />
        <Typography level="body3">{inner}</Typography>
      </Stack>
    </Box>
  );
}
