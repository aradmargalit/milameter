const METERS_PER_MILE = 1609.34 as const;

export function metersToMiles(meters: number): number {
  return meters / METERS_PER_MILE;
}
