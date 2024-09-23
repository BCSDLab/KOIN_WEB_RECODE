import * as api from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useABTestView = (title: string, authorization?: string) => {
  const accessHistoryId = localStorage.getItem('access_history_id');
  const { data: abTestView } = useSuspenseQuery({
    queryKey: ['abTestView', title, accessHistoryId],
    queryFn: () => api.abTest.abTestAssign(title, authorization, accessHistoryId),
  });
  const result = abTestView.variable_name;
  return result;
};
