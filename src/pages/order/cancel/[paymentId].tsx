import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { SSRLayout } from 'components/layout';
import OrderViewport from 'components/Order/common/OrderViewport';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderCancelPage from 'components/Order/OrderCancelPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  paymentId: number;
}

const parsePaymentId = (value: unknown) => {
  const paymentId = typeof value === 'string' ? Number(value) : Number.NaN;

  return Number.isInteger(paymentId) && paymentId > 0 ? paymentId : null;
};

// 주문 취소는 사용자별 화면이라 공개 캐시를 켜지 않는다. order는 이 화면에서 조회 요청을 보내지 않는다
export const getServerSideProps = withCacheControl(
  (context: GetServerSidePropsContext<{ paymentId: string }>, _cacheControl, serverRequest) => {
    const paymentId = parsePaymentId(context.params?.paymentId);
    if (!paymentId) return Promise.resolve({ notFound: true as const });

    return Promise.resolve({ props: { isDesktop: serverRequest?.device !== 'mobile', paymentId } });
  },
);

function OrderCancelRoute({ isDesktop, paymentId }: Props) {
  return (
    <>
      {!isDesktop && <OrderViewport />}
      <StoreMobileHeader title="주문 취소하기" background="gray" />
      {isDesktop ? <DesktopNotice /> : <OrderCancelPage paymentId={paymentId} />}
    </>
  );
}

OrderCancelRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderCancelRoute;
