import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReview } from 'api/store';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';
import useTokenState from 'utils/hooks/state/useTokenState';

export const useDeleteReview = (shopId: string, reviewId: number) => {
  const token = useTokenState();
  const openToast = useKoinToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => deleteReview(reviewId, shopId, token),
    onSuccess: () => {
      openToast({ message: '리뷰가 삭제되었습니다.' });
      queryClient.invalidateQueries({ queryKey: ['review', Number(shopId)] });
    },
  });

  return mutation;
};
