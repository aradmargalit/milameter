import { Coordinate, Record } from '@/types';

import { isDistancePossible } from './garminUtils';

jest.mock('@garmin-fit/sdk', () => {});

function makeMockRecord(partialRecord?: Partial<Record>): Record {
  return { altitude: 0, coord: [0, 0], time: 0, ...partialRecord };
}

describe('garminUtils', () => {
  describe(isDistancePossible.name, () => {
    it('returns true for the first record', () => {
      expect(isDistancePossible(makeMockRecord(), 0, [])).toBe(true);
    });

    it('returns true when records are reasonably close', () => {
      const first: Coordinate = [37.709008223518005, -121.92952352047195]; // Chuck-e-cheese Dublin CA
      const second: Coordinate = [37.32351496896695, -121.95168433930172]; // Winchester Mystery House San Jose CA
      expect(
        isDistancePossible(makeMockRecord({ coord: second }), 1, [
          makeMockRecord({ coord: first }),
          makeMockRecord({ coord: second }),
        ])
      ).toBe(true);
    });

    it('returns false when records are too far ', () => {
      const first: Coordinate = [37.709008223518005, -121.92952352047195]; // Chuck-e-cheese Dublin CA
      const second: Coordinate = [48.86198768434477, 2.294847260380136]; // Eiffel tower
      expect(
        isDistancePossible(makeMockRecord({ coord: second }), 1, [
          makeMockRecord({ coord: first }),
          makeMockRecord({ coord: second }),
        ])
      ).toBe(false);
    });
  });
});
