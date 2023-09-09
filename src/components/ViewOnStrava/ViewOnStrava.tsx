type ViewOnStravaProps = { activityId: number };

const STRAVA_BRAND_COLOR = '#FC4C02';

export function ViewOnStrava({ activityId }: ViewOnStravaProps) {
  return (
    <a
      style={{
        color: STRAVA_BRAND_COLOR,
        textDecoration: 'underline',
      }}
      href={`https://strava.com/activity/${activityId}`}
    >
      View on Strava
    </a>
  );
}
