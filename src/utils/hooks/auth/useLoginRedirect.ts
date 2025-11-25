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

  const navigateToFallback = () => {
    const redirectPath = getRedirectPath() || '/';
    clearRedirectPath();
    navigate(redirectPath, { replace: true });
  };

  const redirectAfterLogin = () => {
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect');

    if (!redirect) {
      navigateToFallback();
      return;
    }

    const isAbsoluteUrl = redirect.startsWith('http://') || redirect.startsWith('https://');

    if (isAbsoluteUrl) {
      if (isSafeExternalRedirect(redirect)) {
        window.location.href = redirect;
      } else {
        navigateToFallback();
      }
      return;
    }

    navigate(redirect, { replace: true });
  };

  return {
    setRedirectPath,
    redirectToLogin,
    redirectAfterLogin,
  };
}
