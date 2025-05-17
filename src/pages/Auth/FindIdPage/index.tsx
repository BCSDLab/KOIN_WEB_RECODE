import useMediaQuery from 'utils/hooks/layout/useMediaQuery';
import MobileFindIdPage from './Mobile';
import PCFindIdPage from './PC';

function FindIdPage() {
  const isMobile = useMediaQuery();
  return isMobile ? <MobileFindIdPage /> : <PCFindIdPage />;
}

export default FindIdPage;
