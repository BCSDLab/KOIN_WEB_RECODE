import { useServerRequest } from 'utils/context/serverRequest';
import { useTokenStore } from 'utils/zustand/auth';

import useMount from './useMount';

/**
 * access·refresh는 HttpOnly라 클라이언트가 값을 직접 읽을 수 없다(web-cookie-auth.md).
 * `userType`은 로그인 성공 시 `setUserType()`으로 채워지고 로그아웃·리프레시 실패 시
 * null로 돌아가므로, 이 값의 null 여부가 "로그인했는가"를 판단할 수 있는 유일한 클라이언트
 * 신호다.
 *
 * 마운트 전(SSR·최초 페인트)에는 서버가 `GET /user/auth`로 직접 확인한 값을 쓴다. 이게
 * 없으면 서버는 항상 비로그인으로 렌더하고 클라이언트가 마운트 후 로그인 UI로 통째로
 * 갈아치운다.
 */
const useIsLoggedIn = () => {
  const userType = useTokenStore((state) => state.userType);
  const serverRequest = useServerRequest();
  const mounted = useMount();

  return mounted ? userType !== null : (serverRequest?.isLoggedIn ?? false);
};

export default useIsLoggedIn;
