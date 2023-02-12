import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { Activity } from '@/apiClients/stravaClient/models';
import { Chip } from '@mui/joy';
import { ActivityMapContainer } from '../ActivityMap/ActivityMapContainer';
import { metersToMiles } from '@/utils/distanceUtils';
import { truncateTitle } from '@/utils/activityCardUtils';

type StravaActivityCardProps = {
  activity: Activity;
};

const MAX_TITLE_LEN = 100;

export function StravaActivityCard({ activity }: StravaActivityCardProps) {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: '100%',
        height: 200,
        gap: 2,
        '&:hover': {
          boxShadow: 'md',
          borderColor: 'neutral.outlinedHoverBorder',
        },
      }}
    >
      <AspectRatio ratio="1" sx={{ minWidth: 90 }}>
        <ActivityMapContainer activity={activity} />
      </AspectRatio>
      <div>
        <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
          <Link
            overlay
            underline="none"
            href={`/p/activity/${activity.id}`}
            sx={{ color: 'text.tertiary' }}
          >
            {truncateTitle(activity.name, MAX_TITLE_LEN)}
          </Link>
        </Typography>
        <Typography fontSize="sm" aria-describedby="card-description" mb={1}>
          {metersToMiles(activity.distance).toFixed(2)} mi
        </Typography>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: 'none' }}
        >
          {activity.type}
        </Chip>
      </div>
    </Card>
  );
}
