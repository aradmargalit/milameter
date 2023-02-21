import colormap from 'colormap';

import { SeparationTrajectory } from './distanceUtils';

export function buildGradient(
  separationTrajectory: SeparationTrajectory,
  activityDuration: number
) {
  const initialStr = 'linear-gradient(to right';

  const maxSep = Math.max(...separationTrajectory.map((sep) => sep.distance));
  const maxTime = separationTrajectory[0].time + activityDuration;

  const colors = colormap({
    colormap: 'inferno',
    nshades: separationTrajectory.length,
    format: 'hex',
    alpha: 1,
  });

  const finalStr = separationTrajectory.reduce(function (prev, curr) {
    const normalizedSep = curr.distance / maxSep;
    const colorIdx = Math.floor(
      normalizedSep * (separationTrajectory.length - 1)
    );
    const color = colors[colorIdx];
    const timeUntilEnd = maxTime - curr.time;
    const pctTimeUntilEnd = 100 * (timeUntilEnd / activityDuration);
    const pct = 100 - pctTimeUntilEnd;

    return `${prev}, ${color} ${pct.toFixed(0)}%`;
  }, initialStr);
  return `${finalStr})`;
}
