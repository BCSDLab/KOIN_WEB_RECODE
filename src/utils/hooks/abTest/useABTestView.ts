import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { abTestQueries } from 'api/abTest/queries';
import useMount from 'utils/hooks/state/useMount';
import { isomorphicLocalStorage } from 'utils/ts/env';

/**
 * AB 배정은 클라이언트 전용이다.
 *
 * 배정 결과는 호출마다 달라질 수 있는데 응답 HTML이 공유 캐시되므로, 서버에서 배정하면
 * 그 변형이 다른 사용자에게 그대로 전달된다. 또 배정 키에 브라우저에만 있는
 * access_history_id 가 들어가 SSR과 클라이언트가 서로 다른 배정을 받는다.
 *
 * 따라서 렌더 결과만 고정하는 것으로는 부족하고 `요청 자체`를 마운트 이후로 미뤄야 한다.
 * useSuspenseQuery 는 enabled 를 무시하므로 useQuery 를 쓴다.
 */
export const useABTestView = (title: string, authorization?: string) => {
  const isMounted = useMount();
  const accessHistoryId = isMounted ? isomorphicLocalStorage.getItem('access_history_id') : null;

  const { data: abTestView } = useQuery({
    ...abTestQueries.assign(title, authorization, accessHistoryId),
    enabled: isMounted,
  });

  // 최초 편입 시
  useEffect(() => {
    if (abTestView?.access_history_id) {
      isomorphicLocalStorage.setItem('access_history_id', abTestView.access_history_id.toString());
    }
  }, [abTestView?.access_history_id]);

  return abTestView?.variable_name || 'default';
};
