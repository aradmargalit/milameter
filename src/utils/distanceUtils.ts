import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { Coordinate, Record, UNIXEpochSeconds } from '@/types';

export const METERS_PER_MILE = 1609.34;
export const METERS_PER_FOOT = 0.3048;
const RADIUS_OF_EARTH_IN_KM = 6371;

type Separation = { time: UNIXEpochSeconds; distance: number };
export type SeparationTrajectory = Separation[];

export function metersToMiles(meters: number): number {
  return meters / METERS_PER_MILE;
}

export function metersToFeet(meters: number): number {
  return meters / METERS_PER_FOOT;
}

// https://www.movable-type.co.uk/scripts/latlong.html
export function lawOfCosinesDistance(
  [lat1, lon1]: number[],
  [lat2, lon2]: number[]
): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLamba = ((lon2 - lon1) * Math.PI) / 180;
  return (
    Math.acos(
      Math.sin(phi1) * Math.sin(phi2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLamba)
    ) *
    RADIUS_OF_EARTH_IN_KM *
    1000
  );
}

/**
 * Utility to convert an array of records to a mapping from time to coordinates,
 * allowing O(1) lookup of coordinates from a timestamp
 */
function makeRecordMap(records: Record[]): Map<UNIXEpochSeconds, Coordinate> {
  return new Map(records.map(({ time, coord }) => [time, coord]));
}

export function getSeparationTrajectory(
  recordsA: Record[],
  recordsB: Record[]
): SeparationTrajectory {
  // create a mapping from unix epoch seconds to coordinates
  const recordsMapB = makeRecordMap(recordsB);

  // iterate over source activities
  const separationTrajectory: SeparationTrajectory = recordsA
    .map(({ time, coord }) => {
      const coordB = recordsMapB.get(time);
      if (!coordB) {
        return null;
      }
      return {
        time,
        distance: lawOfCosinesDistance(coord, coordB),
      };
    })
    .filter((x): x is Separation => Boolean(x));
  return separationTrajectory;
}

export function computePace({
  distance,
  elapsedTime,
}: Activity | GarminActivity): string {
  // convert meters per second to minutes per mile
  const metersPerSecond = distance / elapsedTime;
  const metersPerMinute = metersPerSecond * 60;
  const milesPerMinute = metersPerMinute / METERS_PER_MILE;
  const minutesPerMile = 1 / milesPerMinute;

  // format nicely as a string
  const whole = Math.floor(minutesPerMile);
  const remainderMinutes = minutesPerMile - whole;
  const remainderSeconds = Math.floor(remainderMinutes * 60);

  const minStr = whole.toString().padStart(2, '0');
  const secStr = remainderSeconds.toString().padStart(2, '0');

  return `${minStr}:${secStr}`;
}
