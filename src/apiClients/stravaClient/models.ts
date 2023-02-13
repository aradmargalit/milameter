import {
  ISODate,
  Latitude,
  Longitude,
  Meters,
  MetersPerSecond,
  Polyline,
  Seconds,
  SummaryPolyline,
  URL,
} from '@/types';
import { ActivityType } from './responseTypes';

export type Athlete = {
  id: number;
  username: string;
  resourceState: number;
  firstname: string;
  lastname: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  createdAt: ISODate;
  updatedAt: ISODate;
  weight: number;
  profile_medium: URL;
  profile: URL;
};

/**
 * The fields we care about from a Strava activity
 */
export type StravaActivity = {
  // resourceState: number;
  // athlete: { id: Athlete['id']; resourceState: number };
  name: string;
  distance: Meters;
  movingTIme: Seconds;
  elapsedTime: Seconds;
  totalElevationGain: Meters;
  type: ActivityType;
  id: number;
  startDate: ISODate;
  startDateLocal: ISODate;
  timezone: string;
  UtcOffset: number;
  // achievementCount: number;
  // kudosCount: number;
  // commentCount: number;
  // athleteCount: number;
  // photoCount: number;
  map: {
    id: string;
    summaryPolyline: SummaryPolyline;
    resourceState: number;
    polyline: Polyline;
  };
  // trainer: boolean;
  // commute: boolean;
  // manual: boolean;
  // private: boolean;
  // visibility: string;
  // flagged: boolean;
  // gearId: string;
  startLatLng: [Latitude, Longitude];
  endLatLng: [Latitude, Longitude];
  averageSpeed: MetersPerSecond;
  maxSpeed: MetersPerSecond;
  averageCadence: number | null;
  averageTemp: number;
  hasHeartrate: boolean;
  averageHeartrate: number | null;
  maxHeartrate: number | null;
  elevHigh: number | null;
  elevLow: number | null;
  uploadId: number;
  uploadIdString: string;
  externalId: string;
  // fromAcceptedTag: boolean;
  // prCount: number;
  // totalPhotoCount: number;
  // hasKudoed: boolean;
  // sufferScore: number;
};
