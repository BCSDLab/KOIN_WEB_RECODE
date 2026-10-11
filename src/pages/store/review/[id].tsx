import type { ReactElement, ReactNode } from 'react';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { storeMobileQueries } from 'api/storeMobile/queries';
import Layout, { SSRLayout } from 'components/layout';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import ReviewCreatePage from 'components/Store/mobile/ReviewFormPage';
import useStoreDetail from 'components/Store/StoreDetailPage/hooks/useStoreDetail';
import { useAddStoreReview } from 'components/Store/StoreReviewPage/hooks/useAddStoreReview';
import ReviewForm from 'components/Store/StoreReviewPage/ReviewForm/ReviewForm';
import useMount from 'utils/hooks/state/useMount';
import { withCacheControl } from 'utils/ssr/withCacheControl';
import { isNotFoundKoinError } from 'utils/ts/isr';

interface Props {
  id: string;
  isMobile: boolean;
}

// 로그인 필수 화면이라 공용 캐시를 켜지 않는다(withCacheControl 기본값 private)
export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ id: string }>, _cacheControl, serverRequest) => {
    const id = context.params?.id;
    if (!id) return { notFound: true as const };

    // 데스크톱은 기존처럼 클라이언트에서 그린다
    if (serverRequest?.device !== 'mobile') {
      return { props: { id, isMobile: false } };
    }

    // 모바일은 상점명을 서버에서 받아 본문까지 렌더한다(클라이언트는 같은 쿼리 키로 캐시를 이어받는다)
    const queryClient = new QueryClient();
    try {
      await queryClient.fetchQuery(storeMobileQueries.detail(id));
    } catch (error) {
      if (isNotFoundKoinError(error)) return { notFound: true as const };
      throw error;
    }

    return { props: { id, isMobile: true, dehydratedState: dehydrate(queryClient) } };
  },
);

function AddReviewComponent({ id }: { id: string }) {
  const { storeDetail } = useStoreDetail(id);
  const { mutate } = useAddStoreReview(String(storeDetail.id));

  return <ReviewForm storeDetail={storeDetail} mutate={mutate} initialData={{}} />;
}

// 기존 데스크톱 화면. getServerSideProps가 없던 때처럼 서버는 비워 두고 클라이언트에서만 그린다
function DesktopAddReview() {
  const router = useRouter();
  const isMounted = useMount();
  const { id } = router.query;

  const pageId = Array.isArray(id) ? id[0] : id;
  if (!isMounted || !pageId) return null;

  return <AddReviewComponent id={pageId} />;
}

function AddReviewPage({ id, isMobile }: Props) {
  if (!isMobile) return <DesktopAddReview />;

  return (
    <>
      <MobilePageHeader title="리뷰 작성하기" />
      <ReviewCreatePage id={id} />
    </>
  );
}

AddReviewPage.requireAuth = true;

AddReviewPage.getLayout = (page: ReactNode) => {
  const { isMobile } = (page as ReactElement<Props>).props;

  return isMobile ? <SSRLayout mobileHeader="page">{page}</SSRLayout> : <Layout>{page}</Layout>;
};

export default AddReviewPage;
