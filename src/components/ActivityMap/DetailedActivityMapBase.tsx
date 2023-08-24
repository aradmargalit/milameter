import polyline from '@mapbox/polyline';
import { Box, Stack } from '@mui/joy';
import { useRef, useState } from 'react';
import { Layer, LayerProps, MapRef, Source } from 'react-map-gl';

import { HUMAN_COLOR } from '@/colors';
import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';
import { Coordinate } from '@/types';
import { swapLatLong } from '@/utils/coordinateUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';

import MapboxMap from '../MapboxMap';
import { MapMarker } from './MapMarker';
import { MapSlider } from './MapSlider';
import { computeActivityDuration, findClosestCoord } from './utils';

type DetailedActivityMapProps = {
  onSliderChange?: (_newTarget: number) => void;
  mapChildren?: React.ReactNode;
  sliderChildren?: React.ReactNode;
  activityDuration?: number;
};

export function DetailedActivityMapBase({
  onSliderChange,
  mapChildren,
  sliderChildren,
  activityDuration,
}: DetailedActivityMapProps) {
  const { stravaActivity } = useActivityPair();
  const mapRef = useRef<MapRef | null>(null);
  const [humanCoord, setHumanCoord] = useState<Coordinate>(
    stravaActivity.records[0].coord
  );

  const coordinates = polyline.decode(stravaActivity.map.polyline);
  const correctedCoordinates = swapLatLong(coordinates);
  const bounds = expandBounds(correctedCoordinates);
  const geoJSON = makeLineFromCoordinates(correctedCoordinates);

  const { startTime, activityDuration: stravaActivityDuration } =
    computeActivityDuration(stravaActivity);

  function handleMapLoad() {
    mapRef.current?.fitBounds(bounds, {
      padding: 80, // add some spacing around the coordinates
    });
  }

  const routeLayer: LayerProps = {
    id: 'route',
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': HUMAN_COLOR,
      'line-opacity': 0.75,
      'line-width': 3,
    },
    source: 'route',
    type: 'line',
  };

  const handleSliderChange = (newValue: number): void => {
    const targetTime = startTime + newValue;
    setHumanCoord(findClosestCoord(stravaActivity.records, targetTime));

    onSliderChange && onSliderChange(targetTime);
  };

  const resolvedActivityDuration = activityDuration ?? stravaActivityDuration;

  const sliderMarks = [
    { label: 'Start', value: 0 },
    { label: 'End', value: resolvedActivityDuration },
  ];

  return (
    <Stack height="100%">
      <MapboxMap
        ref={mapRef}
        onLoad={handleMapLoad}
        initialViewState={{ bounds }}
      >
        <Source id="route" type="geojson" data={geoJSON} lineMetrics>
          <Layer {...routeLayer} />
        </Source>

        <MapMarker coordinate={humanCoord} color={HUMAN_COLOR} />
        {mapChildren}
      </MapboxMap>
      <Box sx={{ mb: 2, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <MapSlider
            marks={sliderMarks}
            activityDuration={resolvedActivityDuration}
            onChange={handleSliderChange}
          />
        </Box>
        {sliderChildren}
      </Box>
    </Stack>
  );
}
