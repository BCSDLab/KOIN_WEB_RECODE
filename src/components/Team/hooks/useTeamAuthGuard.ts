import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { redirectToLogin } from 'utils/ts/auth';

export default function useTeamAuthGuard(): { isAuthReady: boolean } {
  const router = useRouter();
  const token = useTokenState();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !token) {
      redirectToLogin(router.asPath);
    }
  }, [mounted, token, router.asPath]);

  return { isAuthReady: mounted && !!token };
}
