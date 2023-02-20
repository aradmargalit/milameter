import Place from '@mui/icons-material/Place';
import { Card, Chip, Link, Typography } from '@mui/joy';
import { useRouter } from 'next/router';

import { DOG_COLOR } from '@/colors';
import { useGarminActivities } from '@/contexts/GarminActivityContext';
import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { truncateTitle } from '@/utils/activityCardUtils';
import { metersToMiles } from '@/utils/distanceUtils';
type StravaActivityCardProps = {
  activity: Activity;
  matchedGarminActivity: GarminActivity | null;
};

const MAX_TITLE_LEN = 100;

export function StravaActivityCard({
  activity,
  matchedGarminActivity,
}: StravaActivityCardProps) {
  const router = useRouter();
  const { setSelectedGarminActivity } = useGarminActivities();

  const onClickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedGarminActivity(matchedGarminActivity);
    router.push(`/p/activity/${activity.id}`);
  };

  const borderColor = matchedGarminActivity ? DOG_COLOR : null;
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={{
        borderColor,
        width: '100%',
        height: 200,
        gap: 2,
        '&:hover': {
          boxShadow: 'md',
          borderColor,
        },
      }}
    >
      <div>
        <Typography level="h2" fontSize="lg" id="card-description" mb={0.5}>
          <Link
            onClick={onClickHandler}
            sx={{ color: 'text.tertiary' }}
            href="#"
            overlay
            underline="none"
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
        {matchedGarminActivity && (
          <Chip
            variant="outlined"
            size="sm"
            sx={{
              pointerEvents: 'none',
              ml: 1,
              borderColor: DOG_COLOR,
              color: DOG_COLOR,
            }}
          >
            🐶 Good Dogette
          </Chip>
        )}
      </div>
    </Card>
  );
}
