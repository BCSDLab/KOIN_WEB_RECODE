import { useMemo } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import { LostItemArticlesRequest } from 'api/articles/entity';
import { articleQueries } from 'api/articles/queries';
import LostItemList from 'components/Articles/components/LostItemList';
import LostItemPageLayout from 'components/Articles/components/LostItemPageLayout';
import Pagination from 'components/Articles/components/Pagination';
import { LostItemParams, parseLostItemQuery } from 'components/Articles/utils/lostItemQuery';
import { selectLostItemPaginationData } from 'components/Articles/utils/selectArticlesData';
import { SSRLayout } from 'components/layout';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import styles from './LostItemArticleListPage.module.scss';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const queryClient = new QueryClient();
  const { token, query } = parseServerSideParams(context);

  const fallback: LostItemParams = {
    page: 1,
    type: null,
    category: [],
    foundStatus: 'ALL',
    sort: 'LATEST',
    author: 'ALL',
  };

  const params = parseLostItemQuery(query, fallback);

  const apiParams = toLostItemArticlesRequest(params);

  await queryClient.prefetchQuery(articleQueries.lostItemList(token ?? '', apiParams));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialParams: params,
    },
  };
};

function useLostItemParams(initialParams: LostItemParams) {
  const router = useRouter();
  const mounted = useMount();

  return useMemo(() => {
    if (!mounted) return initialParams;
    return parseLostItemQuery(router.query, initialParams);
  }, [mounted, router.query, initialParams]);
}

function toLostItemArticlesRequest(params: LostItemParams): LostItemArticlesRequest {
  const { type, ...rest } = params;

  return {
    ...rest,
    ...(type ? { type } : {}),
  };
}

export default function LostItemArticleListPage({
  initialParams,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const token = useTokenState();

  const params = useLostItemParams(initialParams);
  const apiParams = toLostItemArticlesRequest(params);

  const keywordFromQuery = (Array.isArray(router.query.keyword) ? router.query.keyword[0] : router.query.keyword) ?? '';
  const keyword = String(keywordFromQuery).trim();

  const isSearching = keyword.length > 0;

  const { data: lostItemData } = useQuery({
    ...articleQueries.lostItemList(token, apiParams),
    placeholderData: keepPreviousData,
    select: selectLostItemPaginationData,
  });

  const { data: searchData } = useQuery({
    ...articleQueries.lostItemSearch({
      query: keyword.trim(),
      page: params.page ?? 1,
      limit: 10,
    }),
    enabled: keyword.length > 0,
  });

  const articles = isSearching ? (searchData?.articles ?? []) : (lostItemData?.articles ?? []);
  const totalPageNum = isSearching ? (searchData?.total_page ?? 0) : (lostItemData?.paginationInfo?.total_page ?? 0);

  return (
    <LostItemPageLayout>
      <LostItemList articles={articles} />
      <div className={styles.pagination}>
        <Pagination totalPageNum={totalPageNum} />
      </div>
    </LostItemPageLayout>
  );
}

LostItemArticleListPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
