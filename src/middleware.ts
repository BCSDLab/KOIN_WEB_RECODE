import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_DOMAIN } from 'static/url';
import { isTokenExpired } from 'utils/ts/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('AUTH_TOKEN_KEY')?.value;

  if (token && isTokenExpired(token)) {
    const response = NextResponse.redirect(request.nextUrl.clone());
    response.cookies.set('AUTH_TOKEN_KEY', '', {
      expires: new Date(0),
      path: '/',
      domain: COOKIE_DOMAIN,
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
