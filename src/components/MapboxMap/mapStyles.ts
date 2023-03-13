// export const mapStyles = {
//   streets: ['Streets', 'mapbox://styles/mapbox/streets-v12'],
//   outdoors: ['Outdoors', 'mapbox://styles/mapbox/outdoors-v12'],
//   light: ['Light', 'mapbox://styles/mapbox/light-v11'],
//   dark: ['Dark', 'mapbox://styles/mapbox/dark-v11'],
//   satellite: ['Satellite', 'mapbox://styles/mapbox/satellite-v9'],
//   satelliteStreet: [
//     'Satellite Street',
//     'mapbox://styles/mapbox/satellite-streets-v12',
//   ],
//   day: ['Day', 'mapbox://styles/mapbox/navigation-day-v1'],
//   night: ['Night', 'mapbox://styles/mapbox/navigation-night-v1'],
// } as const;

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
// export type MapStyleOption = (typeof mapStyles)[MapStyleKey];
// export type MapStyleName = MapStyleOption[number][0];
// export type MapStyleURL = MapStyleOption[number][1];
