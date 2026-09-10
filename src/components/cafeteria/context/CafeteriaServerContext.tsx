import { createContext, useContext } from 'react';

interface CafeteriaServerValue {
  serverNow?: Date;
}

// getServerSideProps가 계산한 값을 트리 전체에 흘린다. useServerRequest()와 같은 목적의
// 패턴이다 — 깊이와 무관하게 어떤 컴포넌트든 prop 없이 바로 읽을 수 있어야, 새 소비자가
// 생길 때마다 중간 컴포넌트를 일일이 고치지 않아도 된다.
const CafeteriaServerContext = createContext<CafeteriaServerValue>({});

export const CafeteriaServerProvider = CafeteriaServerContext.Provider;
export const useCafeteriaServerValue = () => useContext(CafeteriaServerContext);
