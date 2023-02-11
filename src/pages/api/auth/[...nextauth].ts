import NextAuth, { AuthOptions } from 'next-auth';
import StravaProvider from 'next-auth/providers/strava';

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID || '',
      clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
      authorization: { params: { scope: 'read_all' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token
      // @ts-ignore
      session.accessToken = token.accessToken;

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

export default NextAuth(authOptions);
