import { Box } from '@mui/joy';

import { DetailedActivityMapBase } from '@/components/ActivityMap/DetailedActivityMapBase';
import { DetailedActivityMapWithGarmin } from '@/components/ActivityMap/DetailedActivityMapWithGarmin';
import { Legend } from '@/components/ActivityMap/Legend';
import { useActivityPair } from '@/contexts/ActivityPairContext';

export function DetailedActivityMap() {
  const { garminActivity, stravaActivity } = useActivityPair();

  return (
    <>
      <Box width="100%" height="800">
        {garminActivity ? (
          <DetailedActivityMapWithGarmin
            activity={stravaActivity}
            garminActivity={garminActivity}
          />
        ) : (
          <DetailedActivityMapBase activity={stravaActivity} />
        )}
      </Box>
      {garminActivity && <Legend />}
    </>
  );
}
