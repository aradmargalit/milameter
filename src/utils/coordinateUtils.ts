import { Coordinates } from '@/types';

export function swapLatLong(coordinates: Coordinates): Coordinates {
  const swapped: Coordinates = [];
  // coordinates are swapped 🤪
  for (let i = 0; i < coordinates.length; i++) {
    swapped[i] = [coordinates[i][1], coordinates[i][0]];
  }

  return swapped;
}
