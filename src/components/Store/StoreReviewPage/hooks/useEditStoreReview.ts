import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewMutations } from 'api/review/mutations';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export const useEditStoreReview = (shopId: string, reviewId: string) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const openToast = useKoinToast();
  const { mutate, error } = useMutation({
    ...reviewMutations.edit(queryClient, token, shopId, reviewId, {
      onSuccess: () => openToast({ message: '리뷰 수정이 완료되었습니다.' }),
    }),
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발생했습니다.');
      }
    },
  });

  return { mutate, error };
};
