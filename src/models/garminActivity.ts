import { Coordinates } from '@/types';

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
};

export type GarminActivity = {
  records: GarminActivityRecord[];
  distanceMeters: number; // meters
  coordinates: Coordinates;
};
