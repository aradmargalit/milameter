import Place from '@mui/icons-material/Place';
import { Card, Chip, Link, Typography, useTheme } from '@mui/joy';
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
  const theme = useTheme();
  const router = useRouter();
  const { setSelectedGarminActivity } = useGarminActivities();

  const onClickHandler = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setSelectedGarminActivity(matchedGarminActivity);
    router.push(`/p/activity/${activity.id}`);
  };

  const borderColor = matchedGarminActivity
    ? theme.palette.primary.outlinedBorder
    : null;
  const title = truncateTitle(activity.name, MAX_TITLE_LEN);
  return (
    <Card
      variant="outlined"
      orientation="horizontal"
      sx={(theme) => ({
        '&:hover': {
          borderColor: theme.vars.palette.primary.outlinedHoverBorder,
          boxShadow: 'md',
          transform: 'translateY(-2px)',
        },
        backgroundColor: theme.vars.palette.background.backdrop,
        borderColor,
        gap: 2,
        height: 200,
        transition: 'transform 0.3s, border 0.3s',
        width: '100%',
      })}
    >
      <div>
        <Link
          onClick={onClickHandler}
          sx={{ color: 'text.primary' }}
          href="#"
          overlay
          underline="none"
        >
          <Typography
            level="h2"
            fontSize="lg"
            aria-label={title}
            id={`${title}-description`}
            mb={0.5}
          >
            {title}
          </Typography>
        </Link>
        <Typography
          fontSize="sm"
          aria-describedby={`${title}-description`}
          mb={1}
        >
          {metersToMiles(activity.distance).toFixed(2)} mi
        </Typography>
        <Typography
          fontSize="sm"
          startDecorator={<Place />}
          mb={1}
          sx={{ color: 'text.secondary' }}
        >
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
              borderColor: DOG_COLOR,
              color: DOG_COLOR,
              ml: 1,
              pointerEvents: 'none',
            }}
          >
            🐶 Good Dogette
          </Chip>
        )}
      </div>
    </Card>
  );
}
