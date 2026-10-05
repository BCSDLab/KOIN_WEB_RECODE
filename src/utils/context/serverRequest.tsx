import { createContext, useContext } from 'react';
import type { ServerRequestContext } from 'utils/ts/serverRequestContext';

/**
 * 서버가 렌더에 사용한 요청 정보. `withCacheControl`이 props에 넣고 `_app`이 여기에 흘린다.
 *
 * `null`이면 해당 페이지에 getServerSideProps가 없다는 뜻이다(정적 최적화). 이때는
 * 서버가 요청을 모르므로 각 훅이 기존 기본값으로 동작한다.
 */
const ServerRequestContextValue = createContext<ServerRequestContext | null>(null);

export const ServerRequestProvider = ServerRequestContextValue.Provider;

export const useServerRequest = () => useContext(ServerRequestContextValue);
