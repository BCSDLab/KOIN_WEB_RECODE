import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_DOMAIN, COOKIE_KEY } from 'static/url';
import { isTokenExpired } from 'utils/ts/auth';

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_KEY.AUTH_TOKEN)?.value;

  if (token && isTokenExpired(token)) {
    // 만료된 토큰을 SSR 요청에서도 제거해 getServerSideProps의 500 오류를 방지
    const requestHeaders = new Headers(request.headers);
    const remainingCookies = request.cookies
      .getAll()
      .filter((cookie) => cookie.name !== COOKIE_KEY.AUTH_TOKEN)
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
