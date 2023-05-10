/**
 * If the input is an array, return array[0]
 * else return self
 */
function firstOrSelf<T>(maybeArray: T | T[]): T {
  if (maybeArray instanceof Array) {
    return maybeArray[0];
  }

  return maybeArray;
}

export function parseQueryParamToInt(
  queryParam: string | string[],
  radix = 10
): number {
  return parseInt(firstOrSelf(queryParam), radix);
}
