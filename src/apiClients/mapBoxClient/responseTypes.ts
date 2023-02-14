type GeocodeContext = {
  id: string;
  short_code: string;
  wikidata: string;
  text: string;
};
type FeatureResponseProperties = {
  accuracy?: string;
  address?: string;
  category?: string;
  maki?: string;
  wikidata?: string;
  short_code?: string;
  landmark: boolean;
  tel: string;
};

type GeocodeGeometry = {
  type: string;
  coordinates: [number, number];
  interpolated?: boolean;
  omitted?: boolean;
};
type Point = {
  coordinates: [number, number];
};

type FeatureResponse = {
  id: string;
  type: string;
  place_type: string;
  relevance: number;
  address?: string;
  properties: FeatureResponseProperties;
  text: string;
  place_name: string;
  matching_text?: string;
  matching_place_name?: string;
  language?: string;
  bbox: [number, number, number, number];
  center: [number, number];
  geometry: GeocodeGeometry;
  context: GeocodeContext[];
  routable_points?: {
    points: Point[] | null;
  };
};

// https://docs.mapbox.com/api/search/geocoding/#geocoding-response-object
export type ReverseGeocodeResponse = {
  type: string;
  query: [number, number];
  attribution: string;
  features: FeatureResponse[];
};
