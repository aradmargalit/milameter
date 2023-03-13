import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { GarminActivity } from '@/models/garminActivity';
import { garminActivityFromFile } from '@/utils/garminUtils';

import { useGarminActivityStorage } from './GarminActivityStorageContext';

type GarminActivityContextData = {
  garminActivities: GarminActivity[];
  selectedGarminActivity: GarminActivity | null;
};

type GarminActivityContextMethods = {
  clearActivities: () => void;
  uploadActivities: (_fitFiles: File[]) => Promise<void>;
  setSelectedGarminActivity: (_garminActivity: GarminActivity | null) => void;
};

type GarminActivityContextValue = GarminActivityContextData &
  GarminActivityContextMethods;

const GarminActivityContext = createContext<
  GarminActivityContextValue | undefined
>(undefined);

export function GarminActivityProvider({ children }: { children: ReactNode }) {
  const {
    clearStoredGarminActivities,
    storeGarminActivities,
    storedActivities,
  } = useGarminActivityStorage();

  const [garminActivities, setGarminActivities] =
    useState<GarminActivity[]>(storedActivities);

  const [selectedGarminActivity, setSelectedGarminActivity] =
    useState<GarminActivity | null>(null);

  // When the stored activities hydrate, we want to update this context
  // TODO: will this be problematic when we clear stored activities?
  useEffect(() => {
    setGarminActivities(storedActivities);
  }, [storedActivities]);

  const clearActivities = () => {
    setGarminActivities([]);
    clearStoredGarminActivities();
  };

  const uploadActivities = async (fitFiles: File[]) => {
    const activities = await Promise.all(fitFiles.map(garminActivityFromFile));
    storeGarminActivities(activities);
    setGarminActivities(activities);
  };

  const value: GarminActivityContextValue = {
    garminActivities,
    selectedGarminActivity,
    setSelectedGarminActivity,
    clearActivities,
    uploadActivities,
  };

  return (
    <GarminActivityContext.Provider value={value}>
      {children}
    </GarminActivityContext.Provider>
  );
}

export function useGarminActivities() {
  const context = useContext(GarminActivityContext);

  if (!context) {
    throw Error(
      'Cannot use "useGarminActivities" without wrapping this component in a GarminActivityProvider'
    );
  }

  return context;
}
