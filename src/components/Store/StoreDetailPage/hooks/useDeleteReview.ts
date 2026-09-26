import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeMutations } from 'api/store/mutations';
import { useKoinToast } from 'components/feedback/KoinToast/useKoinToast';
import showToast from 'utils/ts/showToast';

export const useDeleteReview = (shopId: string, reviewId: number) => {
  const openToast = useKoinToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...storeMutations.deleteReview(queryClient, reviewId, shopId, {
      onSuccess: () => openToast({ message: '리뷰가 삭제되었습니다.' }),
    }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return mutation;
};
