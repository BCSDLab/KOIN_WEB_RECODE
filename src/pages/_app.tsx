import type { AppProps } from 'next/app';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import './index.scss';
import PortalProvider from 'components/modal/Modal/PortalProvider';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'components/feedback/Toast';
import Script from 'next/script';
import Layout from 'components/layout';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import useAutoLogin from 'utils/hooks/auth/useAutoLogin';
import { requestTokensFromNative, setTokensFromNative } from 'utils/ts/iosBridge';
import { useServerStateStore } from 'utils/zustand/serverState';
import MaintenancePage from 'components/Maintenance';

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        [name: string]: { postMessage(body: unknown): void };
      };
    };
    onNativeCallback?: (callbackId: string, result: any) => void;
    setTokens?: (access: string, refresh: string) => void;
    NativeBridge?: {
      call: (methodName: string, ...args: any[]) => Promise<any>;
      handleCallback: (callbackId: string, result: any) => void;
    };
  }
}

// 커스텀 페이지 타입
type NextPageWithAuth<Props = any, IP = Props> = NextPage<Props, IP> & {
  requireAuth?: boolean;
  title?: string | ((path: string) => string);
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

type AppPropsWithAuth = Omit<AppProps, 'Component'> & {
  Component: NextPageWithAuth;
};

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: false,
      enabled: typeof window !== 'undefined',
    },
  },
});

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function AutoLogin() {
  useAutoLogin();
  return null;
}

// 메인 App 컴포넌트
export default function App({ Component, pageProps }: AppPropsWithAuth) {
  const router = useRouter();
  const [client] = React.useState(queryClient);
  const isMaintenance = useServerStateStore((state) => state.isMaintenance);

  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  const pageTitle = React.useMemo(() => {
    if (!Component.title) return 'KOIN';
    return typeof Component.title === 'function'
      ? Component.title(router.asPath)
      : Component.title;
  }, [Component, router.asPath]);

  // ios 브릿지
  useEffect(() => {
    // 앱 로드 시 토큰 요청 정의
    const initializeTokens = async () => {
      const tokens = await requestTokensFromNative();
      if (tokens.access || tokens.refresh) {
        setTokensFromNative(tokens.access, tokens.refresh);
      }
    };
    if (typeof window !== 'undefined' && window.webkit?.messageHandlers) {
      // 네이티브에서 토큰을 전달받을 함수 등록
      window.setTokens = setTokensFromNative;

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/auth')) {
        initializeTokens();
      }
    }
    // window.setTokens 관련 오류 테스트
    // return () => {
    //   if (typeof window !== 'undefined' && window.webkit?.messageHandlers) {
    //     delete window.setTokens;
    //   }
    // };
  }, []);

  if (isMaintenance) {
    return <MaintenancePage />;
  }

  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        {/* Google Tag Manager */}
        {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}

        {/* Google Analytics */}
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}

        {/* Naver Maps */}
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAPS_CLIENT_ID}`}
          strategy="afterInteractive"
        />
        <PortalProvider>
          <Head>
            <title>{pageTitle}</title>
          </Head>
          <AutoLogin />
          {getLayout(<Component {...pageProps} />)}
          <Toast />
        </PortalProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
