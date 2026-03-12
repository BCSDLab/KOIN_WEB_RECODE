import { useSuspenseQuery } from '@tanstack/react-query';
import { abTestQueries } from 'api/abTest/queries';

export const useABTestView = (title: string, authorization?: string) => {
  const accessHistoryId = typeof window !== 'undefined' ? localStorage.getItem('access_history_id') : null;

  const { data: abTestView } = useSuspenseQuery(abTestQueries.assign(title, authorization, accessHistoryId));

  // 최초 편입 시
  if (abTestView.access_history_id) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_history_id', abTestView.access_history_id.toString());
    }
  }

  return abTestView.variable_name || 'default';
};
