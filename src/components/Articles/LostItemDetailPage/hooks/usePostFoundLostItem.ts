import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleMutations } from 'api/articles/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const usePostFoundLostItem = (articleId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = articleMutations.toggleLostItemFound(queryClient, token, articleId);

  const { mutate, isPending } = useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      showToast('success', '상태가 변경되었습니다.');
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate, isPending };
};

export default usePostFoundLostItem;
