import Button from '@mui/joy/Button';

import { LoginOutlined } from '@mui/icons-material';

type StravaLoginButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export function StravaLoginButton({ onClick }: StravaLoginButtonProps) {
  return (
    <Button
      startDecorator={<LoginOutlined />}
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
