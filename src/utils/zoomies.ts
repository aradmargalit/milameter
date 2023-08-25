import { Separation, SeparationTrajectory } from './distanceUtils';

// a Zoom is just a separation where the previous separation was larger by a threshold
export type Zoom = Separation;

const OUT_OF_RANGE_METERS = 25;
const TOGETHER_METERS = 5;

export function getZoomies(separationTrajectory: SeparationTrajectory): Zoom[] {
  if (separationTrajectory.length < 2) {
    return [];
  }

  let outOfRange = false;
  const zoomies: Zoom[] = [];

  for (let i = 1; i < separationTrajectory.length; i++) {
    const separation = separationTrajectory[i];
    // If out of range for the first time, set flag to true
    if (!outOfRange && separation.distance > OUT_OF_RANGE_METERS) {
      outOfRange = true;
      continue;
    }

    // If we were out of range at some point and are now very close, it was a zoom
    if (outOfRange && separation.distance <= TOGETHER_METERS) {
      zoomies.push(separation);
      outOfRange = false; // reset to allow for future zooms
    }
  }

  return zoomies;
}
