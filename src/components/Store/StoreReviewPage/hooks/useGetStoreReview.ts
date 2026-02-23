import { useSuspenseQuery } from '@tanstack/react-query';
import { getStoreReview } from 'api/review';
import useTokenState from 'utils/hooks/state/useTokenState';

export const useGetStoreReview = (shopId: string, reviewId: string) => {
  const token = useTokenState();
  const { data } = useSuspenseQuery({
    queryKey: ['review', shopId, reviewId],
    queryFn: () => getStoreReview(token, shopId, reviewId),
  });

  return data;
};
