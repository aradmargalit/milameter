import { GarminActivity, GarminActivityRecord } from '@/models/garminActivity';
// @ts-ignore
import { Decoder, Stream } from '@garmin-fit/sdk';

export async function garminActivityFromFile(
  file: File
): Promise<GarminActivity> {
  console.log('converting...');
  const buffer = await file.arrayBuffer();
  const stream = Stream.fromBuffer(new Uint8Array(buffer));
  const decoder = new Decoder(stream);
  const records: GarminActivityRecord[] = decoder.read().messages.recordMesgs;

  // TODO: update these
  // @ts-ignore
  return { records };
}
