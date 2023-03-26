import { UserPreferences } from '@/models/userPreferences';

import { clearInvalidVersions } from './cacheInvalidation';
import { getItem, removeItem, setItem } from './localStorage';
import { keyString, StorageKey } from './storageKey';

/**
 * This storage key serves as a breaking version indicator
 * increment the version every time the userPreferences model has breaking changes
 */
const userPreferencesStorageKey: StorageKey = {
  key: 'USER_PREFS',
  version: 1,
};

const userPrefsKey = keyString(userPreferencesStorageKey);

export function getStoredPreferences(): UserPreferences | null {
  const jsonStringifiedUserPrefs = getItem(userPrefsKey);
  if (!jsonStringifiedUserPrefs) {
    return null;
  }

  return JSON.parse(jsonStringifiedUserPrefs);
}

export function storeUserPreferences(userPrefs: UserPreferences): void {
  setItem(userPrefsKey, JSON.stringify(userPrefs));
}

export function clearStoredPreferences() {
  removeItem(userPrefsKey);
}

export function removeInvalidUserPrefs() {
  clearInvalidVersions(userPreferencesStorageKey);
}
