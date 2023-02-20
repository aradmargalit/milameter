import StravaLoginButton from '@/components/StravaLoginButton';
import { LogoutOutlined } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/joy';
import { signOut, useSession } from 'next-auth/react';

/**
 * Persistent header across pages for things like logout
 */
export function Header() {
  const { data } = useSession();

  const isLoggedIn = !!data?.user;
  const colorOne = 'hsl(15 90% 55%)';

  return (
    <Box
      component="header"
      height={4}
      padding={4}
      display="flex"
      justifyContent="space-between"
    >
      <Box display="flex">
        <Typography
          level="h2"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 2,
            color: colorOne,
          }}
        >
          Mila
        </Typography>
        <Typography
          level="h2"
          sx={{
            fontWeight: 'bold',
            letterSpacing: 2,
            color: 'var(--joy-palette-text-primary)',
          }}
        >
          vision
        </Typography>
      </Box>
      {isLoggedIn ? (
        <Button
          startDecorator={<LogoutOutlined />}
          variant="soft"
          onClick={() => signOut()}
          color="danger"
        >
          Log Out
        </Button>
      ) : (
        <StravaLoginButton />
      )}
    </Box>
  );
}
