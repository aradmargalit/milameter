import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { swapLatLong } from '@/utils/coordinateUtils';
import { expandBounds, makeLineFromCoordinates } from '@/utils/mapboxUtils';
import polyline from '@mapbox/polyline';
import { useRef, useState } from 'react';
import { MapRef, Layer, LayerProps, Source, Marker } from 'react-map-gl';
import { HUMAN_COLOR, DOG_COLOR } from '@/colors';
import MapboxMap from '../MapboxMap';
import { Box, Slider, Stack, Typography } from '@mui/joy';
import { Coordinate, UNIXEpochSeconds, Record } from '@/types';
import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
import { Duration } from 'luxon';

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

  let garminGeoJSON = null;
  if (garminActivity) {
    garminGeoJSON = makeLineFromCoordinates(garminActivity.coordinates);
  }

  // compute total activity duration
  const activityTimes = activity.records!.map((record) => record.time);
  let startTime = Math.min(...activityTimes);
  let endTime = Math.max(...activityTimes);
  const garminTimes = garminActivity
    ? garminActivity.records.map((record) => record.time)
    : null;
  if (garminTimes) {
    startTime = Math.min(startTime, Math.min(...garminTimes));
    endTime = Math.max(endTime, Math.max(...garminTimes));
  }

  const activityDuration = endTime - startTime;

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
    event: Event,
    value: number | number[],
    _activeThumb: number
  ): void => {
    // technically the slider could give us an array of values (but it never will in
    // this impl, so we just theoretically pull the first value
    const targetTime = Array.isArray(value) ? value[0] : value;

    setHumanCoord(findClosestCoord(activity.records!, targetTime));
    if (garminActivity) {
      setGarminCoord(findClosestCoord(garminActivity.records, targetTime));
    }
  };

  function getTimeLabel(seconds: UNIXEpochSeconds): string {
    const duration = Duration.fromMillis(seconds * 1000).shiftTo(
      'minutes',
      'seconds'
    );
    return duration.toHuman({ unitDisplay: 'short' });
  }

  function findClosestCoord(records: Record[], targetTime: number): Coordinate {
    const absTimeDiffs = records!.map((record) =>
      Math.abs(record.time - startTime - targetTime)
    );
    const argMin = absTimeDiffs.indexOf(Math.min(...absTimeDiffs));
    return records[argMin].coord;
  }

  const sliderMarks = [
    { value: 0, label: 'Start' },
    { value: activityDuration, label: 'End' },
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
        <Source
          id="mapbox-dem"
          type="raster-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxzoom={14}
        />
      </MapboxMap>
      <Box
        sx={{ display: 'flex', mt: 2, mb: 2, justifyContent: 'space-around' }}
      >
        <Box sx={{ width: '80%' }}>
          <Slider
            aria-label="Activity Time"
            defaultValue={0}
            variant="soft"
            step={DEFAULT_TIME_SNAP_INTERVAL * 2}
            valueLabelFormat={getTimeLabel}
            getAriaValueText={getTimeLabel}
            marks={sliderMarks}
            min={0}
            max={activityDuration}
            valueLabelDisplay="auto"
            onChange={onSliderChange}
          />
        </Box>
      </Box>
    </Stack>
  );
}
