import { GarminActivity } from '@/models/garminActivity';

import { clearInvalidVersions } from './cacheInvalidation';
import { getItem, removeItem, setItem } from './localeStorage';
import { keyString, StorageKey } from './storageKey';

/**
 * The storage key serves as a breaking version indicator
 * It should always be formatted with a trailing ".{version}"
 * e.g. STORED_GARMIN_ACTIVITIES.1
 */
const garminStorageKey: StorageKey = {
  key: 'STORED_GARMIN_ACTIVITIES',
  version: 2,
};

const garminStorageKeyString = keyString(garminStorageKey);

export function getStoredGarminActivites(): GarminActivity[] {
  const jsonStringifiedActivites = getItem(garminStorageKeyString);
  if (!jsonStringifiedActivites) {
    return [];
  }

  return JSON.parse(jsonStringifiedActivites);
}

export function storeGarminActivities(garminActivites: GarminActivity[]): void {
  setItem(garminStorageKeyString, JSON.stringify(garminActivites));
}

export function clearStoredGarminActivities() {
  removeItem(garminStorageKeyString);
}

export function removeInvalidGarminActivities() {
  clearInvalidVersions(garminStorageKey);
}
