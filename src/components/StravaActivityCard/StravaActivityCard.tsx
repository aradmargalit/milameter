import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import { Activity } from '@/apiClients/stravaClient/models';
import Image from 'next/image';
import { Chip } from '@mui/joy';
import { ActivityMapContainer } from '../ActivityMap/ActivityMapContainer';

type StravaActivityCardProps = {
  activity: Activity;
};

export function StravaActivityCard({ activity }: StravaActivityCardProps) {
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        width: 700,
        gap: 2,
        '&:hover': {
          boxShadow: 'md',
          borderColor: 'neutral.outlinedHoverBorder',
        },
      }}
    >
      <AspectRatio ratio="1" sx={{ width: 90 }}>
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
            {activity.name}
          </Link>
        </Typography>
        <Typography fontSize="sm" aria-describedby="card-description" mb={1}>
          {activity.distance} meters
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
