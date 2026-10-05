import { useRouter } from 'next/router';
import { setRedirectPath, getRedirectPath, clearRedirectPath, redirectToLogin } from 'utils/ts/auth';

const isSafeExternalRedirect = (url: string) => {
  try {
    const { hostname } = new URL(url);

    return (
      hostname === 'order.koreatech.in' ||
      hostname === 'order.stage.koreatech.in' ||
      hostname === 'koreatech.in' ||
      hostname.endsWith('.koreatech.in')
    );
  } catch {
    return false;
  }
};

type RedirectTarget = { type: 'external' | 'internal'; destination: string } | { type: 'fallback' };

function resolveRedirectTarget(redirect: unknown): RedirectTarget {
  if (typeof redirect !== 'string' || redirect.length === 0) return { type: 'fallback' };

  const isAbsoluteUrl = redirect.startsWith('http://') || redirect.startsWith('https://');
  if (isAbsoluteUrl) {
    return isSafeExternalRedirect(redirect) ? { type: 'external', destination: redirect } : { type: 'fallback' };
  }

  const isInternalPath = redirect.startsWith('/') && !redirect.startsWith('//');
  return isInternalPath ? { type: 'internal', destination: redirect } : { type: 'fallback' };
}

export function useLoginRedirect() {
  const router = useRouter();

  const navigateToFallback = () => {
    const redirectPath = getRedirectPath() || '/';
    clearRedirectPath();
    router.replace(redirectPath);
  };

  const redirectAfterLogin = () => {
    const target = resolveRedirectTarget(router.query.redirect);

    if (target.type === 'fallback') {
      navigateToFallback();
      return;
    }

    if (target.type === 'external') {
      window.location.href = target.destination;
      return;
    }

    router.replace(target.destination);
  };

  return {
    setRedirectPath,
    redirectToLogin,
    redirectAfterLogin,
  };
}
