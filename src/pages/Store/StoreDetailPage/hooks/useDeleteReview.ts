import { useMutation } from '@tanstack/react-query';
import { deleteReview } from 'api/store';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';
import useTokenState from 'utils/hooks/state/useTokenState';

export const useDeleteReview = (shopId: string, reviewId: number) => {
  const token = useTokenState();
  const openToast = useKoinToast();
  const mutation = useMutation({
    mutationFn: () => deleteReview(reviewId, shopId, token),
    onSuccess: () => {
      openToast({ message: '리뷰가 삭제되었습니다.' });
    },
  });

  return mutation;
};
