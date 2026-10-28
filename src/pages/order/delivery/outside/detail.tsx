import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { SSRLayout } from 'components/layout';
import OrderViewport from 'components/Order/common/OrderViewport';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderDeliveryOutsideDetailPage from 'components/Order/OrderDelivery/OrderDeliveryOutsideDetailPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  roadAddress: string;
}

// 배달지 선택은 사용자별 화면이라 공개 캐시를 켜지 않는다.
// order는 도로명 주소를 location.state로 넘긴다. 여기서는 쿼리(roadAddress)로 받아 서버가 주소까지 렌더한다(규칙 10)
export const getServerSideProps = withCacheControl(
  (context: GetServerSidePropsContext, _cacheControl, serverRequest): Promise<{ props: Props }> => {
    const { roadAddress } = context.query;

    return Promise.resolve({
      props: {
        isDesktop: serverRequest?.device !== 'mobile',
        roadAddress: typeof roadAddress === 'string' ? roadAddress : '',
      },
    });
  },
);

function OrderDeliveryOutsideDetailRoute({ isDesktop, roadAddress }: Props) {
  return (
    <>
      {!isDesktop && <OrderViewport />}
      <StoreMobileHeader title="주소 상세" />
      {isDesktop ? <DesktopNotice /> : <OrderDeliveryOutsideDetailPage roadAddress={roadAddress} />}
    </>
  );
}

OrderDeliveryOutsideDetailRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderDeliveryOutsideDetailRoute;
