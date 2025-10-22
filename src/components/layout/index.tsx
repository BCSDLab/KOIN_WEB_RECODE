import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { Suspense, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNativeWebView] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.webkit?.messageHandlers;
  });

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
