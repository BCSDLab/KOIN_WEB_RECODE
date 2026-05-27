import Footer from 'components/layout/Footer';
import Header from 'components/layout/Header';
import MobileHomeRedesignHeader from 'components/layout/Header/MobileHomeRedesignHeader';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useHomeExperimentVariant } from 'utils/zustand/homeExperiment';

function HomeLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery();
  const variant = useHomeExperimentVariant();
  const shouldShowRedesignHeader = isMobile && variant === 'redesign';

  return (
    <div id="root">
      {shouldShowRedesignHeader ? <MobileHomeRedesignHeader /> : <Header />}
      {children}
      <Footer />
    </div>
  );
}

export default HomeLayout;
