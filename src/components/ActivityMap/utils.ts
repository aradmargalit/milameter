import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { Coordinate, Record } from '@/types';

type ActivityDuration = { startTime: number; activityDuration: number };

export function computeActivityDuration(
  activity: Activity,
  garminActivity: GarminActivity | null
): ActivityDuration {
  // we always have the start and end time for the primary activity, so start there
  const activityTimes = activity.records!.map((record) => record.time);
  let startTime = Math.min(...activityTimes);
  let endTime = Math.max(...activityTimes);

  // if we also have the garmin activities, update the start and end times
  const garminTimes =
    garminActivity && garminActivity.records.map((record) => record.time);
  if (garminTimes) {
    startTime = Math.min(startTime, Math.min(...garminTimes));
    endTime = Math.max(endTime, Math.max(...garminTimes));
  }

  const activityDuration = endTime - startTime;
  return { startTime, activityDuration };
}

/**
 * Because an activity may not have a record at each snapped time interval, we do
 * a (somewhat costly) argmin to find the closest record we _do_ have. This is
 * especially important if one activity finishes before the other.
 */
export function findClosestCoord(
  records: Record[],
  targetTime: number
): Coordinate {
  const absTimeDiffs = records!.map((record) =>
    Math.abs(record.time - targetTime)
  );
  const argMin = absTimeDiffs.indexOf(Math.min(...absTimeDiffs));
  return records[argMin].coord;
}
