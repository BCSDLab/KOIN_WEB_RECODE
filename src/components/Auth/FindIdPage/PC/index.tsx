import { useRouter } from 'next/router';
import { useEffect } from 'react';

function PCFindIdLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/auth/findid') {
      router.replace('/auth/findid/phone');
    }
  }, [router]);

  return { children };
}

export default PCFindIdLayout;
