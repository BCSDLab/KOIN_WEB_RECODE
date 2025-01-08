/* eslint-disable max-len */
import { useSuspenseQuery } from '@tanstack/react-query';
import * as api from 'api';

export const useABTestView = (title: string, authorization?: string) => {
  const accessHistoryId = localStorage.getItem('access_history_id');

  const { data: abTestView } = useSuspenseQuery({
    queryKey: ['abTestView', title, accessHistoryId],
    queryFn: async () => {
      try {
        const response = await api.abTest.abTestAssign(
          title,
          authorization || undefined,
          accessHistoryId
        );
        return response;
      } catch (error) {
        return { access_history_id: null, variable_name: 'default' };
      }
    },
  });

  if (abTestView.access_history_id) {
    localStorage.setItem('access_history_id', abTestView.access_history_id.toString());
  }

  return abTestView.variable_name || 'default';
};
