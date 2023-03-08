import Info from '@mui/icons-material/Info';
import { Button } from '@mui/joy';
import { useRouter } from 'next/router';

export function AboutButton() {
  const router = useRouter();

  return (
    <Button
      variant="soft"
      color="info"
      startDecorator={<Info />}
      onClick={() => router.push('/about')}
    >
      About
    </Button>
  );
}
