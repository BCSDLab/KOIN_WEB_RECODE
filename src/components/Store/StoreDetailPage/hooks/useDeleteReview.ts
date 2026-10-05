import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { storeMutations } from 'api/store/mutations';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export const useDeleteReview = (shopId: string, reviewId: number) => {
  const token = useTokenState();
  const openToast = useKoinToast();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ...storeMutations.deleteReview(queryClient, reviewId, shopId, token, {
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
