import { Activity } from '@/models/activity';
import { ActivityPair } from '@/models/activityPair';
import { GarminActivity } from '@/models/garminActivity';

import { activityDistance } from './getActivityDistance';

const SIMILARITY_THRESHOLD = 0.5;

// for each activity, find the garmin activity with the lowest dissimilarity. If that
// dissimilarity is above an arbitrarily threshold (0.5 for now), assume there's no
// good match
export function buildActivityPairs(
  activities: Activity[],
  garminActivities: GarminActivity[]
): ActivityPair[] {
  activities;
  return activities.map((activity) => {
    const distances = garminActivities.map((gA) =>
      activityDistance(gA, activity)
    );
    const argMin = distances.indexOf(Math.min(...distances));

    if (distances[argMin] < SIMILARITY_THRESHOLD) {
      return {
        activity,
        garminActivity: garminActivities[argMin],
      };
    }
    return { activity, garminActivity: null };
  });
}
