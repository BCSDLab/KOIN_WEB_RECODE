import type { NextApiRequest, NextApiResponse } from 'next';

const NO_STORE = 'no-store, no-cache, must-revalidate';

type HealthResponse = {
  status: 'ok';
  service: 'koin-web';
  environment: string;
  release: string;
};

type HealthErrorResponse = {
  status: 'error';
  error: string;
  environment: string;
  release: string;
};

export default function health(req: NextApiRequest, res: NextApiResponse<HealthResponse | HealthErrorResponse | { error: string }>) {
  res.setHeader('Cache-Control', NO_STORE);

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const environment = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? 'unknown';
  const release = process.env.NEXT_PUBLIC_SENTRY_RELEASE ?? 'unknown';
  const expectedEnvironment = Array.isArray(req.query.environment)
    ? req.query.environment[0]
    : req.query.environment;

  // Sentry Uptime은 response body assertion을 지원하지 않는다. Monitor URL에
  // ?environment=production|stage를 지정하면 잘못 배포된 환경을 HTTP 실패로 바꿀 수 있다.
  if (expectedEnvironment && expectedEnvironment !== environment) {
    res.status(503).json({
      status: 'error',
      error: 'Environment mismatch',
      environment,
      release,
    });
    return;
  }

  res.status(200).json({
    status: 'ok',
    service: 'koin-web',
    environment,
    release,
  });
}
