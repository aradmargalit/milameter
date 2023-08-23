import { createContext, ReactNode, useContext } from 'react';

import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords } from '@/types';

import { useGarminActivities } from './GarminActivityContext';

type ActivityPairContextData = {
  stravaActivity: ActivityWithRecords;
  garminActivity: GarminActivity | null;
};

type ActivityPairContextMethods = {};

type ActivityPairContextValue = ActivityPairContextData &
  ActivityPairContextMethods;

const ActivityPairContext = createContext<ActivityPairContextValue | undefined>(
  undefined
);

type ActivityPairProviderProps = {
  children: ReactNode;
  stravaActivity: ActivityWithRecords;
};

export function ActivityPairProvider({
  children,
  stravaActivity,
}: ActivityPairProviderProps) {
  const { selectedGarminActivity: garminActivity } = useGarminActivities();

  const value: ActivityPairContextValue = {
    garminActivity,
    stravaActivity,
  };

  return (
    <ActivityPairContext.Provider value={value}>
      {children}
    </ActivityPairContext.Provider>
  );
}

export function useActivityPair() {
  const context = useContext(ActivityPairContext);

  if (!context) {
    throw Error(
      'Cannot use "useActivityPair" without wrapping this component in a ActivityPairProvider'
    );
  }

  return context;
}
