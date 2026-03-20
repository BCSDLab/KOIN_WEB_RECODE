import { isKoinError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewMutations } from 'api/review/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

export const useAddStoreReview = (id: string) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { mutate, error } = useMutation({
    ...reviewMutations.add(queryClient, token, id),
    onError: (err) => {
      if (isKoinError(err)) {
        showToast('error', err.message || '에러가 발생했습니다.');
      }
    },
  });

  return { mutate, error };
};
