import { Separation, SeparationTrajectory } from './distanceUtils';
import { getZoomies, Zoom } from './zoomies';

function makeSeparation(partial: Partial<Separation>): Separation {
  return {
    distance: 1,
    garminCoord: [1, 2],
    stravaCoord: [1, 2],
    time: 100,
    ...partial,
  };
}

describe(getZoomies.name, () => {
  it.each<[string, SeparationTrajectory, Zoom[]]>([
    ['there are no separations', [], []],
    [
      'separations are within threshold',
      [makeSeparation({ distance: 1 }), makeSeparation({ distance: 2 })],
      [],
    ],
    [
      'separation is never closed',
      [makeSeparation({ distance: 1 }), makeSeparation({ distance: 100 })],
      [],
    ],
    [
      'separation is exceeded and then closed',
      [
        makeSeparation({ distance: 1 }),
        makeSeparation({ distance: 100 }),
        makeSeparation({ distance: 4 }),
      ],
      [makeSeparation({ distance: 4 })],
    ],
    [
      'separation is exceeded and then closed multiple times',
      [
        makeSeparation({ distance: 1 }),
        makeSeparation({ distance: 100 }),
        makeSeparation({ distance: 4 }),
        makeSeparation({ distance: 100 }),
        makeSeparation({ distance: 3 }),
      ],
      [makeSeparation({ distance: 4 }), makeSeparation({ distance: 3 })],
    ],
  ])(
    'it correctly creates zoomies when %s',
    (_descriptor, separationTrajectory, expectedZoomies) => {
      const zoomies = getZoomies(separationTrajectory);
      expect(zoomies).toEqual(expectedZoomies);
    }
  );
});
