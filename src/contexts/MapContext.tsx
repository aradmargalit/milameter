import mapboxgl from 'mapbox-gl';
import { createContext, ReactNode, RefObject, useContext, useRef } from 'react';
import { MapRef } from 'react-map-gl/mapbox';

import { Coordinates } from '@/types';

type MapContextData = {
  mapRef: RefObject<MapRef | null>;
};

type MapContextMethods = {
  zoomTo: (coordinates: Coordinates) => void;
};

type MapContextValue = MapContextData & MapContextMethods;

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<MapRef | null>(null);

  function zoomTo(coords: Coordinates): void {
    const bounds = new mapboxgl.LngLatBounds(coords[0], coords[1]);
    mapRef.current?.fitBounds(bounds, {
      padding: 80,
    });
  }

  const value: MapContextValue = {
    mapRef,
    zoomTo,
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export function useMap() {
  const context = useContext(MapContext);

  if (!context) {
    throw Error(
      'Cannot use "useMap" without wrapping this component in a MapProvider'
    );
  }

  return context;
}
