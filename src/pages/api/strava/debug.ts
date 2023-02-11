import { StravaClient } from '@/apiClients/stravaClient/stravaClient';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '../auth/[...nextauth]';

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const session = await getServerSession(req, res, authOptions);
  const secret = process.env.AUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!session || !token) {
    res.status(401).json({ message: 'You must be logged in.' });
    return;
  }

  const stravaClient = new StravaClient(token.accessToken as string);
  const athlete = await stravaClient.getAthlete();
  const activities = await stravaClient.getAthleteActivities();

  return res.json({
    message: { session, token, athlete, activities },
  });
}
