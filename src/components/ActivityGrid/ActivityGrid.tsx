import { Grid } from '@mui/joy';

import { ActivityPair } from '@/models/activityPair';

import StravaActivityCard from '../StravaActivityCard';

type ActivityGridProps = {
  activityPairs: ActivityPair[];
};

export function ActivityGrid({ activityPairs }: ActivityGridProps) {
  return (
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
}
