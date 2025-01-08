import {
  setRedirectPath,
  getRedirectPath,
  clearRedirectPath,
  redirectToLogin,
} from 'utils/ts/auth';
import { useNavigate } from 'react-router-dom';

export function useLoginRedirect() {
  const navigate = useNavigate();

  const redirectAfterLogin = () => {
    const redirectPath = getRedirectPath();
    clearRedirectPath();
    navigate(redirectPath);
  };

  return {
    setRedirectPath,
    redirectToLogin,
    redirectAfterLogin,
  };
}
