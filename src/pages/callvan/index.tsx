import { useEffect, useMemo, useState } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getCallvanList } from 'api/callvan';
import { CallvanListRequest } from 'api/callvan/entity';
import CallvanList from 'components/Callvan/components/CallvanList';
import CallvanPageLayout from 'components/Callvan/components/CallvanPageLayout';
import useCallvanInfiniteList from 'components/Callvan/hooks/useCallvanInfiniteList';
import { CallvanParams, parseCallvanQuery } from 'components/Callvan/utils/callvanQuery';
import ROUTES from 'static/routes';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import listStyles from 'components/Callvan/components/CallvanList/CallvanList.module.scss';

const DEFAULT_PARAMS: CallvanParams = {
  page: 1,
  sort: 'LATEST_DESC',
  statuses: [],
  departures: [],
  arrivals: [],
  title: '',
  author: 'ALL',
};

function toCallvanApiParams(params: CallvanParams): Omit<CallvanListRequest, 'page' | 'limit'> {
  return {
    sort: params.sort,
    ...(params.statuses.length > 0 ? { statuses: params.statuses } : {}),
    ...(params.departures.length > 0 ? { departures: params.departures } : {}),
    ...(params.arrivals.length > 0 ? { arrivals: params.arrivals } : {}),
    ...(params.title ? { title: params.title } : {}),
    ...(params.author !== 'ALL' ? { author: params.author } : {}),
  };
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token, query } = parseServerSideParams(context);

  const params = parseCallvanQuery(query, DEFAULT_PARAMS);
  const apiParams = toCallvanApiParams(params);

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['callvanInfiniteList', apiParams],
      queryFn: ({ pageParam = 1 }) =>
        getCallvanList(token ?? '', {
          ...apiParams,
          page: pageParam,
          limit: 10,
        }),
      initialPageParam: 1,
    });
  } catch (error) {
    console.error('[SSR] callvan prefetch failed:', error);
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialParams: params,
    },
  };
};

function useCallvanParams(initialParams: CallvanParams): CallvanParams {
  const router = useRouter();
  const mounted = useMount();

  return useMemo(() => {
    if (!mounted) return initialParams;
    return parseCallvanQuery(router.query, DEFAULT_PARAMS);
  }, [mounted, router.query, initialParams]);
}

export default function CallvanPage({ initialParams }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const isMobile = useMediaQuery();
  const mounted = useMount();

  useEffect(() => {
    if (mounted && !isMobile) {
      router.replace(ROUTES.Main());
    }
  }, [mounted, isMobile, router]);

  const params = useCallvanParams(initialParams);

  if (mounted && !isMobile) {
    return null;
  }

  return <CallvanContent key={params.title} params={params} />;
}

interface CallvanContentProps {
  params: CallvanParams;
}

function CallvanContent({ params }: CallvanContentProps) {
  const [searchTitle, setSearchTitle] = useState(params.title);
  const apiParams = toCallvanApiParams(params);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCallvanInfiniteList(apiParams);

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  return (
    <CallvanPageLayout
      statuses={params.statuses}
      departures={params.departures}
      arrivals={params.arrivals}
      sort={params.sort}
      title={searchTitle}
      onTitleChange={setSearchTitle}
    >
      <CallvanList posts={posts} />

      {isFetchingNextPage && (
        <div className={listStyles['loading-indicator']}>
          <span className={listStyles['loading-indicator__text']}>불러오는 중...</span>
        </div>
      )}

      <div ref={scrollTriggerRef} className={listStyles['scroll-trigger']} />
    </CallvanPageLayout>
  );
}

CallvanPage.getLayout = (page: React.ReactNode) => <>{page}</>;
