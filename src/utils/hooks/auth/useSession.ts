import { useQuery } from '@tanstack/react-query';
import { authQueries } from 'api/auth/queries';
import { type Session, toSession } from 'utils/auth/session';
import useMount from 'utils/hooks/state/useMount';
import { useServerRequest } from 'utils/ssr/useServerRequest';

interface SessionState {
  session: Session;
  /** 서버 확인이 끝났는가. false인 동안 anonymous는 확정이 아니다. */
  resolved: boolean;
}

// 하이드레이션 렌더는 서버가 그린 값(serverRequest)을 그대로 쓴다.
// 서버는 access만 보고 refresh는 못 하므로 로그인으로 확인된 값만 신선하다. anonymous는 마운트 후 다시 확인한다.
export function useSessionState(): SessionState {
  const serverRequest = useServerRequest();
  const mounted = useMount();

  const { data, dataUpdatedAt } = useQuery({
    ...authQueries.session(),
    enabled: mounted,
    initialData: toSession(serverRequest),
    initialDataUpdatedAt: serverRequest?.isLoggedIn ? Date.parse(serverRequest.now) : 0,
  });

  if (!mounted) return { session: toSession(serverRequest), resolved: false };

  return { session: data, resolved: dataUpdatedAt > 0 };
}

export default function useSession(): Session {
  return useSessionState().session;
}
