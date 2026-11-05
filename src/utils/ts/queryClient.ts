import { QueryClient } from '@tanstack/react-query';

/**
 * 앱 전역 QueryClient 싱글턴.
 * _app.tsx의 QueryClientProvider와 공유하며, React 컨텍스트가 없는 모듈(sessionControl)이
 * 세션 캐시를 갱신하고 로그아웃 시 queryClient.clear()를 호출할 수 있게 별도 파일에 둔다.
 */
export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
        retry: false,
        enabled: typeof window !== 'undefined',
        staleTime: 60 * 1000,
      },
    },
  });

export const queryClient = createQueryClient();
