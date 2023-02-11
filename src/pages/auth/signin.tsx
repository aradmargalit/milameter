import type { GetServerSidePropsContext } from 'next';
import { signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

export default function SignIn() {
  // We only support one provider, if that changes, update this
  const { id, name } = authOptions.providers[0];
  return (
    <div>
      <button onClick={() => signIn(id)}>Sign in with {name}</button>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: '/' } };
  }

  return {
    props: {},
  };
}
