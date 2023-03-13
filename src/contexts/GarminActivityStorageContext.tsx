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

export function GarminActivityStorageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [storedActivities, setStoredActivities] = useState<GarminActivity[]>(
    []
  );

  useEffect(() => {
    setStoredActivities(getStoredGarminActivites());
  }, []);

  function storeGarminActivities(activities: GarminActivity[]) {
    try {
      localStorageStoreGarminActivities(activities);
    } catch (e) {
      console.error('caught local storage error in Context');
      throw e;
    }
  }

  const value: GarminActivityStorageContextValue = {
    storedActivities,
    clearStoredGarminActivities,
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
