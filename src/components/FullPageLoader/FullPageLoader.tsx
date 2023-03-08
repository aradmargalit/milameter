import { Box, CircularProgress } from '@mui/joy';

export function FullPageLoader() {
  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress variant="soft" size="lg" />
    </Box>
  );
}
