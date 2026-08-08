import { useSyncExternalStore } from 'react';
import { useServerRequest } from 'utils/context/serverRequest';

const MOBILE_QUERY = '(max-width: 576px)';

function subscribeToMediaQuery(query: string) {
  return (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {};

    const matchMedia = window.matchMedia(query);
    const handleChange = () => onStoreChange();

    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  };
}

/**
 * 서버 스냅샷은 서버가 UA로 판정한 기기를 따른다.
 *
 * 서버 스냅샷은 SSR과 하이드레이션 렌더에만 쓰이고, 그 직후 실제 `matchMedia` 값으로 다시
 * 그려진다. 예전처럼 항상 `false`(데스크톱)를 반환하면 모바일 사용자는 매번 서버가 그린
 * DOM을 통째로 버리게 된다. UA로 맞춰두면 대다수는 두 값이 같아 교체가 일어나지 않는다.
 *
 * UA 판정(기기 종류)과 `max-width`(뷰포트 폭)는 재는 대상이 달라 완전히 일치하지는 않는다.
 * 어긋나는 경우(창을 좁힌 데스크톱 등)는 마운트 직후 보정되며, 이는 기존 동작과 같다.
 *
 * 기본 쿼리가 아닌 임의 쿼리는 서버가 판정할 수 없으므로 기존대로 `false`로 둔다.
 */
export default function useMediaQuery(query: string = MOBILE_QUERY): boolean {
  const serverRequest = useServerRequest();
  const serverSnapshot = query === MOBILE_QUERY && serverRequest ? serverRequest.device === 'mobile' : false;

  return useSyncExternalStore(
    subscribeToMediaQuery(query),
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(query).matches;
    },
    () => serverSnapshot,
  );
}
