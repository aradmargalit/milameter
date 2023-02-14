import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { Grid } from '@mui/joy';
import StravaActivityCard from '../StravaActivityCard';

type ActivityGridProps = {
  activities: Activity[];
  matchingGarminActivities: (GarminActivity | null)[];
};

export function ActivityGrid({
  activities,
  matchingGarminActivities,
}: ActivityGridProps) {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      {activities.map((d, i) => (
        <Grid key={d.id} xs={12} md={6} lg={4}>
          <StravaActivityCard
            activity={d}
            matchedGarminActivity={matchingGarminActivities[i]}
          />
        </Grid>
      ))}
    </Grid>
  );
}
