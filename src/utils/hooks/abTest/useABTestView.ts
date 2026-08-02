import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { abTestQueries } from 'api/abTest/queries';
import useMount from 'utils/hooks/state/useMount';
import { isomorphicLocalStorage } from 'utils/ts/env';

/**
 * AB 배정은 클라이언트 전용이다.
 * 배정 결과는 호출마다 달라질 수 있는데 응답 HTML이 공유 캐시되므로, 서버에서 배정하면
 * 그 변형이 다른 사용자에게 그대로 전달된다. 서버·하이드레이션 렌더는 'default'로 고정한다.
 */
export const useABTestView = (title: string, authorization?: string) => {
  const isMounted = useMount();
  const accessHistoryId = isMounted ? isomorphicLocalStorage.getItem('access_history_id') : null;

  const { data: abTestView } = useSuspenseQuery(abTestQueries.assign(title, authorization, accessHistoryId));

  // 최초 편입 시
  useEffect(() => {
    if (abTestView.access_history_id) {
      isomorphicLocalStorage.setItem('access_history_id', abTestView.access_history_id.toString());
    }
  }, [abTestView.access_history_id]);

  if (!isMounted) return 'default';

  return abTestView.variable_name || 'default';
};
