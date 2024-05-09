import { ReactNode } from 'react';
import useTokenState from 'utils/hooks/useTokenState';
import { useAuthentication } from 'utils/zustand/authentication';
import { Navigate } from 'react-router-dom';

interface PirvateRouteProps {
  requireAuthentication: boolean;
  element: ReactNode;
}

export default function PrivateRoute({ element, requireAuthentication }: PirvateRouteProps) {
  const token = useTokenState();
  const isAuthenticated = useAuthentication();

  if (requireAuthentication && !token) {
    return <Navigate replace to="/" />;
  }

  if (requireAuthentication && !isAuthenticated) {
    return <Navigate replace to="/" />;
  }

  return <div>{element}</div>;
}
