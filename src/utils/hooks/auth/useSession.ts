import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { authQueries } from 'api/auth/queries';
import { authenticatedSession, type Session, toSession, type UserType } from 'utils/auth/session';
import { useSessionHintStore } from 'utils/auth/sessionHint';
import useMount from 'utils/hooks/state/useMount';
import type { ServerRequestContext } from 'utils/ssr/requestContext';
import { useServerRequest } from 'utils/ssr/useServerRequest';

interface SessionState {
  session: Session;
  /** 서버(`/user/auth`)가 확인한 값인가. false면 임시 표시다. */
  verified: boolean;
}

interface ResolveInput {
  mounted: boolean;
  serverRequest: ServerRequestContext | null;
  cached: Session;
  cachedAt: number;
  hint: UserType | null;
}

// 어떤 값을 보여줄지의 규칙을 한곳에 모은다.
function resolveSessionState({ mounted, serverRequest, cached, cachedAt, hint }: ResolveInput): SessionState {
  // 하이드레이션 렌더는 서버가 그린 값 그대로(규칙 10).
  if (!mounted) return { session: toSession(serverRequest), verified: !!serverRequest?.isLoggedIn };

  const verified = cachedAt > 0;
  // 확인 전이라도 이 브라우저가 로그인돼 있던 흔적이 있으면 로그인 화면을 유지해 깜빡임을 줄인다.
  if (!verified && hint) return { session: authenticatedSession(hint), verified };

  return { session: cached, verified };
}

/**
 * 로그인 세션의 단일 출처.
 * 초기값은 서버가 렌더에 쓴 값이다. 서버가 로그인으로 확인한 값만 신선하다 — 서버는 access(15분)만 보고
 * refresh는 못 하므로 anonymous는 확정이 아니고, 쿠키나 힌트가 남았다면 마운트 후 클라이언트가 다시 확인한다.
 */
export function useSessionState(): SessionState {
  const serverRequest = useServerRequest();
  const mounted = useMount();
  const hint = useSessionHintStore((state) => state.userType);

  const { data, dataUpdatedAt } = useQuery({
    ...authQueries.session(),
    enabled: mounted,
    initialData: toSession(serverRequest),
    initialDataUpdatedAt: serverRequest?.isLoggedIn ? Date.parse(serverRequest.now) : 0,
  });

  return resolveSessionState({ mounted, serverRequest, cached: data, cachedAt: dataUpdatedAt, hint });
}

export default function useSession(): Session {
  return useSessionState().session;
}

/** 확인된 세션을 힌트 저장소에 반영한다. 앱에서 한 번만 마운트한다. */
export function useSyncSessionHint() {
  const { session, verified } = useSessionState();
  const setHint = useSessionHintStore((state) => state.setUserType);
  const userType = session.status === 'authenticated' ? session.userType : null;

  useEffect(() => {
    if (verified) setHint(userType);
  }, [verified, userType, setHint]);
}
