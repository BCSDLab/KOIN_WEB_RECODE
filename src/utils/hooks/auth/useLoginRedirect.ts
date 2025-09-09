import { useRouter } from 'next/router';
import {
  setRedirectPath, getRedirectPath, clearRedirectPath, redirectToLogin,
} from 'utils/ts/auth';

export function useLoginRedirect() {
  const router = useRouter();

  const redirectAfterLogin = () => {
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
