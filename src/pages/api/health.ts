import type { NextApiRequest, NextApiResponse } from 'next';

const NO_STORE = 'no-store, no-cache, must-revalidate';

type HealthResponse = {
  status: 'ok';
  service: 'koin-web';
  environment: string;
  release: string;
};

export default function health(req: NextApiRequest, res: NextApiResponse<HealthResponse | { error: string }>) {
  res.setHeader('Cache-Control', NO_STORE);

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  res.status(200).json({
    status: 'ok',
    service: 'koin-web',
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'unknown',
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE ?? 'unknown',
  });
}
