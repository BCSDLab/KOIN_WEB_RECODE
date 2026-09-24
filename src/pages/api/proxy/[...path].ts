import type { NextApiRequest, NextApiResponse } from 'next';

import { KOIN_BASE_URL } from 'static/url';

export const config = {
  api: {
    bodyParser: false,
  },
};

const PROXY_PREFIX = '/api/proxy';
const HOP_BY_HOP_RESPONSE_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'transfer-encoding',
]);
const FORWARDED_REQUEST_HEADERS = ['cookie', 'content-type', 'accept', 'x-csrf-token'];
const METHODS_WITH_BODY = new Set(['POST', 'PUT', 'PATCH']);

function rewriteSetCookie(rawCookie: string): string {
  return `${rawCookie.replace(/;\s*Domain=[^;]*/gi, '').replace(/;\s*Path=[^;]*/gi, '')}; Path=/`;
}

function buildUpstreamUrl(req: NextApiRequest): string {
  const suffix = (req.url ?? '').slice(PROXY_PREFIX.length);

  return `${process.env.NEXT_PUBLIC_API_PATH}${suffix}`;
}

function buildUpstreamHeaders(req: NextApiRequest): Headers {
  const headers = new Headers();

  FORWARDED_REQUEST_HEADERS.forEach((name) => {
    const value = req.headers[name];
    if (typeof value === 'string') headers.set(name, value);
  });

  headers.set('Origin', KOIN_BASE_URL);
  headers.set('Referer', KOIN_BASE_URL);

  return headers;
}

export default async function proxy(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    res.status(404).end();

    return;
  }

  const method = req.method ?? 'GET';
  const hasBody = METHODS_WITH_BODY.has(method);

  const fetchOptions: Record<string, unknown> = {
    method,
    headers: buildUpstreamHeaders(req),
  };
  if (hasBody) {
    fetchOptions.body = req;
    fetchOptions.duplex = 'half';
  }

  const upstreamResponse = await fetch(buildUpstreamUrl(req), fetchOptions as RequestInit);

  const setCookieHeaders = upstreamResponse.headers.getSetCookie?.() ?? [];
  if (setCookieHeaders.length > 0) {
    res.setHeader('Set-Cookie', setCookieHeaders.map(rewriteSetCookie));
  }

  upstreamResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie' || HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) return;
    res.setHeader(key, value);
  });

  const body = Buffer.from(await upstreamResponse.arrayBuffer());
  res.status(upstreamResponse.status).send(body);
}
