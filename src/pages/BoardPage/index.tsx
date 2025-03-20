import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';

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
