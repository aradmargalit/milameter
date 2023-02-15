import { DateTime } from 'luxon';

/**
 * floorNearestInterval converts the datetime to unix epoch time, rounded down to nearest
 * number divisible by the specified interval.
 *
 * @param dt a luxon DateTime object
 * @param interval the resolution at which we want to snap values to
 * @returns unix epoch seconds, snapped to the resolution indicated by interval
 */
export function floorNearestInterval(dt: DateTime, interval: number): number {
  const unixEpochSeconds = dt.toUnixInteger();

  // we can't do anything with intervals
  if (interval < 1 || !Number.isSafeInteger(interval)) {
    return unixEpochSeconds;
  }
  const remainder = unixEpochSeconds % interval;
  return unixEpochSeconds - remainder;
}
