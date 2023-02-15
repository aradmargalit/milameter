import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { swapLatLong } from '@/utils/coordinateUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';
import polyline from '@mapbox/polyline';
import { useRef } from 'react';
import { MapRef, Layer, LayerProps, Source } from 'react-map-gl';
import { HUMAN_COLOR, DOG_COLOR } from '@/colors';
import MapboxMap from '../MapboxMap';

type DetailedActivityMapProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function DetailedActivityMap({
  activity,
  garminActivity,
}: DetailedActivityMapProps) {
  const mapRef = useRef<MapRef | null>(null);

  const coordinates = polyline.decode(activity.map.polyline);
  const correctedCoordinates = swapLatLong(coordinates);
  const bounds = expandBounds(correctedCoordinates);
  const geoJSON = makeLineFromCoordinates(correctedCoordinates);

  let garminGeoJSON = null;
  if (garminActivity) {
    garminGeoJSON = makeLineFromCoordinates(garminActivity.coordinates);
  }

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
      'line-color': HUMAN_COLOR,
      'line-width': 5,
      'line-opacity': 0.75,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  const garminRouteLayer: LayerProps = {
    id: 'garminRoute',
    type: 'line',
    source: 'garminRoute',
    paint: {
      'line-color': DOG_COLOR,
      'line-dasharray': [3.5, 2],
      'line-width': 4,
      'line-opacity': 0.75,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  return (
    <MapboxMap
      ref={mapRef}
      onLoad={handleMapLoad}
      initialViewState={{ bounds }}
    >
      <Source id="route" type="geojson" data={geoJSON} lineMetrics>
        <Layer {...routeLayer} />
      </Source>
      {garminGeoJSON && (
        <>
          <Source
            id="garminRoute"
            type="geojson"
            data={garminGeoJSON}
            lineMetrics
          >
            <Layer {...garminRouteLayer} />
          </Source>
        </>
      )}
    </MapboxMap>
  );
}
