import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useTokenState from 'utils/hooks/state/useTokenState';
import { getMyReview } from 'api/store';

export const useGetMyReview = (shopId: string, sorter: string) => {
  const token = useTokenState();

  const { data } = useQuery({
    queryKey: ['review', 'myReview', sorter, shopId],
    queryFn: () => getMyReview(shopId, sorter, token),
    enabled: !!token,
    placeholderData: keepPreviousData,
  });

  return { data };
};
