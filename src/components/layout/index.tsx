import { Suspense } from 'react';

import { cn } from '@bcsdlab/utils';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import styles from './Layout.module.scss';

interface SSRLayoutProps {
  children: React.ReactNode;
  mobileHeader?: MobileHeaderConfig;
  fitViewport?: boolean;
}

interface LayoutProps extends SSRLayoutProps {
  hideLayout?: boolean;
}

function getRootClassName(mobileHeader: MobileHeaderConfig | undefined, fitViewport: boolean | undefined) {
  if (mobileHeader?.type !== 'page' && mobileHeader?.type !== 'page-owned') return undefined;

  return cn({ [styles['root--page']]: true, [styles['root--fit-viewport']]: !!fitViewport });
}

export function SSRLayout({ children, mobileHeader, fitViewport }: SSRLayoutProps) {
  return (
    <div id="root" className={getRootClassName(mobileHeader, fitViewport)}>
      <Header mobileHeader={mobileHeader} />
      {children}
      <Footer />
    </div>
  );
}

export default function Layout({ children, mobileHeader, fitViewport, hideLayout = false }: LayoutProps) {
  const isMobile = useMediaQuery();
  const isNativeWebView = typeof window !== 'undefined' && !!window.webkit?.messageHandlers;

  if (isMobile && hideLayout) {
    return <>{children}</>;
  }

  return (
    <div id="root" className={getRootClassName(mobileHeader, fitViewport)}>
      <Suspense fallback={null}>
        <Header mobileHeader={mobileHeader} />
      </Suspense>
      <Suspense fallback={null}>{children}</Suspense>
      {!isNativeWebView && <Footer />}
    </div>
  );
}
