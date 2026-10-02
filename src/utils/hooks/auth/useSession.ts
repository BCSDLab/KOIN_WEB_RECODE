import { useQuery } from '@tanstack/react-query';
import { authQueries } from 'api/auth/queries';
import { type Session, toSession } from 'utils/auth/session';
import useMount from 'utils/hooks/state/useMount';
import { useServerRequest } from 'utils/ssr/useServerRequest';

interface SessionState {
  session: Session;
  /** 클라이언트에서 서버 확인이 끝났는가(서버가 로그인으로 확인한 초기값 포함). false인 동안 anonymous는 확정이 아니다. */
  resolved: boolean;
}

/**
 * 로그인 세션의 단일 출처.
 *
 * - 하이드레이션 렌더는 서버가 렌더에 쓴 값(`serverRequest`, 없으면 anonymous)을 그대로 쓴다(규칙 10).
 * - 서버가 로그인으로 확인한 값만 신선하다. 서버는 access(15분)만 보고 refresh는 못 하므로 anonymous는 확정이 아니다.
 *   그래서 anonymous 초기값은 곧바로 낡은 것으로 보고, 마운트 후 세션 쿠키가 있으면 서버에 다시 확인한다
 *   (쿠키가 없으면 요청 없이 anonymous). 확인되기 전까지는 서버가 그린 값이 유지된다.
 */
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
