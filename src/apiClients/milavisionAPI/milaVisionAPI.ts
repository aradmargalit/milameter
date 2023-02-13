import { Activity } from '@/models/activity';
import { MapBoxClient } from '../mapBoxClient/mapBoxClient';
import { convertStravaActivityResponse } from '../stravaClient/converters';
import { StravaActivityResponse } from '../stravaClient/responseTypes';
import { StravaClient } from '../stravaClient/stravaClient';

export class MilavisionAPI {
  stravaClient: StravaClient;
  mapboxClient: MapBoxClient;

  constructor(stravaAccessToken: string) {
    this.stravaClient = new StravaClient(stravaAccessToken);
    this.mapboxClient = new MapBoxClient();
  }

  /**
   * Converts a strava response into a full-fledged activity with a location
   */
  async buildActivity(
    stravaActivityResponse: StravaActivityResponse
  ): Promise<Activity> {
    const activityWithoutLocation = convertStravaActivityResponse(
      stravaActivityResponse
    );
    const locationName = await this.mapboxClient.getLocationName(
      activityWithoutLocation.startLatLng
    );
    return { ...activityWithoutLocation, locationName };
  }

  /**
   * Returns athlete activities
   * https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities
   *
   * Appends the location name via MapBox
   * https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding
   *
   * @param page_size the number of activities to return
   */
  async getActivities(page_size: number): Promise<Activity[]> {
    const latestActivities = await this.stravaClient.getAthleteActivities(
      page_size
    );

    const localizedActivities = await Promise.all<Activity>(
      latestActivities.map(this.buildActivity)
    );
    return localizedActivities;
  }

  /**
   * Returns a detailed representation of a single activity
   * Appends the location name via MapBox
   * https://docs.mapbox.com/api/search/geocoding/#reverse-geocoding
   *
   * @param id the strava activity ID
   */
  async getActivityById(id: string): Promise<Activity | null> {
    const activity = await this.stravaClient.getActivityById(id);
    if (!activity) {
      return null;
    }
    const locationName = await this.mapboxClient.getLocationName(
      activity.startLatLng
    );
    return { ...activity, locationName };
  }
}
