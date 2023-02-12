import NextAuth, { AuthOptions } from 'next-auth';
import StravaProvider from 'next-auth/providers/strava';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID || '',
      clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
      authorization: { params: { scope: 'activity:read_all' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

export default NextAuth(authOptions);
