export function uniqueBy<T extends object>(arr: T[], key: keyof T) {
  const seen = new Set<T>();

  return arr.filter((it) => {
    const val = it[key];
    if (seen.has(val)) {
      return false;
    } else {
      seen.add(val);
      return true;
    }
  });
}
