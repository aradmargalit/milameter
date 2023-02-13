import axios from 'axios';
import { StravaActivity } from '../stravaClient/models';
import { Activity } from './models';
import { ReverseGeocodeResponse } from './responseTypes';

const MBC_ACCESS_TOKEN =
  'pk.eyJ1IjoiYXJhZG1hcmdhbGl0IiwiYSI6ImNsZTBkbnk1NDE5eGkzbnIzNGE3Zmx1NnQifQ.qOh6-x2DMYLm9qcp9ck-MA';

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
        access_token: MBC_ACCESS_TOKEN,
        ...config.params,
      };
      return config;
    });
  }

  async addLocationName(activity: StravaActivity): Promise<Activity> {
    const { startLatLng } = activity;
    try {
      const response = await this.axiosInstance.get<ReverseGeocodeResponse>(
        `${startLatLng[1]},${startLatLng[0]}.json`,
        {
          params: {
            // type of location to look up: country, region, postcode, district, place, locality, neighborhood, address, or poi
            types: 'place',
          },
        }
      );

      return { ...activity, locationName: response.data.features[0].text };
    } catch (e) {
      console.error(e);
      return { ...activity, locationName: 'Unknown' };
    }
  }
}
