import axios from 'axios';
import { convertStravaActivityResponse } from './converters';
import { StravaActivity } from './models';
import { StravaActivityResponse, AthleteResponse } from './responseTypes';

type AxiosInstance = ReturnType<typeof axios.create>;

export class StravaClient {
  axiosInstance: AxiosInstance;

  constructor(accessToken: string) {
    // Set config defaults when creating the instance
    this.axiosInstance = axios.create({
      baseURL: 'https://www.strava.com/api/v3/',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  /**
   * Gets the logged-in athlete
   * https://developers.strava.com/docs/reference/#api-Athletes
   */
  async getAthlete() {
    const response = await this.axiosInstance.get<AthleteResponse>('/athlete');
    return response.data;
  }

  /**
   * Returns athlete activities
   * https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities
   */
  async getAthleteActivities(per_page = 5): Promise<StravaActivityResponse[]> {
    try {
      const response = await this.axiosInstance.get<StravaActivityResponse[]>(
        '/athlete/activities',
        {
          params: {
            // before: '1', // An epoch timestamp to use for filtering activities that have taken place before a certain time.
            // after: '2', // An epoch timestamp to use for filtering activities that have taken place after a certain time.
            per_page, // Number of items per page. Defaults to 30.
          },
        }
      );

      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  /**
   * Returns a detailed representation of a single activity
   * @param id the strava activity ID
   */
  async getActivityById(id: string): Promise<StravaActivity | null> {
    try {
      const response = await this.axiosInstance.get<StravaActivityResponse>(
        `/activities/${id}`
      );
      return convertStravaActivityResponse(response.data);
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
