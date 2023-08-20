import { DateTime } from 'luxon';

import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';

/**
 * compute an abstract numeric "distance" score between a given garmin activity and
 * standard activity.
 * Currently this just computes the time difference, with a cutoff of 1 hour
 *
 * @param garminActivity activity from the watch
 * @param activity primary activity to compare against
 * @param timeGapCutoff the longest amount of time (in seconds) that we'll consider as
 *  possibly belonging to the same activity (default: 1 hour = 3600 seconds)
 * @returns a value between 0 and 1 indicating the dissimilarity between the activities
 *  (lower is better)
 */
export function activityDistance(
  garminActivity: GarminActivity,
  activity: Activity,
  timeGapCutoff: number = 60 * 60
): number {
  // convert times from both activities to luxon DateTime objects
  const targetStartTime = DateTime.fromISO(activity.startDate);

  // the garmin FIT decoder exports the timestamp as a stringified JS Date, so we can
  // reconstitute it that way before jamming it into a luxon.DateTime object
  const garminStartTime = DateTime.fromSeconds(garminActivity.records[0].time);

  // find the absolute difference in seconds (we don't care which watch started first)
  const startTimeOffset = Math.abs(
    targetStartTime.diff(garminStartTime, 'seconds').seconds
  );

  // the final distance is the fraction of the maximum cutoff
  return Math.min(startTimeOffset, timeGapCutoff) / timeGapCutoff;
}
