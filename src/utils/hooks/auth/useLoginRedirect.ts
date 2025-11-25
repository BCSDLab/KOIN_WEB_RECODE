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

export function useLoginRedirect() {
  const router = useRouter();

  const redirectAfterLogin = () => {
    const { redirect } = router.query;

    if (typeof redirect === 'string' && redirect.length > 0) {
      if (redirect.startsWith('http')) {
        if (isSafeExternalRedirect(redirect)) {
          window.location.href = redirect;
          return;
        }
      } else {
        router.push(redirect);
        return;
      }
    }

    const redirectPath = getRedirectPath();
    clearRedirectPath();
    router.push(redirectPath);
  };

  return {
    setRedirectPath,
    redirectToLogin,
    redirectAfterLogin,
  };
}
