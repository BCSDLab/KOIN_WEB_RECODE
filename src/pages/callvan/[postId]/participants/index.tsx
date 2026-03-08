import { Suspense, useEffect } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getCallvanPostDetail } from 'api/callvan';
import ParticipantsList from 'components/Callvan/components/ParticipantsList';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token } = parseServerSideParams(context);
  const postId = Number(context.params?.postId);

  if (!postId || Number.isNaN(postId)) {
    return { notFound: true };
  }

  try {
    if (token) {
      await queryClient.prefetchQuery({
        queryKey: ['callvanPostDetail', postId],
        queryFn: () => getCallvanPostDetail(token, postId),
      });
    }
  } catch (error) {
    console.error('[SSR] callvan post detail prefetch failed:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      postId,
      token: token ?? '',
    },
  };
};

export default function CallvanParticipantsPage({
  postId,
  token,
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
      <ParticipantsList postId={postId} token={token} />
    </Suspense>
  );
}

CallvanParticipantsPage.getLayout = (page: React.ReactNode) => <>{page}</>;
