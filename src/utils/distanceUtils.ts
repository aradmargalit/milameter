import { UNIXEpochSeconds, Record, Coordinate } from '@/types';

const METERS_PER_MILE = 1609.34;
const RADIUS_OF_EARTH_IN_KM = 6371;

type Separation = { time: UNIXEpochSeconds; distance: number };
export type SeparationTrajectory = Separation[];

export function metersToMiles(meters: number): number {
  return meters / METERS_PER_MILE;
}

//https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
/**
 * Calculates the haversine distance between point A, and B.
 * @param {number[]} latlngA [lat, lng] point A
 * @param {number[]} latlngB [lat, lng] point B
 * @param {boolean} isMiles If we are using miles, else m.
 */
export function haversineDistance(
  [lat1, lon1]: number[],
  [lat2, lon2]: number[],
  isMiles: boolean = false
): number {
  const toRadian = (angle: number) => (Math.PI / 180) * angle;
  const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);

  const dLat = distance(lat2, lat1);
  const dLon = distance(lon2, lon1);

  lat1 = toRadian(lat1);
  lat2 = toRadian(lat2);

  // Haversine Formula
  const a =
    Math.pow(Math.sin(dLat / 2), 2) +
    Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.sqrt(a));

  let finalDistance = RADIUS_OF_EARTH_IN_KM * c;

  if (isMiles) {
    finalDistance /= 1.60934;
  }
  return finalDistance * 1000; // convert to meters
}

/**
 * from https://www.movable-type.co.uk/scripts/latlong.html
 * @param param0 latlngA [lat, lng] point A
 * @param param1 latlngB [lat, lng] point B
 * @returns
 */
function equirectangularDistance(
  [lat1, lon1]: number[],
  [lat2, lon2]: number[]
): number {
  const x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  const y = lat2 - lat1;
  return Math.sqrt(x * x + y * y) * RADIUS_OF_EARTH_IN_KM;
}

function lawOfCosines([lat1, lon1]: number[], [lat2, lon2]: number[]): number {
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
 * allowing O(1) lookup of cooridnates from a timestamp
 */
function makeRecordMap(records: Record[]): Map<UNIXEpochSeconds, Coordinate> {
  return new Map(records.map(({ time, coord }) => [time, coord]));
}

export function getSeparationTrajectory(
  recordsA: Record[],
  recordsB: Record[]
): SeparationTrajectory {
  // create a mapping from unix epoch seconds to coordinates
  const recordsMapA = makeRecordMap(recordsA);
  const recordsMapB = makeRecordMap(recordsB);

  // iterate over source activities
  const separationTrajectory: SeparationTrajectory = [];
  recordsMapA.forEach((coordA: Coordinate, time: UNIXEpochSeconds) => {
    const coordB = recordsMapB.get(time);
    if (coordB) {
      const distance = lawOfCosines(coordA, coordB);
      separationTrajectory.push({
        time,
        distance,
      });
    }
  });
  return separationTrajectory;
}
