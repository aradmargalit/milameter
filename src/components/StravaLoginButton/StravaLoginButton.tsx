import { LoginOutlined } from '@mui/icons-material';
import Button from '@mui/joy/Button';

export type StravaLoginButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  variant?: React.ComponentProps<typeof Button>['variant'];
};

export function StravaLoginButton({
  onClick,
  variant = 'outlined',
}: StravaLoginButtonProps) {
  return (
    <Button
      startDecorator={<LoginOutlined />}
      variant={variant}
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
