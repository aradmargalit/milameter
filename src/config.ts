export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/**
 * Because watches collect data at odd intervals, we need to "snap" each record to a
 * common multiple of the Unix epoch time. For example, if this value is "3", every
 * timestamp we encounter gets rolled down to the nearest multiple of 3.
 */
export const DEFAULT_TIME_SNAP_INTERVAL = 3;
