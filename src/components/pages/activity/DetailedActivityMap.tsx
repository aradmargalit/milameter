import { Box } from '@mui/joy';

import { DetailedActivityMapBase } from '@/components/ActivityMap/DetailedActivityMapBase';
import { DetailedActivityMapWithGarmin } from '@/components/ActivityMap/DetailedActivityMapWithGarmin';
import { Legend } from '@/components/ActivityMap/Legend';
import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';

export function DetailedActivityMap() {
  const { garminActivity } = useActivityPair();

  return (
    <>
      <Box width="100%">
        {garminActivity ? (
          <DetailedActivityMapWithGarmin />
        ) : (
          <DetailedActivityMapBase />
        )}
      </Box>
      {garminActivity && <Legend />}
    </>
  );
}
