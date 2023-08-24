import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords } from '@/types';
import {
  getSeparationTrajectory,
  SeparationTrajectory,
} from '@/utils/distanceUtils';

export type DerivedActivityProperties = {
  separationTrajectory: SeparationTrajectory;
  maxSeparation: number;
};

type BuildDerivedActivityPropertiesOpts = {
  stravaActivity: ActivityWithRecords;
  garminActivity: GarminActivity;
};

export function buildDerivedActivityProperties({
  stravaActivity,
  garminActivity,
}: BuildDerivedActivityPropertiesOpts) {
  const separationTrajectory = getSeparationTrajectory(
    stravaActivity.records,
    garminActivity.records
  );

  const maxSeparation = Math.max(
    ...separationTrajectory.map((separation) => separation.distance)
  );
  return {
    maxSeparation,
    separationTrajectory,
  };
}
