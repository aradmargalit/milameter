import { MAPBOX_ACCESS_TOKEN } from '@/config';
import { MutableRefObject } from 'react';
import Map, { MapRef } from 'react-map-gl';

export type MapboxMapProps = {
  children?: React.ReactNode;
  ref?: MutableRefObject<MapRef | null>;
  // kind of ugly, but "MapProps" has a small bug which makes it unusable
} & Partial<React.ComponentProps<typeof Map>>;

/**
 * Renders a Mapbox GL JS Map with our access key and sensible defaults
 */
export function MapboxMap({ children, ...rest }: MapboxMapProps) {
  return (
    <Map
      mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
      attributionControl={false}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      reuseMaps
      {...rest}
    >
      {children}
    </Map>
  );
}
