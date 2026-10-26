import { useRouter } from 'next/router';

import ROUTES from 'static/routes';
import { hasInAppHistory } from 'utils/ts/inAppNavigation';

// 링크로 바로 들어와 앱 안에 돌아갈 페이지가 없으면 fallback으로 보낸다
export default function useGoBack() {
  const router = useRouter();

  return (fallback: string = ROUTES.Main()) => {
    if (hasInAppHistory()) {
      router.back();

      return;
    }

    router.push(fallback);
  };
}
