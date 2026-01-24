import { useMemo } from 'react';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getLostItemArticles } from 'api/articles';
import {
  LostItemArticlesRequest,
  LostItemCategory,
  LostItemFoundStatus,
  LostItemSort,
  LostItemType,
} from 'api/articles/entity';
import ArticlesPageLayout from 'components/Articles/ArticlesPage';
import LostItemList from 'components/Articles/components/LostItemList';
import LostItemsHeader from 'components/Articles/components/LostItemsHeader';
import Pagination from 'components/Articles/components/Pagination';
import useLostItemPagination from 'components/Articles/hooks/useLostItemPagination';
import { SSRLayout } from 'components/layout';
import useMount from 'utils/hooks/state/useMount';

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const {
    page = '1',
    type = 'LOST',
    category = 'ALL',
    foundStatus = 'ALL',
    sort = 'LATEST',
    author = 'ALL',
  } = context.query;

  const queryClient = new QueryClient();
  const token = context.req.cookies['AUTH_TOKEN_KEY'] || '';

  const params: LostItemArticlesRequest = {
    page: Number(page),
    type: type as LostItemType,
    category: category as LostItemCategory,
    foundStatus: foundStatus as LostItemFoundStatus,
    sort: sort as LostItemSort,
    author: author as 'ALL' | 'MY',
  };

  await queryClient.prefetchQuery({
    queryKey: ['lostItemPagination', params],
    queryFn: () => getLostItemArticles(token, params),
  });

  console.log('SSR cookies keys:', Object.keys(context.req.cookies || {}));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialParams: params,
    },
  };
};

function useLostItemParams(initialParams: LostItemArticlesRequest) {
  const router = useRouter();
  const mounted = useMount();

  return useMemo(() => {
    if (!mounted) return initialParams;

    const { page, type, category, foundStatus, sort, author } = router.query;

    return {
      page: Number(page) || initialParams.page,
      type: (type as LostItemType) || initialParams.type,
      category: (category as LostItemCategory) || initialParams.category,
      foundStatus: (foundStatus as LostItemFoundStatus) || initialParams.foundStatus,
      sort: (sort as LostItemSort) || initialParams.sort,
      author: (author as 'ALL' | 'MY') || initialParams.author || 'ALL',
    };
  }, [mounted, router.query, initialParams]);
}

export default function LostItemArticleListPage({
  initialParams,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const params = useLostItemParams(initialParams);

  const { data: lostItemData } = useLostItemPagination(params);

  const articles = lostItemData?.articles ?? [];
  const paginationInfo = lostItemData?.paginationInfo;

  return (
    <ArticlesPageLayout>
      <LostItemsHeader />
      <LostItemList articles={articles} />
      <Pagination totalPageNum={paginationInfo?.total_page ?? 0} />
    </ArticlesPageLayout>
  );
}

LostItemArticleListPage.getLayout = (page: React.ReactElement) => <SSRLayout>{page}</SSRLayout>;
