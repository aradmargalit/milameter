import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions, TokenSet } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import StravaProvider from 'next-auth/providers/strava';

import prisma from '../../../../prisma/prisma';

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
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
  },
  // Configure one or more authentication providers
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID || '',
      clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
      authorization: { params: { scope: 'activity:read_all' } },
      token: {
        async request({ client, params, checks, provider }) {
          const { token_type, expires_at, refresh_token, access_token } =
            await client.oauthCallback(provider.callbackUrl, params, checks);
          return {
            tokens: { token_type, expires_at, refresh_token, access_token },
          };
        },
      },
    }),
  ],
  callbacks: {
    async session({ user, session }) {
      const token = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!token || !token.access_token) {
        session.error = 'TokenFetchError';
        return session;
      }

      session.accessToken = token.access_token;
      return session;
    },
  },

  pages: {
    signIn: '/',
    signOut: '/',
  },
};

export default NextAuth(authOptions);
