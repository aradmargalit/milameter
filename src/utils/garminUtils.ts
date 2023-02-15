import { GarminActivity, GarminActivityRecord } from '@/models/garminActivity';
import { Coordinates } from '@/types';
// @ts-ignore
import { Decoder, Stream } from '@garmin-fit/sdk';

const TICKS_PER_GLOBE = Math.pow(2, 32);
const DEGREES_PER_GLOBE = 360;

export async function garminActivityFromFile(
  file: File
): Promise<GarminActivity> {
  const buffer = await file.arrayBuffer();
  const stream = Stream.fromBuffer(new Uint8Array(buffer));
  const decoder = new Decoder(stream);
  const records: GarminActivityRecord[] = decoder.read().messages.recordMesgs;

  // TODO: update these
  // @ts-ignore
  const distanceMeters =
    records.length > 0 ? records[records.length - 1].distance : 0;

  // convert coordinates from Garmin format to lat/lon degrees
  const coordinates: Coordinates = records.map((record) => [
    (record.positionLong / TICKS_PER_GLOBE) * DEGREES_PER_GLOBE,
    (record.positionLat / TICKS_PER_GLOBE) * DEGREES_PER_GLOBE,
  ]);
  return { records, distanceMeters, coordinates };
}