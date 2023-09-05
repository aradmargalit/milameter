import { DateTime } from 'luxon';

import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
import { Coordinates, Record } from '@/types';
import { floorNearestInterval } from '@/utils/timeUtils';

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
    UtcOffset: response.utc_offset,
    averageCadence: response.average_cadence ?? null,
    averageHeartrate: response.average_heartrate ?? null,
    averageSpeed: response.average_speed,
    averageTemp: response.average_temp ?? null,
    elapsedTime: response.elapsed_time,
    elevHigh: response.elev_high ?? null,
    elevLow: response.elev_low ?? null,
    endLatLng: response.end_latlng,
    externalId: response.external_id,
    hasHeartrate: response.has_heartrate,
    map: {
      ...response.map,
      resourceState: response.map.resource_state,
      summaryPolyline: response.map.summary_polyline,
    },
    maxHeartrate: response.max_heartrate ?? null,
    maxSpeed: response.max_speed,
    movingTime: response.moving_time,
    startDate: response.start_date,
    startDateLocal: response.start_date_local,
    startLatLng: response.start_latlng,
    totalElevationGain: response.total_elevation_gain,
    uploadId: response.upload_id,
    uploadIdString: response.upload_id_str,
  };

  if (streamsResponse?.time && streamsResponse.latlng) {
    const { time, latlng, altitude } = streamsResponse;
    const startTime = DateTime.fromISO(response.start_date);

    const times = time.data
      .map((t) => startTime.plus({ seconds: t }).toISO())
      .filter((x): x is string => Boolean(x));

    const coordinates: Coordinates = latlng.data.map((coord) => [
      coord[1],
      coord[0],
    ]);

    const records: Record[] = times.map((time, i) => ({
      altitude: altitude.data[i],
      coord: coordinates[i],
      time: floorNearestInterval(
        DateTime.fromISO(time),
        DEFAULT_TIME_SNAP_INTERVAL
      ),
    }));

    return { ...core, records };
  }

  return core;
}
