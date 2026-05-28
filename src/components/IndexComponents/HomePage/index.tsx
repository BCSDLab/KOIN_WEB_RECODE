import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import { useHomeExperimentVariant } from 'utils/zustand/homeExperiment';
import DesktopHome from './DesktopHome';
import MobileHome from './MobileHome';
import type { HomePageProps } from './types';

function HomePage(props: HomePageProps) {
  const isMobile = useMediaQuery();
  const variant = useHomeExperimentVariant();

  if (!isMobile) {
    return <DesktopHome {...props} />;
  }

  return <MobileHome {...props} variant={variant} />;
}

export default HomePage;
