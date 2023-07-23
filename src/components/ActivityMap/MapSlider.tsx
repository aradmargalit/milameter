import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import PauseCircleOutlineOutlined from '@mui/icons-material/PauseCircleOutlineOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import { Box, Button, Slider, SliderProps } from '@mui/joy';
import { Duration } from 'luxon';
import { useCallback, useEffect, useRef, useState } from 'react';

import { DEFAULT_TIME_SNAP_INTERVAL } from '@/config';
import { UNIXEpochSeconds } from '@/types';

/**
 * Converts slider value to nice human readable string
 * @param seconds the value in seconds that the slider is set to
 * @returns a human readable string in minutes and seconds
 */
function getTimeLabel(seconds: UNIXEpochSeconds): string {
  const duration = Duration.fromMillis(seconds * 1000).shiftTo(
    'minutes',
    'seconds'
  );
  return duration.toHuman({ unitDisplay: 'short' });
}

type Mark = {
  value: number;
  label: string;
};
type MapSliderProps = {
  marks: Mark[];
  activityDuration: number;
  onChange: (_value: number) => void;
  autoPlay?: boolean;
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

const DESIRED_PLAYBACK_LENGTH_MS = 15_000;

export function MapSlider({
  marks,
  activityDuration,
  onChange,
  autoPlay = true,
}: MapSliderProps) {
  const [value, setValue] = useState<number>(0);
  // Use a ref to keep track of current value to keep the effect stable
  const valueRef = useRef<number>(value);
  const [playing, setPlaying] = useState(autoPlay);

  const step = DEFAULT_TIME_SNAP_INTERVAL * 2;

  const goForward = useCallback(
    (val: number, stepOverride = step) => {
      setValue((val + stepOverride) % activityDuration);
    },
    [activityDuration, step]
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

  return (
    <Box sx={{ width: '80%' }}>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Button onClick={togglePlay} variant="outlined">
            {playing ? <PauseCircleOutlineOutlined /> : <PlayArrowOutlined />}
          </Button>
        </Box>
        <Box display="flex" flexDirection="row-reverse" gap={1}>
          <Button onClick={() => goForward(value)} variant="outlined">
            <ArrowForwardOutlined />
          </Button>
          <Button onClick={goBack} variant="outlined">
            <ArrowBackOutlined />
          </Button>
        </Box>
      </Box>
      <Slider
        aria-label="Activity Time"
        variant="soft"
        step={step}
        valueLabelFormat={getTimeLabel}
        marks={marks}
        min={0}
        max={activityDuration}
        valueLabelDisplay="auto"
        onChange={handleChange}
        value={value}
      />
    </Box>
  );
}
