import { Box } from '@mui/joy';

import About from '@/components/About';
import MilaMeterHead from '@/components/MilaMeterHead';
import MilaMeterTitle from '@/components/MilaMeterTitle';

export default function AboutPage() {
  return (
    <>
      <MilaMeterHead />
      <main>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          alignItems="center"
          height="70vh"
          sx={{ margin: 4 }}
        >
          <MilaMeterTitle />
          <About />
        </Box>
      </main>
    </>
  );
}
