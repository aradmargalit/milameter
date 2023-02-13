import { StravaActivity } from '../stravaClient/models';

export type Activity = StravaActivity & { locationName: string };
