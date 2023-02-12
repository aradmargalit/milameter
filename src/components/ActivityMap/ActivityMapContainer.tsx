import { Activity } from '@/apiClients/stravaClient/models';
import { Box } from '@mui/joy';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { useRef, useState, useEffect } from 'react';

type ActivityMapContainerProps = {
  activity: Activity;
};

export function ActivityMapContainer({ activity }: ActivityMapContainerProps) {
  // This is fine for now, eventually we'll lock down a production token to just our domain
  // https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJhZG1hcmdhbGl0IiwiYSI6ImNsZTBkbnk1NDE5eGkzbnIzNGE3Zmx1NnQifQ.qOh6-x2DMYLm9qcp9ck-MA';

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    // if there are no coordinates, there's nothing to show here
    if (!activity.startLatLng[0] || !activity.endLatLng[0]) {
      return;
    }

    // @ts-ignore
    map.current = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      // TODO this isn't quite right, since start and end are often the same. We need to do some processing on the max bounds to draw this map
      bounds: [
        [activity.startLatLng[1], activity.startLatLng[0]],
        [activity.endLatLng[1], activity.endLatLng[0]],
      ],
      interactive: false,
      attributionControl: false,
    });
  });

  return (
    <div>
      <Box ref={mapContainer} sx={{ height: '90px' }} />
    </div>
  );
}
