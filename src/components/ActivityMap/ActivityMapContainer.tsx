import { Activity } from '@/models/activity';
import { Box } from '@mui/joy';
import MapboxMap from '../MapboxMap';

type ActivityMapContainerProps = {
  activity: Activity;
};

export function ActivityMapContainer({ activity }: ActivityMapContainerProps) {
  return (
    <Box sx={{ height: '90px' }}>
      {activity.startLatLng[0] ? (
        <MapboxMap
          initialViewState={{
            bounds: [
              activity.startLatLng[1],
              activity.startLatLng[0],
              activity.endLatLng[1],
              activity.endLatLng[0],
            ],
          }}
          interactive={false}
        />
      ) : null}
    </Box>
  );
}
