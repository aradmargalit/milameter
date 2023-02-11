import StravaLoginButtonContainer from '@/components/StravaLoginButton';
import { Button, Sheet, Stack, Typography } from '@mui/joy';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Milavision</title>
        <meta name="description" content="Pup runs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sheet sx={{ margin: 4 }}>
          {session?.user ? (
            <Stack direction="row" spacing={2} alignItems="center" padding={4}>
              <Typography>Welcome, {session.user.name}</Typography>
              <Button variant="soft" color="danger" onClick={() => signOut()}>
                Log Out
              </Button>
            </Stack>
          ) : (
            <StravaLoginButtonContainer />
          )}
        </Sheet>
      </main>
    </>
  );
}
