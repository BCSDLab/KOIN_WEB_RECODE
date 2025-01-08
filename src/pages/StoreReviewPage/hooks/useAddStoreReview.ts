import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isKoinError } from '@bcsdlab/koin';
import { ReviewRequest } from 'api/review/entity';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';
import * as api from 'api';

export const useAddStoreReview = (id: string) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation({
    mutationFn: (reviewData: ReviewRequest) => api.review.postStoreReview(token, id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['review'] });
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발생했습니다.');
      }
    },
  });

  return { mutate, error };
};
