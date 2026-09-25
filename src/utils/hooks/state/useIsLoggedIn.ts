import { useServerRequest } from 'utils/ssr/useServerRequest';
import { useTokenStore } from 'utils/zustand/auth';

import useMount from './useMount';

// access·refresh는 HttpOnly라 클라이언트가 못 읽는다 — userType null 여부가 유일한 로그인 신호다.
// 마운트 전에는 서버가 GET /user/auth로 확인한 serverRequest.isLoggedIn으로 폴백한다.
const useIsLoggedIn = () => {
  const userType = useTokenStore((state) => state.userType);
  const serverRequest = useServerRequest();
  const mounted = useMount();

  return mounted ? userType !== null : (serverRequest?.isLoggedIn ?? false);
};

export default useIsLoggedIn;
