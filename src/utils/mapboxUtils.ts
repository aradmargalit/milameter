import mapboxgl from 'mapbox-gl';

import { Coordinates } from '@/types';

export function expandBounds(coordinates: Coordinates) {
  // Pass the first coordinates in the LineString to `lngLatBounds` &
  // wrap each coordinate pair in `extend` to include them in the bounds
  // result.
  return coordinates.reduce(
    function (bounds, coord) {
      return bounds.extend(coord);
    },
    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
  );
}

// https://docs.mapbox.com/mapbox-gl-js/api/sources/#geojsonsource
export function makeLineFromCoordinates(coordinates: Coordinates) {
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates,
    },
    properties: {},
  } as const;
}
