import { Box, Stack, Typography } from '@mui/joy';

import AboutButton from '@/components/AboutButton';
import { StravaLoginButtonContainer } from '@/components/StravaLoginButton/StravaLoginButtonContainer';

function ButtonBox() {
  return (
    <Stack
      direction="row"
      display="flex"
      justifyContent={{ md: 'flex-end', xs: 'flex-start' }}
      spacing={1}
    >
      <AboutButton />
      <StravaLoginButtonContainer />
    </Stack>
  );
}

/**
 * Persistent header across pages for things like logout
 */
export function Header() {
  const colorOne = 'hsl(15 90% 55%)';

  return (
    <Box
      component="header"
      padding={{ md: 2, xs: 1 }}
      display="flex"
      flexDirection={{ md: 'row', xs: 'column' }}
      justifyContent="space-between"
    >
      <Box display="flex">
        <Typography
          level="h2"
          sx={{
            color: colorOne,
            fontWeight: 'bold',
            letterSpacing: 2,
          }}
        >
          Mila
        </Typography>
        <Typography
          level="h2"
          sx={{
            color: 'var(--joy-palette-text-primary)',
            fontWeight: 'bold',
            letterSpacing: 2,
          }}
        >
          Meter
        </Typography>
      </Box>
      <ButtonBox />
    </Box>
  );
}
