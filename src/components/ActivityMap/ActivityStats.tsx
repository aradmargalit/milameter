import { Table } from '@mui/joy';

import { useActivityPair } from '@/contexts/ActivityPairContext/ActivityPairContext';
import {
  computeMaxAccel,
  computeMaxDecel,
  computePace,
  metersToFeet,
  metersToMiles,
  paceFromSpeed,
} from '@/utils/distanceUtils';

type StatisticRow = {
  dog: string;
  human: string;
  label: string;
};

export function ActivityStats() {
  const { stravaActivity, garminActivity, derivedActivityProperties } =
    useActivityPair();

  const columns: string[] = [
    'Statistic',
    '🏃‍♂️ Human',
    ...(garminActivity ? ['🐶 Dog'] : []),
  ];

  const statistics: StatisticRow[] = [
    {
      dog: garminActivity
        ? metersToMiles(garminActivity.distance).toFixed(2)
        : '',
      human: metersToMiles(stravaActivity.distance).toFixed(2),
      label: 'Distance (mi)',
    },
    {
      dog: garminActivity ? computePace(garminActivity) : '',
      human: computePace(stravaActivity),
      label: 'Pace (min/mi)',
    },
    {
      dog: garminActivity ? paceFromSpeed(garminActivity.maxSpeed) : '',
      human: paceFromSpeed(stravaActivity.maxSpeed),
      label: 'Max Pace (min/mi)',
    },
  ];

  if (derivedActivityProperties?.zoomies.length) {
    statistics.push({
      dog: (
        derivedActivityProperties.zoomies.length /
        metersToMiles(garminActivity.distance)
      ).toFixed(2),
      human: '',
      label: 'Average zoomies per mile 💨',
    });
  }

  if (stravaActivity.records) {
    const recordStatistics: StatisticRow[] = [
      {
        dog: garminActivity
          ? computeMaxAccel(garminActivity.records).toFixed(1)
          : '',
        human: computeMaxAccel(stravaActivity.records).toFixed(1),
        label: 'Max Acceleration (m/s^2)',
      },
      {
        dog: garminActivity
          ? computeMaxDecel(garminActivity.records).toFixed(1)
          : '',
        human: computeMaxDecel(stravaActivity.records).toFixed(1),
        label: 'Max Deceleration (m/s^2)',
      },
      {
        dog: garminActivity
          ? metersToFeet(garminActivity.totalElevationGain).toFixed(0)
          : '',
        human: metersToFeet(stravaActivity.totalElevationGain).toFixed(0),
        label: 'Elevation Gain (ft)',
      },
    ];
    statistics.push(...recordStatistics);
  }

  return (
    <Table>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {statistics.map(({ label, dog, human }) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{human}</td>
            {garminActivity && <td>{dog}</td>}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
