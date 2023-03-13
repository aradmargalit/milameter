export function uniqBy<T extends any[]>(a: T, keyFn: (_t: T) => string) {
  var seen: Record<string, boolean> = {};
  return a.filter((item) => {
    var k = keyFn(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
}
