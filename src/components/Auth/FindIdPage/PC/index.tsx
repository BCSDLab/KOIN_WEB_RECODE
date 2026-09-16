import { useEffect } from 'react';
import { useRouter } from 'next/router';

import ROUTES from 'static/routes';

function PCFindIdLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/auth/findid') {
      router.replace(ROUTES.Phone());
    }
  }, [router]);

  return { children };
}

export default PCFindIdLayout;
