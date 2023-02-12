import { MutableRefObject } from 'react';
import Map, { MapRef } from 'react-map-gl';

export type MapboxMapProps = {
  children?: React.ReactNode;
  ref?: MutableRefObject<MapRef | null>;
  // kind of ugly, but "MapProps" has a small bug which makes it unusable
} & Partial<React.ComponentProps<typeof Map>>;

// This is fine for now, eventually we'll lock down a production token to just our domain
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
const ACCESS_TOKEN =
  'pk.eyJ1IjoiYXJhZG1hcmdhbGl0IiwiYSI6ImNsZTBkbnk1NDE5eGkzbnIzNGE3Zmx1NnQifQ.qOh6-x2DMYLm9qcp9ck-MA';

/**
 * Renders a Mapbox GL JS Map with our access key and sensible defaults
 */
export function MapboxMap({ children, ...rest }: MapboxMapProps) {
  return (
    <Map
      mapboxAccessToken={ACCESS_TOKEN}
      attributionControl={false}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      reuseMaps
      {...rest}
    >
      {children}
    </Map>
  );
}
