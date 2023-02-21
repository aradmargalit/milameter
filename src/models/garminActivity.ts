import { Coordinates, Record } from '@/types';

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
  records: Record[];
  distance: number; // meters
  elapsedTime: number;
  coordinates: Coordinates;
};
