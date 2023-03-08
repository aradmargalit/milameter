import { Box, Typography } from '@mui/joy';
import { keyframes } from '@mui/system';

export function MilaMeterTitle() {
  const bgSize = '400%';
  const colorOne = 'hsl(15 90% 55%)';
  const colorTwo = 'hsl(40 95% 55%)';

  const animateBG = keyframes`
  to {
    background-position: ${bgSize} 0;
  }
`;
  return (
    <Box display="flex" alignItems="center" maxWidth="75vw">
      <Typography
        level="display1"
        sx={{
          fontSize: 'clamp(3rem, 12vmin, 8rem)',
          fontWeight: 'bold',
          letterSpacing: 2,
          // fancy animation
          background: `linear-gradient(90deg, ${colorOne}, ${colorTwo}, ${colorOne}) 0 0 / ${bgSize} 100%`,
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          animation: `${animateBG} 12s infinite linear`,
        }}
      >
        Mila
      </Typography>
      <Typography
        sx={{
          fontSize: 'clamp(3rem, 12vmin, 8rem)',
          fontWeight: 'bold',
          letterSpacing: 2,
        }}
      >
        Meter
      </Typography>
    </Box>
  );
}
