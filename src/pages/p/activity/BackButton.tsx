import ArrowBack from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/joy';
import Link from 'next/link';

export function BackButton() {
  return (
    <Link href="/p/strava-activities" passHref>
      <Button startDecorator={<ArrowBack />} variant="outlined">
        Back
      </Button>
    </Link>
  );
}
