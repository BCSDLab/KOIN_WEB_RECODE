import { Suspense } from 'react';
import { useRouter } from 'next/router';

import { cn } from '@bcsdlab/utils';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import type { MobileHeaderConfig, PageHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import { MobilePageHeaderFrame, PageOwnedHeaderProvider } from 'components/layout/MobilePageHeader';
import useLogger from 'utils/hooks/analytics/useLogger';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import useGoBack from 'utils/hooks/routing/useGoBack';

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

function ConfiguredPageHeader({ config }: { config: PageHeaderConfig }) {
  const router = useRouter();
  const logger = useLogger();
  const goBack = useGoBack();
  const { title: Title, rightAction: RightAction, background, onBack } = config;

  return (
    <MobilePageHeaderFrame
      title={typeof Title === 'string' ? Title : <Title />}
      rightAction={RightAction && <RightAction />}
      background={background}
      onBack={onBack && (() => onBack({ router, logger, goBack }))}
    />
  );
}

function PageContent({ mobileHeader, children }: Pick<SSRLayoutProps, 'mobileHeader' | 'children'>) {
  return (
    <>
      {mobileHeader?.type === 'page' && (
        <Suspense fallback={null}>
          <ConfiguredPageHeader config={mobileHeader} />
        </Suspense>
      )}
      <PageOwnedHeaderProvider value={mobileHeader?.type === 'page-owned'}>{children}</PageOwnedHeaderProvider>
    </>
  );
}

export function SSRLayout({ children, mobileHeader, fitViewport }: SSRLayoutProps) {
  return (
    <div id="root" className={getRootClassName(mobileHeader, fitViewport)}>
      <Header mobileHeader={mobileHeader} />
      <PageContent mobileHeader={mobileHeader}>{children}</PageContent>
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
      <PageContent mobileHeader={mobileHeader}>
        <Suspense fallback={null}>{children}</Suspense>
      </PageContent>
      {!isNativeWebView && <Footer />}
    </div>
  );
}
