export function uniqueBy<T>(arr: T[], key: keyof T) {
  let seen = new Set<T>();

  return arr.filter((it) => {
    let val = it[key] as T;
    if (seen.has(val)) {
      return false;
    } else {
      seen.add(val);
      return true;
    }
  });
}
