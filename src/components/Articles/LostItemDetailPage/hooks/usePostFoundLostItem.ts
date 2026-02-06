import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postFoundLostItem } from 'api/articles';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const usePostFoundLostItem = (articleId: number) => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await postFoundLostItem(token, articleId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lostItem', 'detail', articleId] });
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
