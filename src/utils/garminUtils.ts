// @ts-ignore
import { Decoder, Stream } from '@garmin-fit/sdk';
import { DateTime } from 'luxon';

import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
import { GarminActivity, GarminActivityRecord } from '@/models/garminActivity';
import { Coordinate, Record } from '@/types';

import { lawOfCosinesDistance } from './distanceUtils';
import { floorNearestInterval } from './timeUtils';

const TICKS_PER_GLOBE = Math.pow(2, 32);
const DEGREES_PER_GLOBE = 360;
export const TEST_OFFSET = 0;
const IMPOSSIBLE_INCREMENTAL_DISTANCE_METERS = 1_000;

export function convertGarminCoord(gc: number): number {
  return (gc / TICKS_PER_GLOBE) * DEGREES_PER_GLOBE;
}

function convertGarminRecord(garminRecord: GarminActivityRecord): Record {
  const coord: Coordinate = [
    convertGarminCoord(garminRecord.positionLong) + TEST_OFFSET,
    convertGarminCoord(garminRecord.positionLat) + TEST_OFFSET,
  ];
  const dt = DateTime.fromJSDate(new Date(garminRecord.timestamp));
  const time = floorNearestInterval(dt, DEFAULT_TIME_SNAP_INTERVAL);
  const altitude = garminRecord.enhancedAltitude ?? garminRecord.altitude;
  return { time, coord, altitude };
}

function isValidRecord(
  record: Record,
  index: number,
  records: Record[]
): boolean {
  return (
    true && isDistancePossible(record, index, records)
    // add new checks here
  );
}

export function isDistancePossible(
  record: Record,
  index: number,
  records: Record[]
): boolean {
  // impossible means that this point is too far from the first point
  // to be possible for anybody to cover
  // e.g. i = 0 in America, i = 9 in Spain, the 9th indexed item is impossible
  // Special case: first point is always possible
  if (index === 0) {
    return true;
  }

  // Assume the first coordinate is good
  const goodCoordinate = records[0].coord;
  const currentCoordinates = record.coord;
  const distance = lawOfCosinesDistance(goodCoordinate, currentCoordinates);

  return distance <= IMPOSSIBLE_INCREMENTAL_DISTANCE_METERS;
}

export async function garminActivityFromFile(
  file: File
): Promise<GarminActivity> {
  const buffer = await file.arrayBuffer();
  const stream = Stream.fromBuffer(new Uint8Array(buffer));
  const decoder = new Decoder(stream);
  const messages = decoder.read().messages;
  const garminRecords: GarminActivityRecord[] = messages.recordMesgs;

  const distance =
    garminRecords.length > 0
      ? garminRecords[garminRecords.length - 1].distance
      : 0;

  // convert GarminActivityRecord to plain Record
  const records: Record[] = garminRecords
    .map(convertGarminRecord)
    .filter(isValidRecord);

  // expose coordinates more easily
  const coordinates = records.map((record) => record.coord);

  const sessionData = messages.sessionMesgs[0];

  const elapsedTime = sessionData.totalElapsedTime;
  const totalElevationGain = sessionData.totalAscent;
  const maxSpeed = sessionData.enhancedMaxSpeed;

  return {
    records,
    distance,
    coordinates,
    elapsedTime,
    totalElevationGain,
    maxSpeed,
  };
}
