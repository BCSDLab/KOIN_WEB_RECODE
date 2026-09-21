import { type NextRequest, NextResponse } from 'next/server';

import ROUTES, { PROTECTED_ROUTES } from 'static/routes';
import { WEB_AUTH_CSRF_COOKIE_KEY } from 'static/url';

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

// access·refresh는 HttpOnly라 미들웨어에서도 값을 신뢰할 근거가 없다(서버가 검증해야 진짜 유효성을
// 안다). CSRF 쿠키는 로그인·리프레시와 같은 시점에 발급되고 로그아웃 시 함께 삭제되므로, 여기서는
// "세션이 있을 가능성"을 보는 낙관적 신호로만 쓴다. 실제 인증 실패는 API 401 응답과 그에 따른
// 클라이언트 redirectToLogin()이 최종적으로 처리한다.
export function middleware(request: NextRequest) {
  const hasSession = Boolean(request.cookies.get(WEB_AUTH_CSRF_COOKIE_KEY)?.value);

  if (isProtectedPath(request.nextUrl.pathname) && !hasSession) {
    const loginUrl = new URL(ROUTES.Auth(), request.url);
    loginUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)'],
};
