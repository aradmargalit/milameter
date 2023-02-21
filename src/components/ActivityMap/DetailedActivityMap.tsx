import polyline from '@mapbox/polyline';
import { Box, Stack, Typography } from '@mui/joy';
import { useRef, useState } from 'react';
import { Layer, LayerProps, MapRef, Marker, Source } from 'react-map-gl';

import { DOG_COLOR, HUMAN_COLOR } from '@/colors';
import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { Coordinate } from '@/types';
import { buildGradient } from '@/utils/colorUtils';
import { swapLatLong } from '@/utils/coordinateUtils';
import {
  getSeparationTrajectory,
  lawOfCosinesDistance,
} from '@/utils/distanceUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';

import MapboxMap from '../MapboxMap';
import { LiveSeparation } from './LiveSeparation';
import { MapSlider } from './MapSlider';
import { computeActivityDuration, findClosestCoord } from './utils';

type DetailedActivityMapProps = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};

export function DetailedActivityMap({
  activity,
  garminActivity,
}: DetailedActivityMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [humanCoord, setHumanCoord] = useState<Coordinate | null>(null);
  const [garminCoord, setGarminCoord] = useState<Coordinate | null>(null);

  const coordinates = polyline.decode(activity.map.polyline);
  const correctedCoordinates = swapLatLong(coordinates);
  const bounds = expandBounds(correctedCoordinates);
  const geoJSON = makeLineFromCoordinates(correctedCoordinates);

  // if we have a garmin activity, also create a geojson object from that
  const garminGeoJSON =
    garminActivity && makeLineFromCoordinates(garminActivity.coordinates);

  const { startTime, activityDuration } = computeActivityDuration(
    activity,
    garminActivity
  );

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

  const onSliderChange = (
    _event: Event,
    value: number | number[],
    _activeThumb: number
  ): void => {
    // technically the slider could give us an array of values (but it never will in
    // this impl, so we just theoretically pull the first value
    const targetTime = startTime + (Array.isArray(value) ? value[0] : value);

    setHumanCoord(findClosestCoord(activity.records!, targetTime));
    if (garminActivity) {
      setGarminCoord(findClosestCoord(garminActivity.records, targetTime));
    }
  };

  const sliderMarks = [
    { value: 0, label: 'Start' },
    { value: activityDuration, label: 'End' },
  ];

  const liveSeparation =
    humanCoord && garminCoord
      ? lawOfCosinesDistance(humanCoord, garminCoord)
      : null;

  const separationTrajectory =
    garminActivity && activity.records
      ? getSeparationTrajectory(activity.records, garminActivity.records)
      : null;

  const bgGradient = buildGradient(separationTrajectory!, activityDuration);

  return (
    <Stack sx={{ height: '100%' }}>
      <MapboxMap
        ref={mapRef}
        onLoad={handleMapLoad}
        initialViewState={{ bounds }}
      >
        <Source id="route" type="geojson" data={geoJSON} lineMetrics>
          <Layer {...routeLayer} />
        </Source>

        {humanCoord && (
          <Marker
            longitude={humanCoord[0]}
            latitude={humanCoord[1]}
            anchor="bottom"
            offset={[-5, 0]}
          >
            <Typography level="h4">🏃‍♂️</Typography>
          </Marker>
        )}

        {garminCoord && (
          <Marker
            longitude={garminCoord[0]}
            latitude={garminCoord[1]}
            anchor="bottom"
            offset={[5, 0]}
          >
            <Typography level="h4">🐶</Typography>
          </Marker>
        )}

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
      <Stack sx={{ mt: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <Box
            sx={{
              width: '80%',
              height: '10px',
              background: bgGradient,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <MapSlider
            marks={sliderMarks}
            activityDuration={activityDuration}
            onChange={onSliderChange}
          />
        </Box>
        {garminActivity && <LiveSeparation separation={liveSeparation} />}
      </Stack>
    </Stack>
  );
}
