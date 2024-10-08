import * as api from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewRequest } from 'api/review/entity';
import { isKoinError } from '@bcsdlab/koin';
import showToast from 'utils/ts/showToast';
import { useKoinToast } from 'utils/hooks/koinToast/useKoinToast';

export const useEditStoreReview = (shopId: string, reviewId: string) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const openToast = useKoinToast();
  const { mutate, error } = useMutation({
    mutationFn: (reviewData: ReviewRequest) => api.review
      .putStoreReview(token, shopId, reviewId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
      openToast({ message: '리뷰 수정이 완료되었습니다.' });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발생했습니다.');
      }
    },
  });

  return { mutate, error };
};
