import { Layer, LayerProps, Source } from 'react-map-gl/mapbox';

import { Separation } from '@/utils/distanceUtils';
import { makeLineFromCoordinates } from '@/utils/mapboxUtils';

type MaxSeparationLineProps = {
  maxSeparation: Separation;
};

export function MaxSeparationLine({ maxSeparation }: MaxSeparationLineProps) {
  const lineLayer: LayerProps = {
    id: 'line-layer',
    paint: {
      'line-color': 'green',
      'line-opacity': 0.75,
      'line-width': 3,
    },
    type: 'line',
  };

  const textLayer: LayerProps = {
    id: 'text-layer',
    layout: {
      'symbol-placement': 'line',
      'text-anchor': 'bottom',
      'text-field': 'Max Sep',
      'text-keep-upright': true,
      'text-letter-spacing': 0.05,
      'text-offset': [0, 0.5],
      'text-size': 14,
    },
    paint: {
      'text-color': '#000',
      'text-halo-color': '#fff',
      'text-halo-width': 1,
    },
    type: 'symbol',
  };

  const geoJSON = makeLineFromCoordinates([
    maxSeparation.stravaCoord,
    maxSeparation.garminCoord,
  ]);

  return (
    <Source id="maxSeparation" type="geojson" data={geoJSON} lineMetrics={true}>
      <Layer {...lineLayer} />
      <Layer {...textLayer} />
    </Source>
  );
}
