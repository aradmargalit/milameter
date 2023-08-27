import ClearOutlined from '@mui/icons-material/ClearOutlined';
import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/system';

import { useGarminActivityStorage } from '@/contexts/GarminActivityStorageContext';

export function StoredActivityIndicator() {
  const { storedActivities, clearStoredGarminActivities } =
    useGarminActivityStorage();

  const countString = `${storedActivities.length} Garmin ${
    storedActivities.length > 1 ? 'activities' : 'activity'
  } uploaded`;

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography>{countString}</Typography>
      {storedActivities.length !== 0 && (
        <Button
          variant="outlined"
          color="danger"
          onClick={clearStoredGarminActivities}
          startDecorator={<ClearOutlined />}
        >
          Clear saved Garmin activities
        </Button>
      )}
    </Box>
  );
}
