import { useMemo } from 'react';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { articles as articlesApi } from 'api/index';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import ArticleList from 'components/Articles/components/ArticleList';
import ArticlesHeader from 'components/Articles/components/ArticlesHeader';
import Pagination from 'components/Articles/components/Pagination';
import useArticles from 'components/Articles/hooks/useArticles';
import { SSRLayout } from 'components/layout';
import useMount from 'utils/hooks/state/useMount';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { token, query } = parseServerSideParams(context);
  const pageNumber = typeof query.page === 'string' ? query.page : '1';

  const queryClient = new QueryClient();

  const prefetchPromises = [
    queryClient.prefetchQuery({
      queryKey: ['hotArticles'],
      queryFn: articlesApi.getHotArticles,
    }),
  ];

  if (token) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ['articles', pageNumber],
        queryFn: () => articlesApi.getArticles(token, pageNumber),
      }),
    );
  }

  await Promise.all(prefetchPromises);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialPage: pageNumber,
    },
  };
};

function usePageParams(initialPage: string) {
  const router = useRouter();
  const mounted = useMount();

  return useMemo(() => {
    if (!mounted) return initialPage; // SSR 초기값
    const page = router.query.page;
    return typeof page === 'string' ? page : initialPage;
  }, [mounted, router.query.page, initialPage]);
}

export default function ArticleListPage({ initialPage }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const paramsPage = usePageParams(initialPage);
  const articlesData = useArticles(paramsPage);

  const articles = articlesData?.articles ?? [];
  const paginationInfo = articlesData?.paginationInfo ?? {
    total_count: 0,
    total_page: 0,
    current_count: 0,
    current_page: 0,
  };

  return (
    <ArticlesPageLayout>
      <ArticlesHeader />
      <ArticleList articles={articles} />
      <Pagination totalPageNum={articles === null ? 5 : paginationInfo.total_count} />
    </ArticlesPageLayout>
  );
}

ArticleListPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
