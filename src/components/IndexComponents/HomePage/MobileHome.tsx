import MobileHomeLegacy from './MobileHomeLegacy';
import MobileHomeRedesign from './MobileHomeRedesign';
import type { HomePageProps } from './types';
import type { HomeExperimentVariant } from 'utils/zustand/homeExperiment';

function MobileHome({ variant, ...props }: HomePageProps & { variant: HomeExperimentVariant }) {
  if (variant === 'redesign') {
    return <MobileHomeRedesign />;
  }

  return <MobileHomeLegacy {...props} />;
}

export default MobileHome;
