import * as api from 'api';
import useTokenState from 'utils/hooks/state/useTokenState';
import { useMutation } from '@tanstack/react-query';
import { ReviewRequest } from 'api/review/entity';
import { useNavigate } from 'react-router-dom';
import { isKoinError } from '@bcsdlab/koin';
import showToast from 'utils/ts/showToast';

export const useEditStoreReview = (shopId: string, reviewId: string) => {
  const token = useTokenState();
  const navigate = useNavigate();
  const { mutate, error } = useMutation({
    mutationFn: (reviewData: ReviewRequest) => api.review
      .putStoreReview(token, shopId, reviewId, reviewData),
    onSuccess: () => {
      navigate(`/store/${shopId!}`);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발생했습니다.');
      }
    },
  });

  return { mutate, error };
};
