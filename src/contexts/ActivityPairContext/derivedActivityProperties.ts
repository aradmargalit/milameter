import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords } from '@/types';
import {
  getSeparationTrajectory,
  SeparationTrajectory,
} from '@/utils/distanceUtils';
import { getZoomies, Zoom } from '@/utils/zoomies';

export type DerivedActivityProperties = {
  separationTrajectory: SeparationTrajectory;
  maxSeparation: number;
  zoomies: Zoom[];
};

type BuildDerivedActivityPropertiesOpts = {
  stravaActivity: ActivityWithRecords;
  garminActivity: GarminActivity;
};

export function buildDerivedActivityProperties({
  stravaActivity,
  garminActivity,
}: BuildDerivedActivityPropertiesOpts) {
  const separationTrajectory = getSeparationTrajectory({
    garminRecords: garminActivity.records,
    stravaRecords: stravaActivity.records,
  });

  const maxSeparation = Math.max(
    ...separationTrajectory.map((separation) => separation.distance)
  );

  const zoomies = getZoomies(separationTrajectory);

  return {
    maxSeparation,
    separationTrajectory,
    zoomies,
  };
}
