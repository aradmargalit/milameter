import { Box, Stack, Typography } from '@mui/joy';
import { setCookie } from 'cookies-next';
import Image from 'next/image';
import { useState } from 'react';

import { useDisplayIsSizeOrLarger } from '@/hooks/useDisplayIsSizeOrLarger';
import { GARMIN_UPLOAD_INSTRUCTIONS_OPEN_COOKIE } from '@/storage/cookies';

import Collapse from '../Collapse';
import garminImage from './garmin45s.webp';

function CircledNumber({ num }: { num: number }) {
  return (
    <Box
      border="3px solid var(--joy-palette-text-primary)"
      borderRadius="50%"
      textAlign="center"
      width="30px"
      minWidth="30px"
      lineHeight="30px"
      fontSize="30px"
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
  'Select an activity below to view map and details',
];

export function GarminUploadInstructions({
  instructionsOpen,
}: {
  instructionsOpen: boolean;
}) {
  const [open, setOpen] = useState(instructionsOpen);
  const toggle = () => {
    const newValue = !open;
    setOpen(newValue);
    setCookie(GARMIN_UPLOAD_INSTRUCTIONS_OPEN_COOKIE, newValue);
  };

  const isMediumDisplayOrLarger = useDisplayIsSizeOrLarger('md');

  return (
    <Collapse
      approxHeightPx={400}
      open={open}
      toggle={toggle}
      buttonAriaLabel="Toggle Garmin activities instructions"
    >
      <Typography level="body-sm">
        Your Strava activities have been automatically imported. To link
        activities from an external Garmin device, follow these steps.
      </Typography>
      <Stack
        width="100%"
        justifyContent="space-between"
        alignItems="center"
        paddingRight={6}
        direction={{ md: 'row', xs: 'column' }}
        padding={{ md: '0 6rem 0 0', xs: '0' }}
        marginTop={{ md: 3, xs: 1 }}
      >
        <Stack spacing={2}>
          {steps.map((step, idx) => (
            <UploadStep key={idx} idx={idx} instructions={step} />
          ))}
        </Stack>
        {isMediumDisplayOrLarger && (
          <Image
            src={garminImage}
            alt="garmin 45s"
            width={320}
            height={320}
            placeholder="blur"
          />
        )}
      </Stack>
    </Collapse>
  );
}
