import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { redirectToLogin } from 'utils/ts/auth';

/**
 * 팀원 모집 화면 공용 인증 가드.
 *
 * 미로그인 상태면 로그인 페이지로 보내고 원래 경로를 복귀 지점으로 저장한다.
 * `isAuthReady`가 false인 동안에는 컴포넌트를 렌더하지 않아야 한다.
 * `useSuspenseInfiniteQuery`는 `enabled` 옵션이 없으므로, 빈 토큰 요청을 막는 방법은 렌더 게이트뿐이다.
 * 게이트(`if (!isAuthReady) return null;`)는 반드시 해당 컴포넌트의 모든 훅 호출 이후에 두어야 한다.
 */
export default function useTeamAuthGuard(): { isAuthReady: boolean } {
  const router = useRouter();
  const token = useTokenState();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !token) {
      redirectToLogin(router.asPath);
    }
  }, [mounted, token, router.asPath]);

  return { isAuthReady: mounted && !!token };
}
