import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/system';

import { useGarminActivityStorage } from '@/contexts/GarminActivityStorageContext';

export function StoredActivityIndicator() {
  const { storedActivities, clearStoredGarminActivities } =
    useGarminActivityStorage();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography>
        {storedActivities.length} Garmin activities uploaded
      </Typography>
      <Button
        variant="soft"
        color="danger"
        onClick={clearStoredGarminActivities}
        disabled={storedActivities.length === 0}
      >
        Clear saved Garmin activities
      </Button>
    </Box>
  );
}
