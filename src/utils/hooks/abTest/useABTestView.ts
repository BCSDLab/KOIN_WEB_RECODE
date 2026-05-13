import { useSuspenseQuery } from '@tanstack/react-query';
import { abTestQueries } from 'api/abTest/queries';
import { isomorphicLocalStorage } from 'utils/ts/env';

export const useABTestView = (title: string, authorization?: string) => {
  const accessHistoryId = isomorphicLocalStorage.getItem('access_history_id');

  const { data: abTestView } = useSuspenseQuery(abTestQueries.assign(title, authorization, accessHistoryId));

  // 최초 편입 시
  if (abTestView.access_history_id) {
    isomorphicLocalStorage.setItem('access_history_id', abTestView.access_history_id.toString());
  }

  return abTestView.variable_name || 'default';
};
