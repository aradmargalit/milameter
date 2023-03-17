import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import { Box, Button, Slider, SliderProps } from '@mui/joy';
import { Duration } from 'luxon';
import { useEffect, useState } from 'react';

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
};

export function MapSlider({
  marks,
  activityDuration,
  onChange,
}: MapSliderProps) {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const handleChange: SliderProps['onChange'] = (
    _event,
    newVal,
    _activeThumb
  ) => {
    // technically the slider could give us an array of values (but it never will in
    // this impl, so we just theoretically pull the first value
    const firstValue = Array.isArray(newVal) ? newVal[0] : newVal;
    setValue(firstValue);
  };

  const step = DEFAULT_TIME_SNAP_INTERVAL * 2;

  const goForward = () =>
    setValue((val) => Math.min(activityDuration, val + step));
  const goBack = () => setValue(Math.max(0, value - step));

  return (
    <Box sx={{ width: '80%' }}>
      <Box display="flex" flexDirection="row-reverse" gap={1}>
        <Button onClick={goForward} variant="outlined">
          <ArrowForwardOutlined />
        </Button>
        <Button onClick={goBack} variant="outlined">
          <ArrowBackOutlined />
        </Button>
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
