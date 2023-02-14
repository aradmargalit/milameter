import { Report } from '@mui/icons-material';
import { Alert, Typography } from '@mui/joy';

type ErrorAlertProps = {
  errors: string[];
};

export function ErrorAlert({ errors }: ErrorAlertProps) {
  if (!errors.length) return null;

  return (
    <Alert
      sx={{ alignItems: 'flex-start' }}
      startDecorator={<Report />}
      variant="soft"
      color="danger"
    >
      <div>
        <Typography fontWeight="lg" mt={0.25}>
          Uh-oh. Somebody made an oopsie woopsie!
        </Typography>
        <Typography fontSize="sm" sx={{ opacity: 0.8 }}>
          {errors.join(', ')}
        </Typography>
      </div>
    </Alert>
  );
}
