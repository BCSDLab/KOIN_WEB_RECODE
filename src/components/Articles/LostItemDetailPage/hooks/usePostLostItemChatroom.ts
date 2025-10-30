import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postLostItemChatroom } from 'api/articles';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const usePostLostItemChatroom = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (articleId: number) => {
      const response = await postLostItemChatroom(token, articleId);
      return response;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chatroom', 'lost-item'] }),
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutateAsync };
};

export default usePostLostItemChatroom;
