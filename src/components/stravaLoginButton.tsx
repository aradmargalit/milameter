import Button from '@mui/joy/Button';
import { ReactNode } from 'react';
import Face5 from '@mui/icons-material/Face5';
import { borderColor } from '@mui/system';

type StravaLoginButtonProps = {
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function StravaLoginButton({
  children,
  onClick,
}: StravaLoginButtonProps) {
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
      {children}
    </Button>
  );
}
