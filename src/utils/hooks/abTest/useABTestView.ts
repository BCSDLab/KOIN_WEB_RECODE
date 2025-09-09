/* eslint-disable max-len */
import * as api from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useABTestView = (title: string, authorization?: string) => {
  const accessHistoryId = typeof window !== 'undefined'
    ? localStorage.getItem('access_history_id')
    : null;

  const { data: abTestView } = useSuspenseQuery({
    queryKey: ['abTestView', title, accessHistoryId],
    queryFn: async () => {
      try {
        const response = await api.abTest.abTestAssign(title, authorization || undefined, accessHistoryId);
        return response;
      } catch (error) {
        return { access_history_id: null, variable_name: 'default' };
      }
    },
  });

  // 최초 편입 시
  if (abTestView.access_history_id) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_history_id', abTestView.access_history_id.toString());
    }
  }

  return abTestView.variable_name || 'default';
};
