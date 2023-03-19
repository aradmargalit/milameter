import { Stack, Typography } from '@mui/joy';
import Image from 'next/image';

import milaImage from './mila.png';

export function About() {
  return (
    <Stack
      display="flex"
      alignItems="center"
      spacing={1}
      sx={{ maxWidth: 900 }}
    >
      <Image
        src={milaImage}
        alt="Mila with her tongue out"
        width={320}
        height={320}
        placeholder="blur"
        style={{
          borderRadius: '15%',
          overflow: 'hidden',
          marginBottom: 20,
        }}
      />
      <Typography level="body1">
        This is Mila. She&apos;s a very active German Shorthaired Pointer who
        loves to run!
      </Typography>
      <Typography level="body1">
        This site was designed to allow our dad to attach a Garmin GPS to Mila,
        and analyze her activity on runs where she&apos;s allowed to explore off
        leash. MilaMeter syncs with the primary user&apos;s Strava account, and
        allows .fit files from a Garmin device to be manually uploaded and
        compared with existing Strava activities from the same date and time.
      </Typography>
    </Stack>
  );
}
