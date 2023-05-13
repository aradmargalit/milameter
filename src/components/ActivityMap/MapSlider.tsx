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

export function MapSlider({
  marks,
  activityDuration,
  onChange,
  autoPlay = true,
}: MapSliderProps) {
  const [value, setValue] = useState<number>(0);
  const valueRef = useRef<number>(value);
  const [playing, setPlaying] = useState(autoPlay);

  const step = DEFAULT_TIME_SNAP_INTERVAL * 2;

  const goForward = useCallback(
    (val: number, stepOverride = step) => {
      const newValue = (val + stepOverride) % activityDuration;
      onChange(newValue);
      setValue(newValue);
    },
    [activityDuration, onChange, step]
  );
  const goBack = () => {
    const newValue = Math.max(0, value - step);
    setValue(newValue);
    onChange(newValue);
  };
  const togglePlay = () => setPlaying(!playing);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        goForward(valueRef.current, 1);
      }, 15_000 / activityDuration);

      return () => {
        clearInterval(interval);
      };
    }
  }, [activityDuration, goForward, playing]);

  const handleChange: SliderProps['onChange'] = (
    _event,
    newVal,
    _activeThumb
  ) => {
    // technically the slider could give us an array of values (but it never will in
    // this impl, so we just theoretically pull the first value
    const firstValue = Array.isArray(newVal) ? newVal[0] : newVal;
    setValue(firstValue);
    onChange(firstValue);
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
