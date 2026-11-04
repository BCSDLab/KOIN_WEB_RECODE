import { Suspense } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { callvanQueries } from 'api/callvan/queries';
import ParticipantsList from 'components/Callvan/components/ParticipantsList';
import { withCacheControl } from 'utils/ssr/withCacheControl';

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

export default function CallvanParticipantsPage({ postId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Suspense fallback={null}>
      <ParticipantsList postId={postId} />
    </Suspense>
  );
}

CallvanParticipantsPage.getLayout = (page: React.ReactNode) => <>{page}</>;
