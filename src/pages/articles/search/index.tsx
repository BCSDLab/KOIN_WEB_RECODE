import { useEffect } from 'react';
import { useRouter } from 'next/router';
import ArticlesSearchPage from 'components/Articles/components/ArticlesSearchPage';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';

export default function ArticlesSearchRoutePage() {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Articles());
    }
  }, [mounted, isMobile, router]);

  if (mounted && !isMobile) {
    return null;
  }

  return <ArticlesSearchPage />;
}

ArticlesSearchRoutePage.getLayout = (page: React.ReactNode) => <>{page}</>;
