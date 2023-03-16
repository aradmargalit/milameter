// import { removeItem } from './localeStorage';
// import { keyString, StorageKey } from './storageKey';

import { clearInvalidVersions } from './cacheInvalidation';
import { removeItem } from './localStorage';
import { StorageKey } from './storageKey';

// export function clearInvalidVersions(currentKey: StorageKey): void {
//   const { key, version } = currentKey;

//   // special case, if the cached version precedes versioning, clear it
//   removeItem(key);

//   // for every version < current, remove it
//   for (let i = version; i >= 0; i--) {
//     const expiredKey: StorageKey = {
//       key,
//       version: i - 1,
//     };

//     console.log('removing: ', keyString(expiredKey));
//     removeItem(keyString(expiredKey));
//   }
// }

jest.mock('./localStorage');

describe('cache invalidation', () => {
  describe(clearInvalidVersions.name, () => {
    const currentKey: StorageKey = {
      key: 'MILA',
      version: 2,
    };

    it('removes versionless versions', () => {
      clearInvalidVersions(currentKey);
      expect(removeItem).toHaveBeenNthCalledWith(1, currentKey.key);
    });

    it('removes previous versions', () => {
      clearInvalidVersions(currentKey);
      expect(removeItem).toHaveBeenCalledWith('MILA.1');
    });

    it('does not remove the current versions', () => {
      clearInvalidVersions(currentKey);
      expect(removeItem).not.toHaveBeenCalledWith('MILA.2');
    });
  });
});
