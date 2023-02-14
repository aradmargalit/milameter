import { StravaActivity } from './models';
import { StravaActivityResponse } from './responseTypes';

export function convertStravaActivityResponse(
  response: StravaActivityResponse
): StravaActivity {
  return {
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
}
