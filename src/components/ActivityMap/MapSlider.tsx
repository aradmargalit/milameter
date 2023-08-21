import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardOutlined from '@mui/icons-material/ArrowForwardOutlined';
import PauseCircleOutlineOutlined from '@mui/icons-material/PauseCircleOutlineOutlined';
import PlayArrowOutlined from '@mui/icons-material/PlayArrowOutlined';
import { Box, Button, Slider } from '@mui/joy';
import { Duration } from 'luxon';

import { UNIXEpochSeconds } from '@/types';

import { useMapControls, UseMapControlsOptions } from './hooks/useMapControls';

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
} & UseMapControlsOptions;

export function MapSlider({
  marks,
  activityDuration,
  onChange,
  autoPlay = true,
}: MapSliderProps) {
  const { playing, value, togglePlay, goBack, goForward, step, handleChange } =
    useMapControls({ activityDuration, autoPlay, onChange });

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
