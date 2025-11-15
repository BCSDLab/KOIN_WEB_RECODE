import { Suspense, useEffect, useState } from 'react';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';

export function SSRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="root">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNativeWebView, setIsNativeWebView] = useState(false);
  useEffect(() => {
    setIsNativeWebView(typeof window !== 'undefined' && !!window.webkit?.messageHandlers);
  }, []);
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
