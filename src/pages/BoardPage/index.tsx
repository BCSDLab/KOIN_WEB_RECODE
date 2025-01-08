import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';

function BoardPage() {
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
