import { Activity } from '@/models/activity';
import { StravaActivityResponse } from '../stravaClient/responseTypes';

// Keep updated with https://developers.strava.com/docs/reference/#api-models-ActivityType
/**
 * We only support activities that are likely to have GPS data
 */
export const supportedActivityTypes = [
  'EBikeRide',
  'Hike',
  'Ride',
  'Run',
  'Walk',
] as const;
type SupportedActivityType = (typeof supportedActivityTypes)[number];

function isSupportedActivityType(
  maybeSupported: Activity['type']
): maybeSupported is SupportedActivityType {
  return supportedActivityTypes.includes(
    maybeSupported as SupportedActivityType
  );
}

export function isSupportedActivity(
  activityResponse: StravaActivityResponse
): boolean {
  return isSupportedActivityType(activityResponse.type);
}
