import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { GarminActivity } from '@/models/garminActivity';
import {
  clearStoredGarminActivities,
  getStoredGarminActivites,
  storeGarminActivities as localStorageStoreGarminActivities,
} from '@/storage/garminActivityLocalStorage';

type GarminActivityStorageContextData = {
  storedActivities: GarminActivity[];
};

type GarminActivityStorageContextMethods = {
  clearStoredGarminActivities: () => void;
  storeGarminActivities: (_activities: GarminActivity[]) => void;
};

type GarminActivityStorageContextValue = GarminActivityStorageContextData &
  GarminActivityStorageContextMethods;

const GarminActivityStorageContext = createContext<
  GarminActivityStorageContextValue | undefined
>(undefined);

// TODO: move to a generic util
function uniqBy<T extends any[]>(a: T, keyFn: (_t: T) => string) {
  var seen: Record<string, boolean> = {};
  return a.filter((item) => {
    var k = keyFn(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}

export function GarminActivityStorageProvider({
  children,
}: {
  children: ReactNode;
}) {
  // we aim to keep this perfectly synchronized with app state
  const [storedActivities, setStoredActivities] = useState<GarminActivity[]>(
    []
  );

  // We need to hydrate this value once the client hydrates, otherwise there's no localStorage on the server
  useEffect(() => {
    setStoredActivities(getStoredGarminActivites());
  }, []);

  function storeGarminActivities(activities: GarminActivity[]) {
    try {
      const existingActivities = getStoredGarminActivites();
      const allActivitiesToStore = [...activities, ...existingActivities];
      const deduped = uniqBy(allActivitiesToStore, JSON.stringify);
      localStorageStoreGarminActivities(deduped);
      setStoredActivities(deduped);
    } catch (e) {
      console.error('caught local storage error in Context');
      throw e;
    }
  }

  function clearGarminActvities() {
    clearStoredGarminActivities();
    setStoredActivities([]);
  }

  const value: GarminActivityStorageContextValue = {
    storedActivities,
    clearStoredGarminActivities: clearGarminActvities,
    storeGarminActivities,
  };

  return (
    <GarminActivityStorageContext.Provider value={value}>
      {children}
    </GarminActivityStorageContext.Provider>
  );
}

export function useGarminActivityStorage() {
  const context = useContext(GarminActivityStorageContext);

  if (!context) {
    throw Error(
      'Cannot use "useGarminActivityStorage" without wrapping this component in a GarminActivityProvider'
    );
  }

  return context;
}
