import { Box, Stack, Typography, useColorScheme } from '@mui/joy';
import Image from 'next/image';

import PoweredByStravaLightMode from './api_logo_pwrdBy_strava_stack_gray.svg';
import PoweredByStravaDarkMode from './api_logo_pwrdBy_strava_stack_white.svg';
import milaImage from './mila.png';

export function About() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      display="flex"
      alignItems="center"
      spacing={8}
      sx={{ height: '100%', maxWidth: 900 }}
    >
      <Stack display="flex" alignItems="center">
        <Image
          src={milaImage}
          alt="Mila with her tongue out"
          width={320}
          height={320}
          placeholder="blur"
          style={{
            borderRadius: '15%',
            marginBottom: 20,
            overflow: 'hidden',
          }}
        />
        <Typography level="body1">
          This is Mila. She&apos;s a very active German Shorthaired Pointer who
          loves to run!
        </Typography>
        <Typography level="body1">
          This site was designed to allow our dad to attach a Garmin GPS to
          Mila, and analyze her activity on runs where she&apos;s allowed to
          explore off leash. MilaMeter syncs with the primary user&apos;s Strava
          account, and allows .fit files from a Garmin device to be manually
          uploaded and compared with existing Strava activities from the same
          date and time.
        </Typography>
      </Stack>
      <Box>
        {/* Required by Strava Brand Guidelines: https://developers.strava.com/guidelines/ */}
        <Image
          src={
            colorScheme.mode === 'dark'
              ? PoweredByStravaDarkMode
              : PoweredByStravaLightMode
          }
          alt="Powered by Strava"
        />
      </Box>
    </Stack>
  );
}
