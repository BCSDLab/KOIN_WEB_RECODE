import type { GetServerSidePropsContext } from 'next';
import { isKoinError } from '@bcsdlab/koin';
import { COOKIE_DOMAIN, COOKIE_KEY } from 'static/url';
import { buildCookieString } from 'utils/ts/cookie';

export function isServerAuthError(error: unknown): boolean {
  return isKoinError(error) && error.status === 401;
}

export function clearServerAuthCookies(context: GetServerSidePropsContext) {
  const cookies = [COOKIE_KEY.AUTH_TOKEN, COOKIE_KEY.AUTH_USER_TYPE].flatMap((cookieKey) => [
    buildCookieString(cookieKey, '', { maxAge: 0, sameSite: 'lax', secure: false }),
    buildCookieString(cookieKey, '', { maxAge: 0, sameSite: 'lax', domain: COOKIE_DOMAIN, secure: false }),
  ]);

  const previous = context.res.getHeader('Set-Cookie');
  const previousCookies = Array.isArray(previous) ? previous : previous ? [String(previous)] : [];
  context.res.setHeader('Set-Cookie', [...previousCookies, ...cookies]);
}
