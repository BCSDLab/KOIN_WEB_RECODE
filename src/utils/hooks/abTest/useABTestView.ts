import { abTestAssign } from 'api/abTest';
import { useQuery } from '@tanstack/react-query';

export const useABTestView = (title: string, authorization?: string, accessHistoryId?: string) => {
  const { data: abTestView } = useQuery({
    queryKey: ['abTestView', title, accessHistoryId],
    queryFn: () => abTestAssign(title, authorization, accessHistoryId),
  });

  return { abTestView };
};
