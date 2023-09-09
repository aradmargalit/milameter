type ViewOnStravaProps = { activityId: number };

const STRAVA_BRAND_COLOR = '#FC4C02';

export function ViewOnStrava({ activityId }: ViewOnStravaProps) {
  return (
    <a
      style={{
        color: STRAVA_BRAND_COLOR,
        textDecoration: 'underline',
      }}
      target="_blank"
      rel="noopener noreferrer"
      href={`https://strava.com/activities/${activityId}`}
    >
      View on Strava
    </a>
  );
}
