// This is fine for now, eventually we'll lock down a production token to just our domain
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiYXJhZG1hcmdhbGl0IiwiYSI6ImNsZTBkbnk1NDE5eGkzbnIzNGE3Zmx1NnQifQ.qOh6-x2DMYLm9qcp9ck-MA';

/**
 * Because watches collect data at odd intervals, we need to "snap" each record to a
 * common multiple of the Unix epoch time. For example, if this value is "3", every
 * timestamp we encounter gets rolled down to the nearest multiple of 3.
 */
export const DEFAULT_TIME_SNAP_INTERVAL = 3;
