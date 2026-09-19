export type ViewerScope = 'auth' | 'guest';

/**
 * 쿼리 키에 원본 토큰을 그대로 넣지 않기 위한 스코프 값.
 * 토큰이 바뀌어도(로그인/로그아웃/토큰 갱신) 캐시 키 폭발 없이 auth/guest 두 값만 갖는다.
 * 같은 스코프 내에서 사용자가 바뀌는 경우(네이티브 토큰 주입 등)는 QueryClient.clear()로 별도 처리한다.
 */
export const getViewerScope = (token?: string | null): ViewerScope => (token ? 'auth' : 'guest');
