import { NextRequest, NextResponse } from 'next/server';
import ROUTES, { PROTECTED_ROUTES } from 'static/routes';
import { COOKIE_DOMAIN, COOKIE_KEY } from 'static/url';
import { isTokenExpired } from 'utils/ts/auth';

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ROUTES 함수에 postId 같은 동적 세그먼트가 있어도, 모든 파라미터를 이 토큰으로 채워 호출하면
// 실제 경로 형태(prefix/suffix)를 그대로 얻을 수 있다. 쿼리스트링(?step=...)은 pathname에 없으므로 제거한다.
const PARAM_TOKEN = '__PARAM__';
const paramProxy = new Proxy({}, { get: () => PARAM_TOKEN });

function toPathPattern(routeFn: (params: Record<string, string | undefined>) => string): RegExp {
  const template = routeFn(paramProxy).split('?')[0];
  const escaped = escapeRegExp(template).replaceAll(PARAM_TOKEN, '[^/]+');
  return new RegExp(`^${escaped}$`);
}

// PROTECTED_ROUTES(static/routes.ts)에 라우트를 추가/삭제하기만 하면 이 목록도 함께 바뀐다.
const PROTECTED_PATH_PATTERNS = PROTECTED_ROUTES.map(toPathPattern);

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEY.AUTH_TOKEN)?.value;
  const isExpired = !!token && isTokenExpired(token);

  if (isProtectedPath(request.nextUrl.pathname) && (!token || isExpired)) {
    const loginUrl = new URL(ROUTES.Auth(), request.url);
    loginUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isExpired) {
    // 만료된 토큰을 SSR 요청에서도 제거해 getServerSideProps의 500 오류를 방지
    const requestHeaders = new Headers(request.headers);
    const remainingCookies = request.cookies
      .getAll()
      .filter((cookie) => cookie.name !== COOKIE_KEY.AUTH_TOKEN && cookie.name !== COOKIE_KEY.AUTH_USER_TYPE)
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');

    if (remainingCookies) {
      requestHeaders.set('cookie', remainingCookies);
    } else {
      requestHeaders.delete('cookie');
    }

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    const hostname = request.nextUrl.hostname;
    const baseOptions = `Path=/; Max-Age=0; Expires=${new Date(0).toUTCString()}; SameSite=Lax`;

    // host-only 쿠키와 domain 쿠키를 모두 삭제 (host-only 쿠키가 남아있는 사용자가 있을 수 있어 임시로 둔 후 추후 제거하도록 하겠습니다.)
    const cookieStrings = [COOKIE_KEY.AUTH_TOKEN, COOKIE_KEY.AUTH_USER_TYPE].flatMap((name) => {
      const hostOnly = `${name}=; ${baseOptions}`;
      if (isLocalhost(hostname)) return [hostOnly];
      return [hostOnly, `${name}=; Domain=${COOKIE_DOMAIN}; ${baseOptions}`];
    });

    const [first, ...rest] = cookieStrings;
    response.headers.set('Set-Cookie', first);
    rest.forEach((cookie) => response.headers.append('Set-Cookie', cookie));

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
