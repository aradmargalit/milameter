import StravaLoginButton from '@/components/StravaLoginButton';
import { LogoutOutlined } from '@mui/icons-material';
import { Box, Button } from '@mui/joy';
import { signOut, useSession } from 'next-auth/react';

/**
 * Persistant header across pages for things like logout
 */
export function Header() {
  const { data } = useSession();

  const isLoggedIn = !!data?.user;

  return (
    <Box
      component="header"
      height={4}
      padding={4}
      display="flex"
      flexDirection="row-reverse"
    >
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
