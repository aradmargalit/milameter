import { createContext, ReactNode, useContext } from 'react';

import { GarminActivity } from '@/models/garminActivity';
import { ActivityWithRecords } from '@/types';

import { useGarminActivities } from '../GarminActivityContext';
import {
  buildDerivedActivityProperties,
  DerivedActivityProperties,
} from './derivedActivityProperties';

type BaseActivityPairContextData = {
  stravaActivity: ActivityWithRecords;
  garminActivity: null;
  derivedActivityProperties: null;
};

type ActivityPairContextDataWithGarmin = Omit<
  BaseActivityPairContextData,
  'garminActivity' | 'derivedActivityProperties'
> & {
  garminActivity: GarminActivity;
  derivedActivityProperties: DerivedActivityProperties;
};

type ActivityPairContextData =
  | BaseActivityPairContextData
  | ActivityPairContextDataWithGarmin;

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

  const value: ActivityPairContextValue = garminActivity
    ? {
        derivedActivityProperties: buildDerivedActivityProperties({
          garminActivity,
          stravaActivity,
        }),
        garminActivity,
        stravaActivity,
      }
    : {
        derivedActivityProperties: null,
        garminActivity: null,
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
