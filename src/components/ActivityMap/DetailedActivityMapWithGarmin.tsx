import { Typography } from '@mui/joy';
import { useState } from 'react';
import { Layer, LayerProps, Marker, Source } from 'react-map-gl';

import { DOG_COLOR } from '@/colors';
import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords, Coordinate } from '@/types';
import {
  colorGradientStrFromVector,
  GradientTimePoint,
} from '@/utils/colorUtils';
import {
  getSeparationTrajectory,
  lawOfCosinesDistance,
} from '@/utils/distanceUtils';
import { makeLineFromCoordinates } from '@/utils/mapboxUtils';

import { DetailedActivityMapBase } from './DetailedActivityMapBase';
import { LiveSeparation } from './LiveSeparation';
import { computeActivityDuration, findClosestCoord } from './utils';

type DetailedActivityMapProps = {
  activity: ActivityWithRecords;
  garminActivity: GarminActivity;
};

export function DetailedActivityMapWithGarmin({
  activity,
  garminActivity,
}: DetailedActivityMapProps) {
  const [humanCoord, setHumanCoord] = useState<Coordinate>(
    activity.records[0].coord
  );
  const [garminCoord, setGarminCoord] = useState<Coordinate>(
    garminActivity.records[0].coord
  );

  const garminGeoJSON = makeLineFromCoordinates(garminActivity.coordinates);

  const { activityDuration } = computeActivityDuration(
    activity,
    garminActivity
  );

  const garminRouteLayer: LayerProps = {
    id: 'garminRoute',
    type: 'line',
    source: 'garminRoute',
    paint: {
      'line-color': DOG_COLOR,
      'line-width': 2,
      'line-opacity': 0.75,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  };

  const handleSliderChange = (newTargetTime: number): void => {
    setHumanCoord(findClosestCoord(activity.records, newTargetTime));
    if (garminActivity) {
      setGarminCoord(findClosestCoord(garminActivity.records, newTargetTime));
    }
  };

  const liveSeparation = lawOfCosinesDistance(humanCoord, garminCoord);
  const separationTrajectory = getSeparationTrajectory(
    activity.records,
    garminActivity.records
  );

  const timepoints: GradientTimePoint[] = separationTrajectory.map(
    ({ time, distance }) => ({ time, val: distance })
  );

  const gradient = colorGradientStrFromVector({
    timepoints,
    maxTime: separationTrajectory[0].time + activityDuration,
    cmapName: 'velocity-blue',
    invertCmap: true,
  });

  return (
    <DetailedActivityMapBase
      activity={activity}
      activityDuration={activityDuration}
      onSliderChange={handleSliderChange}
      mapChildren={
        <>
          <Marker
            longitude={garminCoord[0]}
            latitude={garminCoord[1]}
            anchor="bottom"
          >
            <Typography level="h4">🐶</Typography>
          </Marker>
          <Source
            id="garminRoute"
            type="geojson"
            data={garminGeoJSON}
            lineMetrics
          >
            <Layer {...garminRouteLayer} />
          </Source>
        </>
      }
      sliderChildren={
        <LiveSeparation separation={liveSeparation} gradient={gradient} />
      }
    />
  );
}
