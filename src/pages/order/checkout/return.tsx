import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderPaymentReturnPage, { type PaymentReturnParams } from 'components/Order/OrderPaymentReturnPage';
import StoreMobileHeader from 'components/Store/mobile/common/StoreMobileHeader';
import { withCacheControl } from 'utils/ssr/withCacheControl';

// withCacheControl의 SSRPageProps(Record<string, unknown>)에 맞추려고 인덱스 시그니처를 둔다
interface Props {
  [key: string]: unknown;
  isDesktop: boolean;
  payment: PaymentReturnParams | null;
}

const getQueryValue = (value: unknown) => (typeof value === 'string' && value ? value : null);

// order처럼 Toss successUrl의 파라미터가 하나라도 없으면 승인하지 않고 안내만 그린다
const parsePaymentParams = (query: GetServerSidePropsContext['query']): PaymentReturnParams | null => {
  const orderType = getQueryValue(query.orderType);
  const orderId = getQueryValue(query.orderId);
  const paymentKey = getQueryValue(query.paymentKey);
  const amount = getQueryValue(query.amount);

  if (!orderType || !orderId || !paymentKey || !amount) return null;

  return { orderType, orderId, paymentKey, amount };
};

// 결제 승인은 사용자별 화면이라 공개 캐시를 켜지 않는다. 승인 요청은 클라이언트에서 한 번만 보낸다
export const getServerSideProps = withCacheControl(
  (context: GetServerSidePropsContext, _cacheControl, serverRequest): Promise<{ props: Props }> =>
    Promise.resolve({
      props: {
        isDesktop: serverRequest?.device !== 'mobile',
        payment: parsePaymentParams(context.query),
      },
    }),
);

function OrderCheckoutReturnRoute({ isDesktop, payment }: Props) {
  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
        </Head>
      )}
      {/* order의 결제 승인 화면은 앱 레이아웃 밖이라 헤더가 없다(결제 중·파라미터 부족 모두) */}
      {isDesktop && <StoreMobileHeader title="주문" />}
      {isDesktop ? <DesktopNotice /> : <OrderPaymentReturnPage payment={payment} />}
    </>
  );
}

OrderCheckoutReturnRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderCheckoutReturnRoute;
