import { cn } from '@bcsdlab/utils';
import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import MobileHomeRedesignHeader from 'components/layout/Header/MobileHomeRedesignHeader';
import MobileBottomNavigation from 'components/layout/MobileBottomNavigation';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import styles from './HomeLayout.module.scss';

function HomeLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery();

  return (
    <div
      id="root"
      className={cn({
        [styles.layout]: true,
        [styles['layout--mobile-redesign']]: isMobile,
      })}
    >
      {isMobile ? <MobileHomeRedesignHeader /> : <Header />}
      {children}
      {isMobile && <MobileBottomNavigation />}
      <Footer />
    </div>
  );
}

export default HomeLayout;
