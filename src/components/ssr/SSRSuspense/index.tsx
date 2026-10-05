import { Suspense } from 'react';
import useMount from 'utils/hooks/state/useMount';

// hydration mismatch를 방지하도록 브라우저에서 렌더링
function SSRSuspense({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const isMounted = useMount();

  // ssr일때 fallback 렌더링
  if (!isMounted) {
    return <>{fallback}</>;
  }

  // 브라우저에서 패치 시작
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

export default SSRSuspense;
