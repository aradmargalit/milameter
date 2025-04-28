import mapboxgl from 'mapbox-gl';
import {
  createContext,
  ReactNode,
  RefObject,
  useContext,
  useRef,
  useState,
} from 'react';
import { MapRef } from 'react-map-gl/mapbox';

import { Coordinates } from '@/types';

type MapContextData = {
  mapRef: RefObject<MapRef | null>;
  height: string | number;
};

type MapContextMethods = {
  zoomTo: (coordinates: Coordinates) => void;
  setHeight: (height: string | number) => void;
};

type MapContextValue = MapContextData & MapContextMethods;

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const mapRef = useRef<MapRef | null>(null);
  const [height, setHeight] = useState<string | number>('50vh');

  function zoomTo(coords: Coordinates): void {
    const bounds = new mapboxgl.LngLatBounds(coords[0], coords[1]);
    mapRef.current?.fitBounds(bounds, {
      padding: 80,
    });
  }

  const value: MapContextValue = {
    height,
    mapRef,
    setHeight,
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
