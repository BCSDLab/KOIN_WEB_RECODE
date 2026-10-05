import FindIdLayout from 'components/Auth/FindIdPage/Mobile';
import MobileFindIdByEmail from 'components/Auth/FindIdPage/Mobile/EmailPage';
import PCFindIdByEmail from 'components/Auth/FindIdPage/PC/EmailPage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

function FindIdPage() {
  const isMobile = useMediaQuery();
  return isMobile ? <MobileFindIdByEmail /> : <PCFindIdByEmail />;
}

FindIdPage.getLayout = function getLayout(page: React.ReactNode) {
  return <FindIdLayout>{page}</FindIdLayout>;
};

export default FindIdPage;
