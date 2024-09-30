import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useABTestView } from 'utils/hooks/abTest/useABTestView';

function BoardPage() {
  const token = useTokenState();
  const ab = useABTestView('benefitPage', token);
  console.log(ab);
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}

export default BoardPage;
