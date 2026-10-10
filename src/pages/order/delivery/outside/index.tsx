import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderDeliveryOutsidePage from 'components/Order/OrderDelivery/OrderDeliveryOutsidePage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
}

// 배달지 선택은 사용자별 화면이라 공개 캐시를 켜지 않는다. 첫 화면은 검색 안내만 있어 받아 둘 데이터가 없다
export const getServerSideProps = withCacheControl(
  (_context: GetServerSidePropsContext, _cacheControl, serverRequest): Promise<{ props: Props }> =>
    Promise.resolve({ props: { isDesktop: serverRequest?.device !== 'mobile' } }),
);

function OrderDeliveryOutsideRoute({ isDesktop }: Props) {
  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
      )}
      <StoreMobileHeader title="주소 상세" />
      {isDesktop ? <DesktopNotice /> : <OrderDeliveryOutsidePage />}
    </>
  );
}

OrderDeliveryOutsideRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderDeliveryOutsideRoute;
