import { Box, Stack, Typography } from '@mui/joy';
import { SxProps } from '@mui/material';

type GarminUploadInstructionsProps = { sx: SxProps };

function CircledNumber({ num }: { num: number }) {
  return (
    <Box
      border="3px solid var(--joy-palette-text-primary)"
      borderRadius="50%"
      textAlign="center"
      width="32px"
      minWidth="32px"
      lineHeight="32px"
      fontSize="32px"
    >
      <Typography>{num}</Typography>
    </Box>
  );
}

function UploadStep({
  instructions,
  idx,
}: {
  instructions: string;
  idx: number;
}) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <CircledNumber num={idx + 1} />
      <Typography>{instructions}</Typography>
    </Stack>
  );
}

const steps = [
  'Plug your watch into your computer',
  'Press the upload button below',
  'Upload recent .fit files. Try finding your Garmin as a removable USB drive, and then navigate to Garmin > Activity.',
];

export function GarminUploadInstructions({
  sx,
}: GarminUploadInstructionsProps) {
  return (
    <Stack direction="row" width="100%" sx={sx}>
      <Stack
        spacing={2}
        border="1px solid var(--joy-palette-neutral-outlinedBorder)"
        borderRadius="var(--joy-radius-md)"
        padding={2}
      >
        {steps.map((step, idx) => (
          <UploadStep key={idx} idx={idx} instructions={step} />
        ))}
      </Stack>
      {/* TODO: add some icon or artwork here */}
    </Stack>
  );
}
