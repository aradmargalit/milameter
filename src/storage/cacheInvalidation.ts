import { keyString, StorageKey } from './storageKey';

export function clearInvalidVersions(currentKey: StorageKey): void {
  const { key, version } = currentKey;

  // special case, if the cached version precedes versioning, clear it
  window.localStorage.removeItem(key);

  // for every version < current, remove it
  for (let i = version; i >= 0; i--) {
    const expiredKey: StorageKey = {
      key,
      version: i - 1,
    };

    console.log('removing: ', keyString(expiredKey));
    window.localStorage.removeItem(keyString(expiredKey));
  }
}
