import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getMyReview } from 'api/store';
import useTokenState from 'utils/hooks/state/useTokenState';

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
