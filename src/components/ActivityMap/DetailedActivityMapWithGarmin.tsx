import { useState } from 'react';
import { Layer, LayerProps, Source } from 'react-map-gl';

import { DOG_COLOR } from '@/colors';
import { useActivityPair } from '@/contexts/ActivityPairContext';
import { Coordinate } from '@/types';
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

export function DetailedActivityMapWithGarmin() {
  const { stravaActivity, garminActivity } = useActivityPair();

  const [humanCoord, setHumanCoord] = useState<Coordinate>(
    stravaActivity.records[0].coord
  );
  const [garminCoord, setGarminCoord] = useState<Coordinate>(
    // this should be safe, we will only render this component after checking for presence
    garminActivity!.records[0].coord
  );

  const garminGeoJSON = makeLineFromCoordinates(garminActivity!.coordinates);

  const { activityDuration } = computeActivityDuration(
    stravaActivity,
    garminActivity!
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
    setHumanCoord(findClosestCoord(stravaActivity.records, newTargetTime));
    if (garminActivity) {
      setGarminCoord(findClosestCoord(garminActivity.records, newTargetTime));
    }
  };

  const liveSeparation = lawOfCosinesDistance(humanCoord, garminCoord);
  const separationTrajectory = getSeparationTrajectory(
    stravaActivity.records,
    garminActivity!.records
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
