import { createContext, useContext, useState } from 'react';

import { GarminActivity } from '@/models/garminActivity';
import { garminActivityFromFile } from '@/utils/garminUtils';

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

export function GarminActivityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [garminActivities, setGarminActivities] = useState<GarminActivity[]>(
    []
  );
  const [selectedGarminActivity, setSelectedGarminActivity] =
    useState<GarminActivity | null>(null);

  const clearActivities = () => setGarminActivities([]);
  const uploadActivities = async (fitFiles: File[]) => {
    const activities = await Promise.all(fitFiles.map(garminActivityFromFile));
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
