import { Box, CircularProgress } from '@mui/joy';

export function FullPageLoader() {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        width: '100vw',
      }}
    >
      <CircularProgress
        variant="soft"
        size="lg"
        aria-label="full page loader"
      />
    </Box>
  );
}
