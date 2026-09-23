import { Suspense, useEffect } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { callvanQueries } from 'api/callvan/queries';
import ParticipantsList from 'components/Callvan/components/ParticipantsList';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import { withCacheControl } from 'utils/ts/withCacheControl';

export const getServerSideProps = withCacheControl<{
  dehydratedState: ReturnType<typeof dehydrate>;
  postId: number;
}>(async (context: GetServerSidePropsContext, _cacheControl, serverRequest) => {
  const queryClient = new QueryClient();
  const { isLoggedIn } = serverRequest;
  const postId = Number(context.params?.postId);

  if (!postId || Number.isNaN(postId)) {
    return { notFound: true };
  }

  try {
    if (isLoggedIn) {
      await queryClient.prefetchQuery(callvanQueries.postDetail(postId, isLoggedIn));
    }
  } catch (error) {
    console.error('[SSR] callvan post detail prefetch failed:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      postId,
    },
  };
});

export default function CallvanParticipantsPage({
  postId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

  return (
    <Suspense fallback={null}>
      <ParticipantsList postId={postId} />
    </Suspense>
  );
}

CallvanParticipantsPage.getLayout = (page: React.ReactNode) => <>{page}</>;
