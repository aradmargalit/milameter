import StravaLoginButtonContainer from '@/components/StravaLoginButton';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Milavision</title>
        <meta name="description" content="Pup runs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <StravaLoginButtonContainer />
    </>
  );
}
