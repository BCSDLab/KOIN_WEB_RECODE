import { Suspense } from 'react';

import RetryBoundary from 'components/boundary/RetryBoundary';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

interface LayoutProps {
  children: React.ReactNode;
  hideLayout?: boolean;
}

export function SSRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="root">
      <RetryBoundary fallback={null}>
        <Header />
      </RetryBoundary>
      <RetryBoundary>{children}</RetryBoundary>
      <Footer />
    </div>
  );
}

export default function Layout({ children, hideLayout = false }: LayoutProps) {
  const isMobile = useMediaQuery();
  const isNativeWebView = typeof window !== 'undefined' && !!window.webkit?.messageHandlers;

  if (isMobile && hideLayout) {
    return <RetryBoundary>{children}</RetryBoundary>;
  }

  return (
    <div id="root">
      <RetryBoundary fallback={null}>
        <Suspense fallback={null}>
          <Header />
        </Suspense>
      </RetryBoundary>
      <RetryBoundary>
        <Suspense fallback={null}>{children}</Suspense>
      </RetryBoundary>
      {!isNativeWebView && <Footer />}
    </div>
  );
}
