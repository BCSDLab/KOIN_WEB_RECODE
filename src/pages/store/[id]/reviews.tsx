import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { SSRLayout } from 'components/layout';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import StoreReviewsPage from 'components/Store/mobile/StoreReviewsPage';
import ROUTES from 'static/routes';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';

interface Props {
  id: string;
}

export const getServerSideProps = withCacheControl(
  (context: GetServerSidePropsContext<{ id: string }>, cacheControl, serverRequest) => {
    const id = context.params?.id;
    if (!id) return Promise.resolve({ notFound: true as const });

    // 모바일 전용 화면. 데스크톱은 서버가 확정한 기기 값으로 기존 화면에 보낸다
    if (serverRequest?.device !== 'mobile') {
      return Promise.resolve({ redirect: { destination: ROUTES.StoreDetail({ id }), permanent: false } });
    }

    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return Promise.resolve({ props: { id } });
  },
);

function StoreReviewsRoute({ id }: Props) {
  return (
    <>
      <StoreMobileHeader title="리뷰" />
      <StoreReviewsPage id={id} />
    </>
  );
}

StoreReviewsRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default StoreReviewsRoute;
