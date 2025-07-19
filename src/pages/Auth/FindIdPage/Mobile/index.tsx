import { Navigate, Outlet, useLocation } from 'react-router-dom';
import MobileLayout from './Layout';

function MobileFindIdPage() {
  const location = useLocation();

  if (location.pathname === '/auth/findid') {
    return <Navigate to="phone" replace />;
  }

  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  );
}

export default MobileFindIdPage;
