import { Box, Slider } from '@mui/joy';
import { Duration } from 'luxon';

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
  onChange: (
    _event: Event,
    _value: number | number[],
    _activeThumb: number
  ) => void;
};

export function MapSlider({
  marks,
  activityDuration,
  onChange,
}: MapSliderProps) {
  return (
    <Box sx={{ width: '80%' }}>
      <Slider
        aria-label="Activity Time"
        defaultValue={0}
        variant="soft"
        step={DEFAULT_TIME_SNAP_INTERVAL * 2}
        valueLabelFormat={getTimeLabel}
        marks={marks}
        min={0}
        max={activityDuration}
        valueLabelDisplay="auto"
        onChange={onChange}
      />
    </Box>
  );
}
