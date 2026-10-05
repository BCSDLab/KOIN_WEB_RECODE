import { useServerRequest } from 'utils/context/serverRequest';
import { useTokenStore } from 'utils/zustand/auth';

/**
 * 쿠키 기반 토큰. 서버에서는 스토어가 쿠키를 못 읽어 `''`이므로 서버 요청 컨텍스트로 폴백한다.
 *
 * 토큰이 쿼리 키에 들어가는 훅들(`timetableQueries.frameList` 등)은 이 폴백이 없으면
 * SSR과 클라이언트가 서로 다른 캐시를 보게 되고, 서버가 그린 DOM이 통째로 버려진다.
 * 스토어 값이 우선이므로 `??`가 아니라 `||`로 폴백해야 한다(SSR 값이 `''`이라 nullish가 아니다).
 */
const useTokenState = () => {
  const { token } = useTokenStore();
  const serverRequest = useServerRequest();

  return token || serverRequest?.token || '';
};

export default useTokenState;
