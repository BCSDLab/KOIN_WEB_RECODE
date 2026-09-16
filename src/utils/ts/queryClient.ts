import { QueryClient } from '@tanstack/react-query';

/**
 * 앱 전역 QueryClient 싱글턴.
 * _app.tsx의 QueryClientProvider와 공유하며, React 컨텍스트가 없는 모듈(apiClient, iosBridge)에서
 * 인증 주체 전환 시 queryClient.clear()를 호출하기 위해 별도 파일로 분리했다.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: false,
      enabled: typeof window !== 'undefined',
      staleTime: 60 * 1000, // 1 minutes
    },
  },
});
