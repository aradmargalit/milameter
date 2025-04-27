import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';
import {
  computeMaxAccel,
  computeMaxDecel,
  computePace,
  metersToFeet,
  metersToMiles,
  paceFromSpeed,
} from '@/utils/distanceUtils';

import { StatisticRow } from './ActivityStatRow';

type UseActivityStatsRows = { statsRows: StatisticRow[]; columns: string[] };

export function useActivityStatsRows(): UseActivityStatsRows {
  const { stravaActivity, garminActivity, derivedActivityProperties } =
    useActivityPair();

  const columns: string[] = [
    'Statistic',
    `${garminActivity ? '🏃‍♂️ Human' : 'Value'}`,
    ...(garminActivity ? ['🐶 Dog'] : []),
  ];

  const statistics: StatisticRow[] = [
    {
      label: 'Distance',
      transformFn: (activity) => metersToMiles(activity.distance).toFixed(2),
      unit: 'mi',
    },
    {
      label: 'Pace',
      transformFn: (activity) => computePace(activity),
      unit: 'min/mi',
    },
    {
      label: 'Max Pace',
      transformFn: (activity) => paceFromSpeed(activity.maxSpeed),
      unit: 'min/mi',
    },
  ];

  if (stravaActivity.records) {
    const recordStatistics: StatisticRow[] = [
      {
        label: 'Max Acceleration',
        transformFn: (activity) =>
          activity.records ? computeMaxAccel(activity.records).toFixed(1) : '',
        unit: 'm/s^2',
      },
      {
        label: 'Max Deceleration',
        transformFn: (activity) =>
          activity.records ? computeMaxDecel(activity.records).toFixed(1) : '',
        unit: 'm/s^2',
      },
      {
        label: 'Elevation Gain',
        transformFn: (activity) =>
          metersToFeet(activity.totalElevationGain).toFixed(0),
        unit: 'ft',
      },
    ];
    statistics.push(...recordStatistics);
  }

  if (derivedActivityProperties?.zoomies.length) {
    statistics.push({
      label: 'Zoomies 💨',
      stravaOverride: '',
      transformFn: (activity) =>
        (
          derivedActivityProperties.zoomies.length /
          metersToMiles(activity.distance)
        ).toFixed(2),
      unit: 'per mile',
    });
  }

  if (derivedActivityProperties?.maxSeparation) {
    statistics.push({
      label: 'Max Separation',
      stravaOverride: '',
      transformFn: (_garminActivity) => {
        return (
          derivedActivityProperties.maxSeparation?.distance.toFixed(2) ?? ''
        );
      },
      unit: 'm',
    });
  }

  return {
    columns,
    statsRows: statistics,
  };
}
