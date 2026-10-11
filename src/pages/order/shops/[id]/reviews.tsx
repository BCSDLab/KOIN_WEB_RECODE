import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderShopReviewsPage from 'components/Order/OrderShopReviewsPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';

interface Props {
  id: string;
  isDesktop: boolean;
}

export const getServerSideProps = withCacheControl(
  (context: GetServerSidePropsContext<{ id: string }>, cacheControl, serverRequest) => {
    const id = context.params?.id;
    if (!id) return Promise.resolve({ notFound: true as const });

    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return Promise.resolve({ props: { id, isDesktop: serverRequest?.device !== 'mobile' } });
  },
);

function OrderShopReviewsRoute({ id, isDesktop }: Props) {
  return (
    <>
      <StoreMobileHeader title="리뷰" />
      {isDesktop ? <DesktopNotice /> : <OrderShopReviewsPage id={id} />}
    </>
  );
}

OrderShopReviewsRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderShopReviewsRoute;
