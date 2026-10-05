import FindIdLayout from 'components/Auth/FindIdPage/Mobile';
import MobileFindIdByPhone from 'components/Auth/FindIdPage/Mobile/PhonePage';
import PCFindIdByPhone from 'components/Auth/FindIdPage/PC/PhonePage';
import useMediaQuery from 'utils/hooks/layout/useMediaQuery';

function FindIdPage() {
  const isMobile = useMediaQuery();
  return isMobile ? <MobileFindIdByPhone /> : <PCFindIdByPhone />;
}

FindIdPage.getLayout = function getLayout(page: React.ReactNode) {
  return <FindIdLayout>{page}</FindIdLayout>;
};

export default FindIdPage;
