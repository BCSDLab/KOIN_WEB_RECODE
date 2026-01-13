import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_DOMAIN } from 'static/url';
import { isTokenExpired } from 'utils/ts/auth';

function isLocalhost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('AUTH_TOKEN_KEY')?.value;

  if (token && isTokenExpired(token)) {
    const response = NextResponse.next();

    const hostname = request.nextUrl.hostname;

    const options: Parameters<typeof response.cookies.set>[2] = {
      expires: new Date(0),
      path: '/',
    };

    if (!isLocalhost(hostname)) {
      options.domain = COOKIE_DOMAIN;
    }

    response.cookies.set('AUTH_TOKEN_KEY', '', options);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
