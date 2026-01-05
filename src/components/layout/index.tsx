import { Suspense } from 'react';
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
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default function Layout({ children, hideLayout = false }: LayoutProps) {
  const isMobile = useMediaQuery();
  const isNativeWebView = typeof window !== 'undefined' && !!window.webkit?.messageHandlers;

  if (isMobile && hideLayout) {
    return <>{children}</>;
  }

  return (
    <div id="root">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>{children}</Suspense>
      {!isNativeWebView && <Footer />}
    </div>
  );
}
