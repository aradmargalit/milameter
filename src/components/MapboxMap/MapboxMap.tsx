import { Box, Option, Select, SelectProps, Typography } from '@mui/joy';
import { MutableRefObject } from 'react';
import Map, { FullscreenControl, MapRef } from 'react-map-gl';

import { MAPBOX_ACCESS_TOKEN } from '@/config';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

import { MapStyle, mapStyles } from './mapStyles';

export type MapboxMapProps = {
  children?: React.ReactNode;
  ref?: MutableRefObject<MapRef | null>;
  // kind of ugly, but "MapProps" has a small bug which makes it unusable
} & Partial<React.ComponentProps<typeof Map>>;

/**
 * Renders a Mapbox GL JS Map with our access key and sensible defaults
 */
export function MapboxMap({ children, ...rest }: MapboxMapProps) {
  const {
    userPrefs: { mapTheme },
    updateUserPrefs,
  } = useUserPreferences();

  const handleChange: SelectProps<MapStyle>['onChange'] = (_e, value) => {
    if (value === null) {
      return;
    }

    updateUserPrefs({
      mapTheme: value,
    });
  };

  // This is safe to assert since we use the same config to power the dropdown
  const selectedStyleURI = mapStyles.find((x) => x.label === mapTheme)!.value;

  return (
    <Box display="flex" flexDirection="column" gap={2} height={600}>
      <Box width="50%" display="flex" gap={1} alignItems="center">
        <Typography>Map Style</Typography>
        <Select value={mapTheme} onChange={handleChange}>
          {mapStyles.map(({ label }) => (
            <Option key={label} value={label}>
              {label}
            </Option>
          ))}
        </Select>
      </Box>
      <Box height={500}>
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          attributionControl={false}
          mapStyle={selectedStyleURI}
          reuseMaps
          {...rest}
        >
          <FullscreenControl />
          {children}
        </Map>
      </Box>
    </Box>
  );
}
