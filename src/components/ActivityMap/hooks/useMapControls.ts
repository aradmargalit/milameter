import { SliderProps } from '@mui/joy';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
const step = DEFAULT_TIME_SNAP_INTERVAL * 2;
const DESIRED_PLAYBACK_LENGTH_MS = 15_000;

export type UseMapControlsOptions = {
  autoPlay?: boolean;
  onChange: (_value: number) => void;
  activityDuration: number;
};

/**
 *
 * @param targetPlaybackMs how long you want playback to take in milliseconds
 * @param activitySteps how many intervals exist in the activity
 * @returns the interval, expressed in millseconds to set in your setInterval
 */
function getIntervalFromDuration(
  targetPlaybackMs: number,
  activitySteps: number
) {
  return targetPlaybackMs / activitySteps;
}

export function useMapControls({
  onChange,
  autoPlay,
  activityDuration,
}: UseMapControlsOptions) {
  const [value, setValue] = useState<number>(0);
  // Use a ref to keep track of current value to keep the effect stable
  const valueRef = useRef<number>(value);
  const [playing, setPlaying] = useState(autoPlay);

  const goForward = useCallback(
    (val: number, stepOverride = step) => {
      setValue((val + stepOverride) % activityDuration);
    },
    [activityDuration]
  );

  const goBack = () => setValue(Math.max(0, value - step));
  const togglePlay = () => setPlaying(!playing);

  // When the value is updated (either automatically or manually) update our ref value
  useEffect(() => {
    onChange(value);
    valueRef.current = value;
  }, [onChange, value]);

  useEffect(() => {
    // This effect will only run when "playing" changes since the other 2 dependencies are stable
    // when playing is switched to false, the cleanup is run and removes the interval
    if (playing) {
      const intervalMs = getIntervalFromDuration(
        DESIRED_PLAYBACK_LENGTH_MS,
        activityDuration
      );

      const interval = setInterval(() => {
        // override the default step with 1 for smoother playback
        goForward(valueRef.current, 1);
      }, intervalMs);

      return () => clearInterval(interval);
    }
  }, [playing, activityDuration, goForward]);

  const handleChange: SliderProps['onChange'] = (
    _event,
    newVal,
    _activeThumb
  ) => {
    // technically the slider could give us an array of values (but it never will in
    // this impl, so we just theoretically pull the first value
    setValue(Array.isArray(newVal) ? newVal[0] : newVal);
  };

  return {
    playing,
    value,
    togglePlay,
    goBack,
    goForward,
    step,
    handleChange,
  };
}
