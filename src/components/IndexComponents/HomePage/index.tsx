import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import DesktopHome from './DesktopHome';
import MobileHomeRedesign from './MobileHomeRedesign';
import type { HomePageProps } from './types';

function HomePage(props: HomePageProps) {
  const isMobile = useMediaQuery();

  if (!isMobile) {
    return <DesktopHome {...props} />;
  }

  return <MobileHomeRedesign />;
}

export default HomePage;
