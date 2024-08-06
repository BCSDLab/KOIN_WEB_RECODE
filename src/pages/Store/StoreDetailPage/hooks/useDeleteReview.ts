import { useMutation } from '@tanstack/react-query';
import { deleteReview } from 'api/store';
import useTokenState from 'utils/hooks/state/useTokenState';

export const useDeleteReview = (shopId: string, reviewId: number) => {
  const token = useTokenState();
  const mutation = useMutation({
    mutationFn: () => deleteReview(reviewId, shopId, token),
  });

  return mutation;
};
