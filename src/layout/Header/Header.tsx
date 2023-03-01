import { Box, Typography } from '@mui/joy';

import { StravaLoginButtonContainer } from '@/components/StravaLoginButton/StravaLoginButtonContainer';

/**
 * Persistent header across pages for things like logout
 */
export function Header() {
  const colorOne = 'hsl(15 90% 55%)';

  return (
    <Box
      component="header"
      height={4}
      padding={4}
      display="flex"
      justifyContent="space-between"
    >
      <Box display="flex">
        <Typography
          level="h2"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 2,
            color: colorOne,
          }}
        >
          Mila
        </Typography>
        <Typography
          level="h2"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 2,
            color: 'var(--joy-palette-text-primary)',
          }}
        >
          Meter
        </Typography>
      </Box>
      <StravaLoginButtonContainer />
    </Box>
  );
}
