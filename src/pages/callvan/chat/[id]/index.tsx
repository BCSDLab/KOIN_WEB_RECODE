import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import CallvanChatRoom from 'components/Callvan/components/CallvanChatRoom';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';

export default function CallvanChatPage() {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Main());
    }
  }, [mounted, isMobile, router]);

  if (mounted && !isMobile) {
    return null;
  }

  const postId = Number(router.query.id);

  if (!postId) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <CallvanChatRoom postId={postId} />
    </Suspense>
  );
}

CallvanChatPage.getLayout = (page: React.ReactNode) => <>{page}</>;
