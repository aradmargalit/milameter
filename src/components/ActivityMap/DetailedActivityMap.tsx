import { Activity } from '@/apiClients/stravaClient/models';
import { swapLatLong } from '@/utils/coordinateUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';
import polyline from '@mapbox/polyline';
import { Box } from '@mui/joy';
import mapboxgl from 'mapbox-gl';
import { useRef, useEffect } from 'react';

type DetailedActivityMapProps = {
  activity: Activity;
};

export function DetailedActivityMap({ activity }: DetailedActivityMapProps) {
  // This is fine for now, eventually we'll lock down a production token to just our domain
  // https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJhZG1hcmdhbGl0IiwiYSI6ImNsZTBkbnk1NDE5eGkzbnIzNGE3Zmx1NnQifQ.qOh6-x2DMYLm9qcp9ck-MA';

  const mapContainer = useRef<HTMLElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once

    // if there are no coordinates, there's nothing to show here
    if (!activity?.map.polyline) {
      return;
    }

    const coordinates = polyline.decode(activity.map.polyline);
    const correctedCoordinates = swapLatLong(coordinates);
    const bounds = expandBounds(correctedCoordinates);
    const geoJSON = makeLineFromCoordinates(correctedCoordinates);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      attributionControl: false,
      bounds,
    });

    map.current.on('load', function () {
      if (map.current === null) return;

      map.current.addSource('route', { type: 'geojson', data: geoJSON });
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        paint: {
          'line-color': 'black',
          'line-opacity': 0.75,
          'line-width': 10,
        },
      });

      map.current.fitBounds(bounds, {
        padding: 80, // add some spacing around the coordinates
      });
    });
  });

  return <Box ref={mapContainer} sx={{ height: '700px' }} />;
}
