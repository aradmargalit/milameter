import { Activity } from './activity';
import { GarminActivity } from './garminActivity';

export type ActivityPair = {
  activity: Activity;
  garminActivity: GarminActivity | null;
};
