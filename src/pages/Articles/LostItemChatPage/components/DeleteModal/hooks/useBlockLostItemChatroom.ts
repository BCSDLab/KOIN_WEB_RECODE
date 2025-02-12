import { isKoinError, sendClientError } from '@bcsdlab/koin';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postBlockLostItemChatroom } from 'api/articles';
import useTokenState from 'utils/hooks/state/useTokenState';
import showToast from 'utils/ts/showToast';

const useDeleteLostItemChatroom = () => {
  const token = useTokenState();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ articleId, chatroomId }: { articleId: number, chatroomId: number }) => (
      postBlockLostItemChatroom(token, articleId, chatroomId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatroom', 'lost-item'] });
      showToast('success', '채팅방이 차단되었습니다.');
    },
    onError: (e) => {
      if (isKoinError(e)) {
        showToast('error', e.message);
      } else sendClientError(e);
    },
  });

  return { mutate };
};

export default useDeleteLostItemChatroom;
