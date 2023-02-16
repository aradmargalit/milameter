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
import { Coordinate, UNIXEpochSeconds } from '@/types';
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
  if (garminActivity) {
    const garminTimes = garminActivity.records.map((record) => record.time);
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
    _e: React.MouseEvent,
    value: number,
    _activeThumb: number
  ): void => {
    const absTimeDiffs = activity.records!.map((record) =>
      Math.abs(record.time - startTime - value)
    );
    const argMin = absTimeDiffs.indexOf(Math.min(...absTimeDiffs));
    const newCoord = activity.records![argMin].coord;
    setHumanCoord(newCoord);
  };

  function getTimeLabel(seconds: UNIXEpochSeconds): string {
    const duration = Duration.fromMillis(seconds * 1000).shiftTo(
      'minutes',
      'seconds'
    );
    return duration.toHuman({ unitDisplay: 'short' });
  }

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
          >
            <Typography level="h4">🏃‍♂️</Typography>
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
      <Box>
        <Slider
          aria-label="Small steps"
          defaultValue={0}
          step={DEFAULT_TIME_SNAP_INTERVAL * 2}
          valueLabelFormat={getTimeLabel}
          getAriaValueText={getTimeLabel}
          marks
          min={0}
          max={activityDuration}
          valueLabelDisplay="auto"
          onChange={onSliderChange}
        />
      </Box>
    </Stack>
  );
}

/*
map.addSource('point', {
'type': 'geojson',
'data': {
'type': 'FeatureCollection',
'features': [
{
'type': 'Feature',
'geometry': {
'type': 'Point',
'coordinates': [-77.4144, 25.0759]
}
}
]
}
});
 
// Add a layer to use the image to represent the data.
map.addLayer({
'id': 'points',
'type': 'symbol',
'source': 'point', // reference the data source
'layout': {
'icon-image': 'cat', // reference the image
'icon-size': 0.25
}
});
}
*/
