import * as api from 'api';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useABTestView = (title: string, authorization?: string, accessHistoryId?: string) => {
  const { data: abTestView } = useSuspenseQuery({
    queryKey: ['abTestView', title, accessHistoryId],
    queryFn: () => api.abTest.abTestAssign(title, authorization, accessHistoryId),
  });

  return { abTestView };
};
