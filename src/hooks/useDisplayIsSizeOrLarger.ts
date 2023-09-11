import { useTheme } from '@mui/joy';
import { Breakpoint, useMediaQuery } from '@mui/material';

export function useDisplayIsSizeOrLarger(breakpoint?: Breakpoint) {
  const theme = useTheme();
  const displayIsSizeOrLarger = useMediaQuery(
    theme.breakpoints.up(breakpoint ?? 'md')
  );

  return displayIsSizeOrLarger;
}
