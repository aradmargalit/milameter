import { Typography } from '@mui/joy';
import { Marker } from 'react-map-gl';

import { Coordinate } from '@/types';

type MapMarkerProps = {
  coordinate: Coordinate;
  color: string;
};

export function MapMarker({ coordinate, color }: MapMarkerProps) {
  return (
    <Marker longitude={coordinate[0]} latitude={coordinate[1]} anchor="center">
      <Typography level="h4" textColor={color}>
        ○
      </Typography>
    </Marker>
  );
}
