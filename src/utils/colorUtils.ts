import colormap from 'colormap';

export type GradientTimePoint = {
  time: number;
  val: number;
};

type ColorGradientStrFromVectorArgs = {
  timepoints: GradientTimePoint[];
  maxTime: number;
  cmapName: string;
  invertCmap: boolean;
};

export function colorGradientStrFromVector({
  timepoints,
  maxTime,
  cmapName,
  invertCmap,
}: ColorGradientStrFromVectorArgs): string {
  const values = timepoints.map((tp) => tp.val);
  const times = timepoints.map((tp) => tp.time);
  // create colormap entries
  const colors = colormap({
    colormap: cmapName,
    nshades: values.length,
    format: 'hex',
    alpha: 1,
  });

  // compute the highest value we have
  const maxValue = Math.max(...values);
  const minTime = Math.min(...times);

  // gradient will go from left to right; we append as we go
  const initialStr = 'linear-gradient(to right';

  const finalStr = timepoints.reduce(function (prev, curr) {
    // convert value to a fraction in [0, 1]
    const normalizedVal = curr.val / maxValue;
    const fractionalIndex = invertCmap ? 1 - normalizedVal : normalizedVal;

    // map from a normalized value to an index by multiplying by number of possible vals
    const colorIdx = Math.floor(fractionalIndex * (values.length - 1));
    const color = colors[colorIdx];

    // figure out how far along gradient to plot
    const timeUntilEnd = maxTime - curr.time;
    const pctTimeUntilEnd = 100 * (timeUntilEnd / (maxTime - minTime));
    const pct = 100 - pctTimeUntilEnd;

    return `${prev}, ${color} ${pct.toFixed(0)}%`;
  }, initialStr);

  // return the final string, don't forget the closing right-paren!
  return `${finalStr})`;
}
