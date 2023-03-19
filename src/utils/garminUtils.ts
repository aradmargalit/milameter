// @ts-ignore
import { Decoder, Stream } from '@garmin-fit/sdk';
import { DateTime } from 'luxon';

import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
import { GarminActivity, GarminActivityRecord } from '@/models/garminActivity';
import { Coordinate, Record } from '@/types';

import { floorNearestInterval } from './timeUtils';

const TICKS_PER_GLOBE = Math.pow(2, 32);
const DEGREES_PER_GLOBE = 360;
export const TEST_OFFSET = 0;

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
  const altitude = garminRecord.altitude;
  return { time, coord, altitude };
}

export async function garminActivityFromFile(
  file: File
): Promise<GarminActivity> {
  const buffer = await file.arrayBuffer();
  const stream = Stream.fromBuffer(new Uint8Array(buffer));
  const decoder = new Decoder(stream);
  const messages = decoder.read().messages;
  const garminRecords: GarminActivityRecord[] = messages.recordMesgs;

  // TODO: update these
  // @ts-ignore
  const distance =
    garminRecords.length > 0
      ? garminRecords[garminRecords.length - 1].distance
      : 0;

  // convert GarminActivityRecord to plain Record
  const records: Record[] = garminRecords.map((garminRecord) =>
    convertGarminRecord(garminRecord)
  );

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
