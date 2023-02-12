export function truncateTitle(s: string, maxChars: number): string {
  const trunc = s.slice(0, maxChars);
  if (s.length > maxChars) {
    return `${trunc}...`;
  }
  return trunc;
}
