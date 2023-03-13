import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/system';

import { useGarminActivityStorage } from '@/contexts/GarminActivityStorageContext';

export function StoredActivityIndicator() {
  const { storedActivities, clearStoredGarminActivities } =
    useGarminActivityStorage();

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography>
        The app loaded with {storedActivities.length} saved Garmin activities
      </Typography>
      <Button
        variant="soft"
        color="danger"
        onClick={clearStoredGarminActivities}
      >
        Clear saved Garmin activities
      </Button>
    </Box>
  );
}
