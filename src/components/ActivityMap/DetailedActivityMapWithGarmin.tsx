import { useState } from 'react';
import { Layer, LayerProps, Source } from 'react-map-gl';

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
import { MapMarker } from './MapMarker';
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
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': DOG_COLOR,
      'line-opacity': 0.75,
      'line-width': 3,
    },
    source: 'garminRoute',
    type: 'line',
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
    cmapName: 'velocity-blue',
    invertCmap: true,
    maxTime: separationTrajectory[0].time + activityDuration,
    timepoints,
  });

  return (
    <DetailedActivityMapBase
      activity={activity}
      activityDuration={activityDuration}
      onSliderChange={handleSliderChange}
      mapChildren={
        <>
          <MapMarker coordinate={garminCoord} color={DOG_COLOR} />
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
