import Header from 'components/common/Header';
import Footer from 'components/common/Footer';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingSpinner from 'components/common/LoadingSpinner';

function BoardPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<LoadingSpinner size="100px" />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
}

export default BoardPage;
