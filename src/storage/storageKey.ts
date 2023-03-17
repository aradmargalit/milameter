export type StorageKey = {
  /**
   * The base of the key, should be any identifier string
   */
  key: string;
  /**
   * The version of the key, can be any incrementing number
   */
  version: number;
};

export function keyString(storageKey: StorageKey): string {
  return `${storageKey.key}.${storageKey.version}`;
}
