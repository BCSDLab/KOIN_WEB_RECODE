import { cn } from '@bcsdlab/utils';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import type { MobileHeaderConfig } from 'components/layout/Header/mobileHeaderConfig';
import MobileBottomNavigation from 'components/layout/MobileBottomNavigation';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

import styles from './HomeLayout.module.scss';

const HOME_MOBILE_HEADER: MobileHeaderConfig = { type: 'home' };

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
      <Header mobileHeader={HOME_MOBILE_HEADER} />
      {children}
      {isMobile && <MobileBottomNavigation />}
      <Footer />
    </div>
  );
}

export default HomeLayout;
