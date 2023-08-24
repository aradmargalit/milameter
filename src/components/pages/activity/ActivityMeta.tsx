import Place from '@mui/icons-material/Place';
import { Box, Typography } from '@mui/joy';

import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';

export function ActivityMeta() {
  const {
    stravaActivity: { name, locationName },
  } = useActivityPair();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography level="h4">{name}</Typography>
      <Typography level="body1" startDecorator={<Place />}>
        {locationName}
      </Typography>
    </Box>
  );
}
