import { cn } from '@bcsdlab/utils';
import RetryBoundary from 'components/boundary/RetryBoundary';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import MobileHomeRedesignHeader from 'components/layout/Header/MobileHomeRedesignHeader';
import MobileBottomNavigation from 'components/layout/MobileBottomNavigation';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import styles from './HomeLayout.module.scss';

interface HomeLayoutProps {
  children: React.ReactNode;
  whiteMobileBg?: boolean;
}

function HomeLayout({ children, whiteMobileBg }: HomeLayoutProps) {
  const isMobile = useMediaQuery();

  return (
    <div
      id="root"
      className={cn({
        [styles.layout]: true,
        [styles['layout--mobile-redesign']]: isMobile,
        [styles['layout--white']]: isMobile && !!whiteMobileBg,
      })}
    >
      {isMobile ? <MobileHomeRedesignHeader /> : <Header />}
      <RetryBoundary>{children}</RetryBoundary>
      {isMobile && <MobileBottomNavigation />}
      <Footer />
    </div>
  );
}

export default HomeLayout;
