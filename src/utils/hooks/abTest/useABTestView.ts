import * as api from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useABTestView = (title: string, authorization?: string) => {
  const accessHistoryId = localStorage.getItem('access_history_id');
  const { data: abTestView } = useSuspenseQuery({
    queryKey: ['abTestView', title, accessHistoryId],
    queryFn: () => api.abTest.abTestAssign(title, authorization || undefined, accessHistoryId),
  });
  localStorage.setItem('access_history_id', abTestView.access_history_id.toString());
  return abTestView.variable_name;
};
