import { useLocation, useNavigate } from 'react-router-dom';
import {
  setRedirectPath,
  getRedirectPath,
  clearRedirectPath,
  redirectToLogin,
} from 'utils/ts/auth';

const isSafeExternalRedirect = (url: string) => {
  try {
    const u = new URL(url);

    return (
      u.hostname === 'order.koreatech.in'
      || u.hostname === 'order.stage.koreatech.in'
      || u.hostname === 'koreatech.in'
      || u.hostname.endsWith('.koreatech.in')
    );
  } catch {
    return false;
  }
};

export function useLoginRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectAfterLogin = () => {
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');

    if (!redirect) {
      const redirectPath = getRedirectPath() || '/';
      clearRedirectPath();
      navigate(redirectPath);
      return;
    }

    if (redirect.startsWith('http')) {
      if (isSafeExternalRedirect(redirect)) {
        window.location.href = redirect;
        return;
      }

      const redirectPath = getRedirectPath() || '/';
      clearRedirectPath();
      navigate(redirectPath);
      return;
    }

    navigate(redirect);
  };

  return {
    setRedirectPath,
    redirectToLogin,
    redirectAfterLogin,
  };
}
