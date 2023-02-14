import * as React from 'react';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { Chip } from '@mui/joy';
import { metersToMiles } from '@/utils/distanceUtils';
import { truncateTitle } from '@/utils/activityCardUtils';
import { Place } from '@mui/icons-material';
import { Activity } from '@/apiClients/mapBoxClient/models';

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
      {/* <AspectRatio ratio="1" sx={{ minWidth: 90 }}>
        <ActivityMapContainer activity={activity} />
      </AspectRatio> */}
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
        <Typography fontSize="sm" startDecorator={<Place />} mb={1}>
          {activity.locationName}
        </Typography>
        <Chip
          variant="outlined"
          color="primary"
          size="sm"
          sx={{ pointerEvents: 'none' }}
        >
          {activity.type}
        </Chip>
        {activity.matchedGarminActivity ? (
          <Chip
            variant="outlined"
            color="neutral"
            size="sm"
            sx={{ pointerEvents: 'none' }}
          >
            🐶{` `}({activity.matchedGarminActivity.records.length} records)
          </Chip>
        ) : null}
      </div>
    </Card>
  );
}
