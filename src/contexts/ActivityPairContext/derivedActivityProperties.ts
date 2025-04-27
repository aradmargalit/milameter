import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords } from '@/types';
import {
  getMaxSeparation,
  getSeparationTrajectory,
  Separation,
  SeparationTrajectory,
} from '@/utils/distanceUtils';
import { getZoomies, Zoom } from '@/utils/zoomies';

export type DerivedActivityProperties = {
  separationTrajectory: SeparationTrajectory;
  maxSeparation: Separation | undefined;
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

  const maxSeparation = getMaxSeparation(separationTrajectory);

  const zoomies = getZoomies(separationTrajectory);

  return {
    maxSeparation,
    separationTrajectory,
    zoomies,
  };
}
