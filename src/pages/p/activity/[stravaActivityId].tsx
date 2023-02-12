import { Activity } from '@/apiClients/stravaClient/models';
import { StravaClient } from '@/apiClients/stravaClient/stravaClient';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getToken } from 'next-auth/jwt';
import polyline from '@mapbox/polyline';
import { Box } from '@mui/joy';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';

type Data = {
  activity: Activity | null;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async (
  context
) => {
  const stravaActivityId = context.query?.stravaActivityId; // Get ID from slug `/book/1`

  if (typeof stravaActivityId !== 'string') {
    return {
      props: { data: { activity: null } },
    };
  }

  const jwt = await getToken({
    req: context.req,
  });

  // This should never happen, but what can ya do
  if (!jwt?.accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const stravaClient = new StravaClient(jwt.accessToken);
  const activity = await stravaClient.getActivityById(stravaActivityId);

  return {
    props: { data: { activity } },
  };
};

export default function StravaActivityDetailPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // This is fine for now, eventually we'll lock down a production token to just our domain
  // https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYXJhZG1hcmdhbGl0IiwiYSI6ImNsZTBkbnk1NDE5eGkzbnIzNGE3Zmx1NnQifQ.qOh6-x2DMYLm9qcp9ck-MA';

  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    // if there are no coordinates, there's nothing to show here
    if (!data.activity) {
      return;
    }

    const coordinates = polyline.decode(data.activity.map.polyline);

    // coordinates are swapped 🤪
    for (let i = 0; i < coordinates.length; i++) {
      coordinates[i] = [coordinates[i][1], coordinates[i][0]];
    }

    const geoJSON = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
    };

    // Pass the first coordinates in the LineString to `lngLatBounds` &
    // wrap each coordinate pair in `extend` to include them in the bounds
    // result.
    const bounds = coordinates.reduce(function (bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    // @ts-ignore
    map.current = new mapboxgl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      attributionControl: false,
      bounds,
    });

    // @ts-ignore
    map.current!.on('load', function () {
      // @ts-ignore
      map.current.addSource('route', { type: 'geojson', data: geoJSON });
      // @ts-ignore
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

      // @ts-ignore
      map.current.fitBounds(bounds, {
        padding: 80, // add some spacing around the coordinates
      });
    });
  });

  if (!data.activity) {
    return <p>Could not find activity</p>;
  }

  return (
    <div>
      <Box ref={mapContainer} sx={{ height: '700px' }} />
    </div>
  );
}
