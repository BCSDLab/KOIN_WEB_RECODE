import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { Suspense, useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNativeWebView, setIsNativeWebView] = useState(false);
  useEffect(() => {
    setIsNativeWebView(
      typeof window !== 'undefined' && !!window.webkit?.messageHandlers,
    );
  }, []);
  return (
    <div id="root">
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        {children}
      </Suspense>
      {!isNativeWebView && <Footer />}
    </div>
  );
}
