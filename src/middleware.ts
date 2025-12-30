import { NextRequest, NextResponse } from 'next/server';
import { isTokenExpired } from 'utils/ts/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('AUTH_TOKEN_KEY')?.value;

  if (request.nextUrl.searchParams.has('_cleared')) {
    const url = request.nextUrl.clone();
    url.searchParams.delete('_cleared');
    return NextResponse.redirect(url);
  }

  if (token && isTokenExpired(token)) {
    const url = request.nextUrl.clone();
    url.searchParams.set('_cleared', '1');

    const response = NextResponse.redirect(url);
    response.cookies.set('AUTH_TOKEN_KEY', '', {
      expires: new Date(0),
      path: '/',
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
