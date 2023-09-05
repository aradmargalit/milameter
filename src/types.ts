import { Activity } from './models/activity';
import { GarminActivity } from './models/garminActivity';

export type ISODate = string;
export type UNIXEpochSeconds = number;
export type URL = string;
export type Meters = number;
export type Seconds = number;
export type SummaryPolyline = string;
export type Polyline = string;

export type Latitude = number;
export type Longitude = number;

export type MetersPerSecond = number;

export type Coordinate = [Longitude, Latitude];
export type Coordinates = Coordinate[];
export type Record = {
  time: UNIXEpochSeconds;
  coord: Coordinate;
  altitude: Meters;
};

export type ActivityWithRecords = WithRequired<Activity, 'records'>;
export type GenericActivity = Common<Activity, GarminActivity>;

// Utility types

/**
 * Take a type and return a version where the property is required
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/**
 * Create a type with the shared properties of two types
 */
export type Common<T1, T2> = Pick<T1 | T2, Extract<keyof T1, keyof T2>>;
