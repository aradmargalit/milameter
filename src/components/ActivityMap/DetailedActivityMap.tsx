import { Activity } from '@/apiClients/stravaClient/models';
import { swapLatLong } from '@/utils/coordinateUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';
import polyline from '@mapbox/polyline';
import { Box } from '@mui/joy';
import { useRef } from 'react';
import { MapRef, Layer, LayerProps, Source } from 'react-map-gl';
import MapboxMap from '../MapboxMap';

type DetailedActivityMapProps = {
  activity: Activity;
};

export function DetailedActivityMap({ activity }: DetailedActivityMapProps) {
  const mapRef = useRef<MapRef | null>(null);

  const coordinates = polyline.decode(activity.map.polyline);
  const correctedCoordinates = swapLatLong(coordinates);
  const bounds = expandBounds(correctedCoordinates);
  const geoJSON = makeLineFromCoordinates(correctedCoordinates);

  function handleMapLoad() {
    mapRef.current?.fitBounds(bounds, {
      padding: 80, // add some spacing around the coordinates
    });
  }

  const routeLayer: LayerProps = {
    id: 'route',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': 'red',
      'line-width': 5,
      'line-opacity': 0.75,
      'line-gradient': [
        'interpolate',
        ['linear'],
        ['line-progress'],
        0,
        'red',
        0.5,
        'darkred',
        1,
        'red',
      ],
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  return (
    <Box sx={{ height: '700px' }}>
      <MapboxMap
        ref={mapRef}
        onLoad={handleMapLoad}
        initialViewState={{ bounds }}
      >
        <Source id="route" type="geojson" data={geoJSON} lineMetrics>
          <Layer {...routeLayer} />
        </Source>
      </MapboxMap>
    </Box>
  );
}
