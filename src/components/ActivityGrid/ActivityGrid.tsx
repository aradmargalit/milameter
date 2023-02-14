import { Activity } from '@/models/activity';
import { Grid } from '@mui/joy';
import StravaActivityCard from '../StravaActivityCard';

type ActivityGridProps = {
  activities: Activity[];
};

export function ActivityGrid({ activities }: ActivityGridProps) {
  return (
    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
      {activities.map((d) => (
        <Grid key={d.id} xs={12} md={6} lg={4}>
          <StravaActivityCard activity={d} />
        </Grid>
      ))}
    </Grid>
  );
}
