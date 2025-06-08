import { Navigate, Outlet, useLocation } from 'react-router-dom';

function PCFindIdPage() {
  const location = useLocation();

  if (location.pathname === '/auth/findid') {
    return <Navigate to="phone" replace />;
  }

  return (
    <Outlet />
  );
}

export default PCFindIdPage;
