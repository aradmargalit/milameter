import { Alert, Grid, Stack, Typography } from '@mui/joy';

import { ActivityPair } from '@/models/activityPair';

import StravaActivityCard from '../StravaActivityCard';

type ActivityGridProps = {
  activityPairs: ActivityPair[];
};

export function ActivityGrid({ activityPairs }: ActivityGridProps) {
  const hasPairs =
    activityPairs.filter((pair) => pair.garminActivity).length > 0;

  const activityGrid = (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      {activityPairs.map(({ activity, garminActivity }) => (
        <Grid key={activity.id} xs={12} md={6} lg={4}>
          <StravaActivityCard
            activity={activity}
            matchedGarminActivity={garminActivity}
          />
        </Grid>
      ))}
    </Grid>
  );

  if (hasPairs) {
    return activityGrid;
  }

  return (
    <Stack>
      <Alert variant="soft" color="warning" sx={{ mb: 2, padding: 2 }}>
        <Stack>
          <Typography fontWeight="lg">
            No Matching Garmin Activities Found
          </Typography>
          <Typography fontSize="sm">
            Follow the instructions above to upload recent Garmin activities.
          </Typography>
        </Stack>
      </Alert>
      {activityGrid}
    </Stack>
  );
}
