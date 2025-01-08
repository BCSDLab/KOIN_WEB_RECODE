import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useTokenState from 'utils/hooks/state/useTokenState';
import ROUTES from 'static/routes';
// import { useAuthentication } from 'utils/zustand/authentication';

interface PirvateRouteProps {
  requireAuthentication: boolean;
  element: ReactNode;
}

export default function PrivateRoute({ element, requireAuthentication }: PirvateRouteProps) {
  const token = useTokenState();
  // const isAuthenticated = useAuthentication();

  if (requireAuthentication && !token) {
    return <Navigate replace to={ROUTES.Main()} />;
  }

  // if (requireAuthentication && !isAuthenticated) {
  //   return <Navigate replace to="/" />;
  // }

  return <div>{element}</div>;
}
