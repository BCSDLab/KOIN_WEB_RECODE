import { useRouter } from 'next/router';

import useParamsHandler from 'utils/hooks/routing/useParamsHandler';
import { hasInAppHistory } from 'utils/ts/inAppNavigation';

const INFO_KEY = 'info';
const OPEN = 'open';

// 안내 패널 열림을 URL에 둬서 모바일 뒤로가기로 닫히게 한다
export default function useCafeteriaInfoParam() {
  const router = useRouter();
  const { params, setParams } = useParamsHandler();

  const open = () => setParams({ [INFO_KEY]: OPEN });

  const close = () => {
    if (hasInAppHistory()) {
      router.back();

      return;
    }

    setParams({ [INFO_KEY]: undefined }, { replacePage: true });
  };

  return { isOpen: params[INFO_KEY] === OPEN, open, close };
}
