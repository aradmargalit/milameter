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

export type ActivityType =
  | 'AlpineSki'
  | 'BackcountrySki'
  | 'Canoeing'
  | 'Crossfit'
  | 'EBikeRide'
  | 'Elliptical'
  | 'Golf'
  | 'Handcycle'
  | 'Hike'
  | 'IceSkate'
  | 'InlineSkate'
  | 'Kayaking'
  | 'Kitesurf'
  | 'NordicSki'
  | 'Ride'
  | 'RockClimbing'
  | 'RollerSki'
  | 'Rowing'
  | 'Run'
  | 'Sail'
  | 'Skateboard'
  | 'Snowboard'
  | 'Snowshoe'
  | 'Soccer'
  | 'StairStepper'
  | 'StandUpPaddling'
  | 'Surfing'
  | 'Swim'
  | 'Velomobile'
  | 'VirtualRide'
  | 'VirtualRun'
  | 'Walk'
  | 'WeightTraining'
  | 'Wheelchair'
  | 'Windsurf'
  | 'Workout'
  | 'Yoga';

export type AthleteResponse = {
  id: number;
  username: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: ISODate;
  updated_at: ISODate;
  weight: number;
  profile_medium: URL;
  profile: URL;
};

export type StravaActivityResponse = {
  resource_state: number;
  athlete: { id: AthleteResponse['id']; resource_state: number };
  name: string;
  distance: Meters;
  moving_time: Seconds;
  elapsed_time: Seconds;
  total_elevation_gain: Meters;
  type: ActivityType;
  id: number;
  start_date: ISODate;
  start_date_local: ISODate;
  timezone: string;
  utc_offset: number;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  map: {
    id: string;
    summary_polyline: SummaryPolyline;
    resource_state: number;
    polyline: Polyline;
  };
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string;
  start_latlng: [Latitude, Longitude];
  end_latlng: [Latitude, Longitude];
  average_speed: MetersPerSecond;
  max_speed: MetersPerSecond;
  average_cadence: number;
  average_temp: number;
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  elev_high?: number;
  elev_low?: number;
  upload_id: number;
  upload_id_str: string;
  external_id: string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  suffer_score: number;
};
