import { StravaActivity } from '@/apiClients/stravaClient/models';

export type Activity = StravaActivity & { locationName: string };
