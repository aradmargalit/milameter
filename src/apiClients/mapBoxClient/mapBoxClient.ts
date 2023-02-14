import { MAPBOX_ACCESS_TOKEN } from '@/config';
import axios from 'axios';
import { ReverseGeocodeResponse } from './responseTypes';

type AxiosInstance = ReturnType<typeof axios.create>;

export class MapBoxClient {
  axiosInstance: AxiosInstance;

  constructor() {
    // Set config defaults when creating the instance
    this.axiosInstance = axios.create({
      baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
    });

    // always attach the access token
    this.axiosInstance.interceptors.request.use((config) => {
      config.params = {
        access_token: MAPBOX_ACCESS_TOKEN,
        ...config.params,
      };
      return config;
    });
  }

  /**
   * Uses reverse geocoding to map from coordinates to the nearest 'place' (i.e. city)
   * https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding
   *
   * @param latLng the coordinates to look up
   */
  async getLocationName(latLng: [number, number]): Promise<string> {
    try {
      const response = await this.axiosInstance.get<ReverseGeocodeResponse>(
        `${latLng[1]},${latLng[0]}.json`,
        {
          params: {
            // type of location to look up: country, region, postcode, district, place, locality, neighborhood, address, or poi
            types: 'place',
          },
        }
      );

      return response.data.features[0]?.text ?? 'Unknown';
    } catch (e) {
      console.error(e);
      return 'Unknown';
    }
  }
}
