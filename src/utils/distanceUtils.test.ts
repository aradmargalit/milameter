import { computePace, METERS_PER_MILE } from './distanceUtils';
test('4 miles in 36 minutes is 9:00', () => {
  const fourMilesInMeters = 4 * METERS_PER_MILE;
  expect(
    computePace({
      distance: fourMilesInMeters,
      elapsedTime: 36 * 60 + 1,
      coordinates: [],
      records: [],
    })
  ).toBe('09:00');
});

test('1 mile in 6 minutes is 6:00', () => {
  const oneMileInMeters = 1 * METERS_PER_MILE;
  expect(
    computePace({
      distance: oneMileInMeters,
      elapsedTime: 6 * 60 + 1,
      coordinates: [],
      records: [],
    })
  ).toBe('06:00');
});

test('2 miles in 41 minutes is 20:30', () => {
  expect(
    computePace({
      distance: 2 * METERS_PER_MILE,
      elapsedTime: 41 * 60 + 1,
      coordinates: [],
      records: [],
    })
  ).toBe('20:30');
});

test('2 miles in 400 minutes is 200:00', () => {
  expect(
    computePace({
      distance: 2 * METERS_PER_MILE,
      elapsedTime: 400 * 60 + 1,
      coordinates: [],
      records: [],
    })
  ).toBe('200:00');
});
