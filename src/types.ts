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

export type Coordinate = [number, number];
export type Coordinates = Coordinate[];
export type Record = {
  time: UNIXEpochSeconds;
  coord: Coordinate;
};
