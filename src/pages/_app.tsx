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
import { WEB_AUTH_CSRF_COOKIE_KEY } from 'static/url';
import { ServerRequestProvider } from 'utils/context/serverRequest';
import useMount from 'utils/hooks/state/useMount';
import { getCookie } from 'utils/ts/cookie';
import { isomorphicLocalStorage } from 'utils/ts/env';
import { queryClient } from 'utils/ts/queryClient';
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

// access·refresh는 HttpOnly라 브라우저 JS가 값을 읽을 수 없다. CSRF 쿠키(로그인·리프레시와
// 같은 시점에 발급, 로그아웃 시 삭제)의 존재 여부를 "세션이 있을 가능성" 낙관적 신호로 쓴다.
// 실제 인증 실패는 API 401 → apiClient의 redirectToLogin()이 최종적으로 처리한다.
const useAuthGuard = (requireAuth: boolean | undefined) => {
  const router = useRouter();
  const isMount = useMount();

  useEffect(() => {
    if (!requireAuth) return;
    if (!isMount) return;

    const hasSession = getCookie(WEB_AUTH_CSRF_COOKIE_KEY);

    if (!hasSession) {
      // 하이드레이션 경합 방지
      router.replace(ROUTES.Main());
    }
  }, [isMount, requireAuth, router]);
};

// 메인 App 컴포넌트
export default function App({ Component, pageProps }: AppPropsWithAuth) {
  const router = useRouter();
  const [client] = React.useState(queryClient);
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

  const needAuth = Component.requireAuth;
  useAuthGuard(needAuth);

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
