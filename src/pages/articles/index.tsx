import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, keepPreviousData, QueryClient, useQuery } from '@tanstack/react-query';
import { articleQueries } from 'api/articles/queries';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import ArticleList from 'components/Articles/components/ArticleList';
import ArticlesHeader from 'components/Articles/components/ArticlesHeader';
import MobileArticleSearchButton from 'components/Articles/components/MobileArticleSearchButton';
import MobileArticleTabMenu from 'components/Articles/components/MobileArticleTabMenu';
import Pagination from 'components/Articles/components/Pagination';
import { selectArticlesWithNew } from 'components/Articles/utils/selectArticlesData';
import HomeLayout from 'components/layout/HomeLayout';
import useMount from 'utils/hooks/state/useMount';
import useTokenState from 'utils/hooks/state/useTokenState';
import { parseServerSideParams } from 'utils/ts/parseServerSideParams';
import { withCacheControl } from 'utils/ts/withCacheControl';

const DEFAULT_BOARD_ID = 4;

export const getServerSideProps = withCacheControl(async (context: GetServerSidePropsContext, cacheControl) => {
  const { token, query } = parseServerSideParams(context);
  const pageNumber = typeof query.page === 'string' ? query.page : '1';
  const boardId = typeof query.boardId === 'string' ? Number(query.boardId) : DEFAULT_BOARD_ID;

  const queryClient = new QueryClient();

  const prefetchPromises = [
    queryClient.prefetchQuery(articleQueries.hot()),
    queryClient.prefetchQuery(articleQueries.list(token ?? '', pageNumber, boardId)),
  ];

  await Promise.all(prefetchPromises);

  if (!token) {
    cacheControl.enablePublicCache();
  }

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialPage: pageNumber,
      initialBoardId: boardId,
    },
  };
});

function usePageParams(initialPage: string) {
  const router = useRouter();
  const mounted = useMount();

  if (!mounted) return initialPage;
  const page = router.query.page;
  return typeof page === 'string' ? page : initialPage;
}

function useBoardIdParams(initialBoardId: number) {
  const router = useRouter();
  const mounted = useMount();

  if (!mounted) return initialBoardId;
  const boardId = router.query.boardId;
  return typeof boardId === 'string' ? Number(boardId) : initialBoardId;
}

export default function ArticleListPage({ initialPage, initialBoardId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const token = useTokenState();
  const paramsPage = usePageParams(initialPage);
  const boardId = useBoardIdParams(initialBoardId);

  const { data: articlesData } = useQuery({
    ...articleQueries.list(token, paramsPage, boardId),
    placeholderData: keepPreviousData,
    select: selectArticlesWithNew,
  });

  const articles = articlesData?.articles ?? [];
  const paginationInfo = articlesData?.paginationInfo ?? {
    total_count: 0,
    total_page: 0,
    current_count: 0,
    current_page: 0,
  };

  return (
    <ArticlesPageLayout
      mobileTabMenu={(
        <>
          <MobileArticleTabMenu currentBoardId={boardId} />
          <MobileArticleSearchButton />
        </>
      )}
    >
      <ArticlesHeader />
      <ArticleList articles={articles} />
      <Pagination totalPageNum={paginationInfo.total_page} />
    </ArticlesPageLayout>
  );
}

ArticleListPage.getLayout = (page: React.ReactElement) => <HomeLayout whiteMobileBg>{page}</HomeLayout>;
