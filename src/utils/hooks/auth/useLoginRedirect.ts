import { useRouter } from 'next/router';
import { setRedirectPath, getRedirectPath, clearRedirectPath, redirectToLogin } from 'utils/ts/auth';

const isSafeExternalRedirect = (url: string) => {
  try {
    const u = new URL(url);

    return (
      u.hostname === 'order.koreatech.in' ||
      u.hostname === 'order.stage.koreatech.in' ||
      u.hostname === 'koreatech.in' ||
      u.hostname.endsWith('.koreatech.in')
    );
  } catch {
    return false;
  }
};

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
  const router = useRouter();

  const navigateToFallback = () => {
    const redirectPath = getRedirectPath() || '/';
    clearRedirectPath();
    router.replace(redirectPath);
  };

  const redirectAfterLogin = () => {
    const { redirect } = router.query;

    if (typeof redirect !== 'string' || redirect.length === 0) {
      navigateToFallback();
      return;
    }

    const isAbsoluteUrl = redirect.startsWith('http://') || redirect.startsWith('https://');

    if (!isAbsoluteUrl) return;
    if (isSafeExternalRedirect(redirect)) {
      window.location.href = redirect;
    } else {
      navigateToFallback();
    }

    router.replace(redirect);
  };

  return {
    setRedirectPath,
    redirectToLogin,
    redirectAfterLogin,
  };
}
