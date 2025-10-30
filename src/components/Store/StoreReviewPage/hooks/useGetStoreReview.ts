import * as api from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useSuspenseQuery } from '@tanstack/react-query';

export const useGetStoreReview = (shopId: string, reviewId: string) => {
  const token = useTokenState();
  const { data } = useSuspenseQuery({
    queryKey: ['review', shopId, reviewId],
    queryFn: () => api.review.getStoreReview(token, shopId, reviewId),
  });

  return data;
};
