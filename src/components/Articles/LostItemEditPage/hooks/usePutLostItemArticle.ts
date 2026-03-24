import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleMutations } from 'api/articles/mutations';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const usePutLostItemArticle = (articleId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const mutation = articleMutations.updateLostItem(queryClient, token, articleId);
  const { status, mutateAsync } = useMutation({
    ...mutation,
    onSuccess: async (...args) => {
      await mutation.onSuccess?.(...args);
      showToast('success', '게시글 수정이 완료되었습니다.');
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { status, mutateAsync };
};

export default usePutLostItemArticle;
