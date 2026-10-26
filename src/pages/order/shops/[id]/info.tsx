import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderShopInfoPage from 'components/Order/OrderShopInfoPage';
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

function OrderShopInfoRoute({ id, isDesktop }: Props) {
  return (
    <>
      <StoreMobileHeader title="상점 정보" />
      {isDesktop ? <DesktopNotice /> : <OrderShopInfoPage id={id} />}
    </>
  );
}

OrderShopInfoRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderShopInfoRoute;
