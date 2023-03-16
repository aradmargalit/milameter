import { clearInvalidVersions } from './cacheInvalidation';
import { removeItem } from './localStorage';
import { StorageKey } from './storageKey';

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
