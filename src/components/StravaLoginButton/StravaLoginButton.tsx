import Button from '@mui/joy/Button';

import Face5 from '@mui/icons-material/Face5';

type StravaLoginButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function StravaLoginButton({ onClick }: StravaLoginButtonProps) {
  return (
    <Button
      startDecorator={<Face5 />}
      variant="outlined"
      onClick={onClick}
      sx={{
        color: 'var(--strava-orange)',
        borderColor: 'var(--strava-orange)',
      }}
    >
      Login with Strava
    </Button>
  );
}
