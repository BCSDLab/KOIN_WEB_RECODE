import * as api from 'api';
import { useMutation } from '@tanstack/react-query';
import { ReviewRequest } from 'api/review/entity';
import { useNavigate } from 'react-router-dom';
import { isKoinError } from '@bcsdlab/koin';
import showToast from 'utils/ts/showToast';

export const useReivewStore = (id: string) => {
  const navigate = useNavigate();
  const { mutate, error } = useMutation({
    mutationFn: (reviewData: ReviewRequest) => api.review.postStoreReview(id, reviewData),
    onSuccess: () => {
      navigate(`/store/${id!}`);
    },
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발새했습니다.');
      }
    },
  });

  return { mutate, error };
};
