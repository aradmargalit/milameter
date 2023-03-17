export function uniqBy<T extends any[], V extends string | number | symbol>(
  a: T,
  keyFn: (_t: T) => V
) {
  const seen: { [_key in V]?: boolean } = {};
  return a.filter((item) => {
    const k = keyFn(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}
