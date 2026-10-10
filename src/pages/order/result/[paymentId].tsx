import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { orderQueries } from 'api/order/queries';
import { SSRLayout } from 'components/layout';
import DesktopNotice from 'components/Order/DesktopNotice';
import OrderResultPage from 'components/Order/OrderResultPage';
import OrderResultHeader from 'components/Order/OrderResultPage/components/OrderResultHeader';
import ROUTES from 'static/routes';
import { withCacheControl } from 'utils/ssr/withCacheControl';
import { isNotFoundKoinError } from 'utils/ts/isr';

// useNaverMapsLoaded가 붙이는 지도 스크립트와 같은 주소(미리 받기용)
const NAVER_MAPS_SCRIPT_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}&submodules=geocoder`;

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

// 주문 결과는 사용자별 화면이라 공개 캐시를 켜지 않는다
export const getServerSideProps = withCacheControl(
  async (context: GetServerSidePropsContext<{ paymentId: string }>, _cacheControl, serverRequest) => {
    const paymentId = parsePaymentId(context.params?.paymentId);
    if (!paymentId) return { notFound: true as const };

    if (serverRequest?.device !== 'mobile') {
      return { props: { isDesktop: true, paymentId } };
    }

    // 로그인이면 order가 부르는 결제 정보만 서버에서 받아 본문까지 렌더한다.
    // 없는 주문(404)은 notFound로 응답하고, 그 밖의 실패는 결과를 내리지 않고 클라이언트가 다시 조회한다
    const queryClient = new QueryClient();
    if (serverRequest.isLoggedIn) {
      try {
        await queryClient.fetchQuery(orderQueries.paymentInfo(paymentId, true));
      } catch (error) {
        if (isNotFoundKoinError(error)) return { notFound: true as const };
      }
    }

    return { props: { isDesktop: false, paymentId, dehydratedState: dehydrate(queryClient) } };
  },
);

function OrderResultRoute({ isDesktop, paymentId }: Props) {
  const router = useRouter();

  // order 헤더: 결과 화면은 제목 없이 닫기 버튼으로 주문 홈에 간다(routeTitles에 없는 경로)
  const goToOrderHome = () => {
    router.replace(ROUTES.OrderHome());
  };

  return (
    <>
      {!isDesktop && (
        // order 웹뷰(index.html)와 같은 viewport로 배율을 1로 고정한다
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />
          {/* order는 index.html에서 지도 스크립트를 바로 불러 첫 렌더 때 지오코더가 준비돼 있다.
              여기선 지도 로더(useNaverMapsLoaded)가 마운트 후 붙이므로, 같은 주소를 미리 받아 둬 지도·가게 위치를 일찍 그린다 */}
          <link rel="preload" href={NAVER_MAPS_SCRIPT_URL} as="script" />
          <link rel="preconnect" href="https://maps.apigw.ntruss.com" />
        </Head>
      )}
      <OrderResultHeader onClose={goToOrderHome} />
      {isDesktop ? <DesktopNotice /> : <OrderResultPage paymentId={paymentId} />}
    </>
  );
}

OrderResultRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default OrderResultRoute;
