import { useSuspenseQuery } from '@tanstack/react-query';
import useTokenState from 'utils/hooks/state/useTokenState';
import * as api from 'api';

export const useGetStoreReview = (shopId: string, reviewId: string) => {
  const token = useTokenState();
  const { data } = useSuspenseQuery({
    queryKey: ['review', shopId, reviewId],
    queryFn: () => api.review.getStoreReview(token, shopId, reviewId),
  });

  return data;
};
