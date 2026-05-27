import { cn } from '@bcsdlab/utils';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import MobileHomeRedesignHeader from 'components/layout/Header/MobileHomeRedesignHeader';
import MobileBottomNavigation from 'components/layout/MobileBottomNavigation';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useHomeExperimentVariant } from 'utils/zustand/homeExperiment';
import styles from './HomeLayout.module.scss';

function HomeLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery();
  const variant = useHomeExperimentVariant();
  const shouldShowRedesignHeader = isMobile && variant === 'redesign';

  return (
    <div
      id="root"
      className={cn({
        [styles.layout]: true,
        [styles['layout--redesign']]: shouldShowRedesignHeader,
      })}
    >
      {shouldShowRedesignHeader ? <MobileHomeRedesignHeader /> : <Header />}
      {children}
      {shouldShowRedesignHeader && <MobileBottomNavigation />}
      <Footer />
    </div>
  );
}

export default HomeLayout;
