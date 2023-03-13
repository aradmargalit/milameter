import { GarminActivity } from '@/models/garminActivity';

const GARMIN_STORAGE_KEY = 'STORED_GARMIN_ACTIVITIES';

export function getStoredGarminActivites(): GarminActivity[] {
  const jsonStringifiedActivites =
    window.localStorage.getItem(GARMIN_STORAGE_KEY);
  if (!jsonStringifiedActivites) {
    return [];
  }

  return JSON.parse(jsonStringifiedActivites);
}

export function storeGarminActivities(garminActivites: GarminActivity[]): void {
  window.localStorage.setItem(
    GARMIN_STORAGE_KEY,
    JSON.stringify(garminActivites)
  );
}

export function clearStoredGarminActivities() {
  window.localStorage.removeItem(GARMIN_STORAGE_KEY);
}
