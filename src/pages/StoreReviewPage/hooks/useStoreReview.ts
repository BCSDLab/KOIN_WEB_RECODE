import * as api from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewRequest } from 'api/review/entity';
import { useNavigate } from 'react-router-dom';
import { isKoinError } from '@bcsdlab/koin';
import showToast from 'utils/ts/showToast';

export const useReivewStore = (id: string) => {
  const queryClient = useQueryClient();
  const token = useTokenState();
  const navigate = useNavigate();
  const { mutate, error } = useMutation({
    mutationFn: (reviewData: ReviewRequest) => api.review.postStoreReview(token, id, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [] });
      navigate(`/store/${id!}`);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발생했습니다.');
      }
    },
  });

  return { mutate, error };
};
