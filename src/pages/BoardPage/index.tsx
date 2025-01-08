import { Suspense } from 'react';
import Footer from 'components/common/Footer';
import Header from 'components/common/Header';
import { Outlet } from 'react-router-dom';

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
