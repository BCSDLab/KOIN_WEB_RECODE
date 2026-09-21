export type ViewerScope = 'auth' | 'guest';

/**
 * 쿼리 키에 원본 토큰을 그대로 넣지 않기 위한 스코프 값. auth/guest 두 값만 가져
 * 로그인·로그아웃이 반복돼도 캐시 키가 계속 늘어나지 않는다.
 *
 * httpOnly 쿠키 인증 전환 이후 raw 토큰은 더 이상 존재하지 않는다 — 로그인 여부를 직접
 * 아는 도메인(예: `useIsLoggedIn()`)은 boolean을 넘기고, 아직 레거시 `useTokenState()`를
 * 쓰는 도메인은 항상 `''`인 문자열을 넘겨 잠정적으로 `'guest'`로 고정된다(도메인별 정리 대상).
 */
export const getViewerScope = (viewer?: string | boolean | null): ViewerScope => (viewer ? 'auth' : 'guest');
