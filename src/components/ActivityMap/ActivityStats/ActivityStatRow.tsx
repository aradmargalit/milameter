import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';
import { GenericActivity } from '@/types';

import { ActivityStatData } from './ActivityStatData';

export type StatisticRow = {
  label: string;
  unit: string;
  /**
   * Transform the raw metric into a string
   * @param _ga the activity
   * @returns a string representing the metric for the activity
   */
  transformFn: (_ga: GenericActivity) => string;
  /**
   * A string to use instead of the computed metric value for Strava
   */
  stravaOverride?: string;
  /**
   * A string to use instead of the computed metric value for Garmin
   */
  garminOverride?: string;
};

type ActivityStatRowProps = StatisticRow;

export function ActivityStatRow({
  label,
  unit,
  transformFn,
  stravaOverride,
  garminOverride,
}: ActivityStatRowProps) {
  const { stravaActivity, garminActivity } = useActivityPair();

  return (
    <tr key={label}>
      <td>{label}</td>
      <td>
        {stravaOverride ?? (
          <ActivityStatData data={transformFn(stravaActivity)} unit={unit} />
        )}
      </td>
      {garminActivity && (
        <td>
          {garminOverride ?? (
            <ActivityStatData data={transformFn(garminActivity)} unit={unit} />
          )}
        </td>
      )}
    </tr>
  );
}
