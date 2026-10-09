import type { ReactElement } from 'react';
import type { GetServerSidePropsContext } from 'next';

import { SSRLayout } from 'components/layout';
import MobilePageHeader from 'components/layout/MobilePageHeader';
import StoreSearchPage from 'components/Store/mobile/StoreSearchPage';
import ROUTES from 'static/routes';
import { STORE_PUBLIC_SSR_CACHE_CONTROL, withCacheControl } from 'utils/ssr/withCacheControl';

export const getServerSideProps = withCacheControl(
  (_context: GetServerSidePropsContext, cacheControl, serverRequest) => {
    // 모바일 전용 화면. 데스크톱은 서버가 확정한 기기 값으로 기존 화면에 보낸다
    if (serverRequest?.device !== 'mobile') {
      return Promise.resolve({ redirect: { destination: ROUTES.Store(), permanent: false } });
    }

    cacheControl.enablePublicCache(STORE_PUBLIC_SSR_CACHE_CONTROL);

    return Promise.resolve({ props: {} });
  },
);

function StoreSearchRoute() {
  return (
    <>
      <MobilePageHeader title="검색" />
      <StoreSearchPage />
    </>
  );
}

StoreSearchRoute.getLayout = (page: ReactElement) => <SSRLayout mobileHeader="page">{page}</SSRLayout>;

export default StoreSearchRoute;
