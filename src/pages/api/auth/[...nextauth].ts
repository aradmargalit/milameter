import NextAuth, { AuthOptions, TokenSet } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import StravaProvider from 'next-auth/providers/strava';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // https://developers.strava.com/docs/authentication/#refreshingexpiredaccesstokens
    const response = await fetch('https://www.strava.com/api/v3/oauth/token', {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID || '',
        client_secret: process.env.STRAVA_CLIENT_SECRET || '',
        refresh_token: token.refreshToken || '',
        grant_type: 'refresh_token',
      }),
      method: 'POST',
    });

    const tokens: TokenSet = await response.json();

    if (!response.ok) throw tokens;

    return {
      ...token, // Keep the previous token properties
      accessToken: tokens.access_token!,
      expiresAt: tokens.expires_at!,
      // Fall back to old refresh token, but note that
      // many providers may only allow using a refresh token once.
      refreshToken: tokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    // The error property will be used client-side to handle the refresh token error
    return { ...token, error: 'RefreshAccessTokenError' as const };
  }
}

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
        token.accessToken = account.access_token!;
        token.refreshToken = account.refresh_token!;
        token.expiresAt = account.expires_at!; // UNIX epoch
        return token;
      }

      if (Date.now() < token.expiresAt) {
        // If the access token has not expired yet, return it
        return token;
      } else {
        // If the access token has expired, try to refresh it
        return refreshAccessToken(token);
      }
    },
    async session({ session, token }) {
      session.error = token.error;
      return session;
    },
  },

  pages: {
    signIn: '/',
    signOut: '/',
  },
};

export default NextAuth(authOptions);
