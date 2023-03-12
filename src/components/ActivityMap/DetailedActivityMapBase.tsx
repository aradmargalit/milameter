import polyline from '@mapbox/polyline';
import { Box, Stack, Typography } from '@mui/joy';
import { useRef, useState } from 'react';
import { Layer, LayerProps, MapRef, Marker, Source } from 'react-map-gl';

import { HUMAN_COLOR } from '@/colors';
import { ActivityWithRecords, Coordinate } from '@/types';
import { swapLatLong } from '@/utils/coordinateUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';

import MapboxMap from '../MapboxMap';
import { MapSlider } from './MapSlider';
import { computeActivityDuration, findClosestCoord } from './utils';

type DetailedActivityMapProps = {
  activity: ActivityWithRecords;
  onSliderChange?: (_newTarget: number) => void;
  mapChildren?: React.ReactNode;
  sliderChildren?: React.ReactNode;
  activityDuration?: number;
};

export function DetailedActivityMapBase({
  activity,
  onSliderChange,
  mapChildren,
  sliderChildren,
  activityDuration,
}: DetailedActivityMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const [humanCoord, setHumanCoord] = useState<Coordinate>(
    activity.records[0].coord
  );

  const coordinates = polyline.decode(activity.map.polyline);
  const correctedCoordinates = swapLatLong(coordinates);
  const bounds = expandBounds(correctedCoordinates);
  const geoJSON = makeLineFromCoordinates(correctedCoordinates);

  const { startTime, activityDuration: stravaActivityDuration } =
    computeActivityDuration(activity);

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

  const handleSliderChange = (newValue: number): void => {
    const targetTime = startTime + newValue;
    setHumanCoord(findClosestCoord(activity.records, targetTime));

    onSliderChange && onSliderChange(targetTime);
  };

  const resolvedActivityDuration = activityDuration ?? stravaActivityDuration;

  const sliderMarks = [
    { value: 0, label: 'Start' },
    { value: resolvedActivityDuration, label: 'End' },
  ];

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

        <Marker
          longitude={humanCoord[0]}
          latitude={humanCoord[1]}
          anchor="bottom"
          offset={[-5, 0]}
        >
          <Typography level="h4">🏃‍♂️</Typography>
        </Marker>
        {mapChildren}
      </MapboxMap>
      <Box sx={{ mt: 2, mb: 2 }}>
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
