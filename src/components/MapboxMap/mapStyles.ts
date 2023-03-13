export const mapStyles = [
  { label: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
  { label: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12' },
  { label: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
  { label: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
  { label: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
  {
    label: 'Satellite Street',
    value: 'mapbox://styles/mapbox/satellite-streets-v12',
  },
  { label: 'Day', value: 'mapbox://styles/mapbox/navigation-day-v1' },
  { label: 'Night', value: 'mapbox://styles/mapbox/navigation-night-v1' },
] as const;

export type MapStyle = (typeof mapStyles)[number]['label'];
