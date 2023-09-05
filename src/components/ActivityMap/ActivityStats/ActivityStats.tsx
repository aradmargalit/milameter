import { Table } from '@mui/joy';

import { ActivityStatRow } from './ActivityStatRow';
import { useActivityStatsRows } from './useActivityStatsRows';

export function ActivityStats() {
  const { columns, statsRows } = useActivityStatsRows();

  return (
    <Table hoverRow>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {statsRows.map((statsRow) => (
          <ActivityStatRow key={statsRow.label} {...statsRow} />
        ))}
      </tbody>
    </Table>
  );
}
