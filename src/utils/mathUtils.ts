export function mean(x: number[]): number {
  const sum = x.reduce((total, curr) => curr + total, 0);
  return sum / x.length;
}
