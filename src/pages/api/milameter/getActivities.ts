import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

import { MilaMeterAPI } from '@/apiClients/milaMeterAPI/milaMeterAPI';
import { parseQueryParamToInt } from '@/utils/queryParsing';

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
    return res.status(401).json({ message: 'You must be logged in.' });
  }

  if (!req.query.pageSize || !req.query.pageNumber) {
    return res.status(400).json({ message: 'Provide pageSize and pageNumber' });
  }

  let pageSize: number;
  let pageNumber: number;

  try {
    pageSize = parseQueryParamToInt(req.query.pageSize);
    pageNumber = parseQueryParamToInt(req.query.pageNumber);
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'Failed to parse pageSize and pageNumber' });
  }

  const milaMeterAPI = new MilaMeterAPI(token.accessToken);
  const activities = await milaMeterAPI.getActivities(pageSize, pageNumber);

  return res.json({
    message: { activities },
  });
}
