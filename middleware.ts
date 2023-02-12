import { withAuth } from 'next-auth/middleware';

export default withAuth(function middleware(_req) {}, {
  pages: {
    // if the user isn't logged in, they can log in here
    signIn: '/',
  },
});

// Only match protected/private (i.e 'p' routes)
export const config = { matcher: ['/p/:path*'] };
