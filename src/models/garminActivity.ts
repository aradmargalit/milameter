import { Coordinates, Meters, MetersPerSecond, Record } from '@/types';

export type GarminActivityRecord = {
  timestamp: string;
  positionLat: number;
  positionLong: number;
  distance: number;
  altitude: number;
  speed: number;
  heartRate: number;
  cadence: number;
  temperature: number;
  fractionalCadence: number;
  enhancedAltitude: number;
  enhancedSpeed: number;
  enhancedMaxSpeed: number;
};

/**
 * Represents a parsed Garmin activity
 * note: when updating this model with breaking changes
 * increment the cache version in src/storage/garminActivityLocalStorage
 */
export type GarminActivity = {
  records: Record[];
  distance: Meters;
  elapsedTime: number;
  coordinates: Coordinates;
  totalElevationGain: Meters;
  maxSpeed: MetersPerSecond;
  altitudeStream: Meters[];
};
