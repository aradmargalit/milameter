import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
import { Coordinates, Record } from '@/types';
import { floorNearestInterval } from '@/utils/timeUtils';
import { DateTime } from 'luxon';
import { StravaActivity } from './models';
import { StravaActivityResponse, StravaStreamsResponse } from './responseTypes';

type ConvertStravaActivityResponseArgs = {
  response: StravaActivityResponse;
  streamsResponse?: StravaStreamsResponse;
};
export function convertStravaActivityResponse({
  response,
  streamsResponse,
}: ConvertStravaActivityResponseArgs): StravaActivity {
  const core = {
    ...response,
    averageCadence: response.average_cadence ?? null,
    averageHeartrate: response.average_heartrate ?? null,
    averageSpeed: response.average_speed,
    averageTemp: response.average_temp ?? null,
    elapsedTime: response.elapsed_time,
    elevHigh: response.elev_high ?? null,
    elevLow: response.elev_low ?? null,
    startLatLng: response.start_latlng,
    endLatLng: response.end_latlng,
    externalId: response.external_id,
    hasHeartrate: response.has_heartrate,
    maxHeartrate: response.max_heartrate ?? null,
    maxSpeed: response.max_speed,
    startDate: response.start_date,
    startDateLocal: response.start_date_local,
    movingTIme: response.moving_time,
    totalElevationGain: response.total_elevation_gain,
    uploadId: response.upload_id,
    uploadIdString: response.upload_id_str,
    UtcOffset: response.utc_offset,
    map: {
      ...response.map,
      resourceState: response.map.resource_state,
      summaryPolyline: response.map.summary_polyline,
    },
  };

  if (streamsResponse?.time && streamsResponse.latlng) {
    const { time, latlng } = streamsResponse;
    const startTime = DateTime.fromISO(response.start_date);

    const times = time.data.map((t) => startTime.plus({ seconds: t }).toISO());
    const coordinates: Coordinates = latlng.data.map((coord) => [
      coord[1],
      coord[0],
    ]);

    const records: Record[] = times.map((time, i) => ({
      time: floorNearestInterval(
        DateTime.fromISO(time),
        DEFAULT_TIME_SNAP_INTERVAL
      ),
      coord: coordinates[i],
    }));
    return { ...core, records };
  }

  return core;
}
