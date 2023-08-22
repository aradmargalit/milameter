import LoginOutlined from '@mui/icons-material/LoginOutlined';
import { Button } from '@mui/joy';

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
        ':hover': {
          backgroundColor: 'var(--joy-palette-danger-200)',
        },
        borderColor: 'var(--strava-orange)',
        color: 'var(--strava-orange)',
      }}
    >
      Login with Strava
    </Button>
  );
}
