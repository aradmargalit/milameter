import { Box } from '@mui/joy';

import About from '@/components/About';
import MilaMeterHead from '@/components/MilaMeterHead';
import MilaMeterTitle from '@/components/MilaMeterTitle';

export default function AboutPage() {
  return (
    <>
      <MilaMeterHead />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
        height="80vh"
        sx={{ margin: 4 }}
      >
        <MilaMeterTitle />
        <About />
      </Box>
    </>
  );
}
