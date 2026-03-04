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
import { COOKIE_KEY } from 'static/url';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useMount from 'utils/hooks/state/useMount';
import useInfiniteScroll from 'utils/hooks/ui/useInfiniteScroll';

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
  const token = context.req.cookies[COOKIE_KEY.AUTH_TOKEN] || '';

  const params = parseCallvanQuery(context.query, DEFAULT_PARAMS);
  const apiParams = toCallvanApiParams(params);

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: ['callvanInfiniteList', apiParams],
      queryFn: ({ pageParam = 1 }) =>
        getCallvanList(token, {
          ...apiParams,
          page: pageParam,
          limit: 10,
        }),
      initialPageParam: 1,
    });
  } catch {
    // TODO: 에러 처리 (UI 필요)
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
    return parseCallvanQuery(router.query, initialParams);
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
  const apiParams = toCallvanApiParams(params);

  const [searchTitle, setSearchTitle] = useState(params.title);

  const [prevTitle, setPrevTitle] = useState(params.title);
  if (prevTitle !== params.title) {
    setPrevTitle(params.title);
    setSearchTitle(params.title);
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCallvanInfiniteList(apiParams);

  const posts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

  const scrollTriggerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  if (mounted && !isMobile) {
    return null;
  }

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
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <span style={{ color: '#a1a1a1', fontSize: '14px' }}>불러오는 중...</span>
        </div>
      )}

      <div ref={scrollTriggerRef} style={{ height: '1px' }} />
    </CallvanPageLayout>
  );
}

CallvanPage.getLayout = (page: React.ReactNode) => <>{page}</>;
