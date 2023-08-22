import { computePace, METERS_PER_MILE } from './distanceUtils';

describe('computePace', () => {
  it.each<[number, number, string]>([
    [4, 36, '09:00'],
    [1, 6, '06:00'],
    [2, 41, '20:30'],
    [2, 400, '200:00'],
  ])(
    'outputs correct pace with %s miles and %s minutes, output is: %s',
    (miles, minutes, expectedPace) => {
      const meters = miles * METERS_PER_MILE;
      expect(
        computePace({
          coordinates: [],
          distance: meters,
          elapsedTime: minutes * 60 + 1,
          maxSpeed: 10,
          records: [],
          totalElevationGain: 0,
        })
      ).toBe(expectedPace);
    }
  );
});
