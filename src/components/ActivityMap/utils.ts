import { Activity } from '@/models/activity';
import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords, Coordinate, Record } from '@/types';

type ActivityDuration = { startTime: number; activityDuration: number };

export function computeActivityDuration(
  activity: Activity,
  garminActivity?: GarminActivity
): ActivityDuration {
  if (!activity.records) {
    console.error('called computeActivityDuration without records');
    return { startTime: 0, activityDuration: 0 };
  }

  // we always have the start and end time for the primary activity, so start there
  let startTime = activity.records[0].time;
  let endTime = activity.records[activity.records.length - 1].time;

  // if we also have the garmin activities, update the start and end times
  if (garminActivity) {
    startTime = Math.min(startTime, garminActivity.records[0].time);
    endTime = Math.max(
      endTime,
      garminActivity.records[garminActivity.records.length - 1].time
    );
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
  const absTimeDiffs = records.map((record) =>
    Math.abs(record.time - targetTime)
  );
  const argMin = absTimeDiffs.indexOf(Math.min(...absTimeDiffs));
  return records[argMin].coord;
}

export function activityHasRecords(
  activity: Activity
): activity is ActivityWithRecords {
  return !!activity.records;
}
