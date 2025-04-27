import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import { Button } from '@mui/joy';

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
  /**
   * what should happen when the user clicks "zoom to"
   * usually zooms the map to a relevant window for the data point
   */
  onZoom?: () => void;
};

type ActivityStatRowProps = StatisticRow;

export function ActivityStatRow({
  label,
  unit,
  transformFn,
  stravaOverride,
  garminOverride,
  onZoom,
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
      {onZoom && (
        <td>
          <Button variant="outlined" onClick={onZoom}>
            <CenterFocusStrongIcon />
          </Button>
        </td>
      )}
    </tr>
  );
}
