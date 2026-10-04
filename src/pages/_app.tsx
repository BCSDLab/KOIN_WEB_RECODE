import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import './index.scss';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { pretendard } from 'assets/font';
import Toast from 'components/feedback/Toast';
import Layout from 'components/layout';
import MaintenancePage from 'components/Maintenance';
import PortalProvider from 'components/modal/Modal/PortalProvider';
import Seo from 'components/seo/Seo';
import ROUTES from 'static/routes';
import { clearLegacySessionStorage } from 'utils/auth/legacyStorage';
import { useSessionState } from 'utils/hooks/auth/useSession';
import { ServerRequestProvider } from 'utils/ssr/useServerRequest';
import { isomorphicLocalStorage } from 'utils/ts/env';
import { markInAppNavigation } from 'utils/ts/inAppNavigation';
import { createQueryClient, queryClient } from 'utils/ts/queryClient';
import { useServerStateStore } from 'utils/zustand/serverState';

interface PageProps {
  dehydratedState?: unknown;
  [key: string]: unknown;
}

// 커스텀 페이지 타입
type NextPageWithAuth<Props = PageProps, IP = Props> = NextPage<Props, IP> & {
  requireAuth?: boolean;
  title?: string | ((path: string) => string);
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type AppPropsWithAuth = Omit<AppProps, 'Component'> & {
  Component: NextPageWithAuth;
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// 서버 확인으로 비로그인이 확정되면 메인으로 보낸다. 확정 전의 anonymous는 믿지 않는다(refresh로 로그인일 수 있다).
function AuthGuard({ requireAuth }: { requireAuth: boolean | undefined }) {
  const router = useRouter();
  const { session, resolved } = useSessionState();

  useEffect(() => {
    if (requireAuth && resolved && session.status === 'anonymous') router.replace(ROUTES.Main());
  }, [requireAuth, resolved, session.status, router]);

  return null;
}

// 메인 App 컴포넌트
export default function App({ Component, pageProps }: AppPropsWithAuth) {
  const router = useRouter();
  // 서버에서는 요청마다 새 QueryClient를 쓴다. 모듈 싱글턴을 공유하면 HydrationBoundary가 캐시에 이미 있는
  // 쿼리의 하이드레이션을 effect로 미루는데(서버에선 실행되지 않음), 그 결과 이전 요청 사용자의 데이터가 렌더된다.
  const [client] = React.useState(() => (typeof window === 'undefined' ? createQueryClient() : queryClient));
  const isMaintenance = useServerStateStore((state) => state.isMaintenance);

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  const getPageTitle = (): string | undefined => {
    if (!Component.title) return undefined;

    return typeof Component.title === 'function' ? Component.title(router.asPath) : Component.title;
  };

  const pageTitle = getPageTitle();

  useEffect(() => {
    // 로깅을 위한 userId 전달 및 gtag 함수 정의
    if (typeof window !== 'undefined') {
      const userId = isomorphicLocalStorage.getItem('uuid') || '';

      window.dataLayer = window.dataLayer || [];

      if (userId) {
        window.dataLayer.push({
          user_id: userId,
          event: 'userIdAvailable',
        });
      }

      if (typeof window.gtag === 'undefined') {
        window.gtag = ((...args: Gtag.GtagCommands[]) => {
          if (window.dataLayer === undefined) return;
          window.dataLayer.push(args);
        }) as Gtag.Gtag;
      }
    }
  }, []);

  useEffect(() => {
    clearLegacySessionStorage();
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', markInAppNavigation);

    return () => router.events.off('routeChangeComplete', markInAppNavigation);
  }, [router.events]);

  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <div className={`${pretendard.variable} ${pretendard.className}`}>
      <QueryClientProvider client={client}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          {/* Google Tag Manager */}
          {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

          {/* Google Analytics */}
          {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

          <ServerRequestProvider value={pageProps.serverRequest ?? null}>
            <PortalProvider>
              <AuthGuard requireAuth={Component.requireAuth} />
              <Seo title={pageTitle} />
              {getLayout(<Component {...pageProps} />)}
              <Toast />
            </PortalProvider>
          </ServerRequestProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </div>
  );
}
