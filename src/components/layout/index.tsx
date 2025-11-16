import { Suspense } from 'react';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  const isNativeWebView = typeof window !== 'undefined' && !!window.webkit?.messageHandlers;

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
